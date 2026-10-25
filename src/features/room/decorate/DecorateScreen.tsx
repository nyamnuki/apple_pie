import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import AppShell from '../../../components/AppShell';
import BigButton from '../../../components/BigButton';
import ScreenHeader from '../../../components/ScreenHeader';
import RoomView, { spotKey, wallKey } from '../RoomView';
import FurnitureTray from './FurnitureTray';
import SelectedActions from './SelectedActions';
import { GRID } from '../iso';
import { canPlace, canPlaceWall, isWallItem } from '../placement';
import { newUid, useRoom } from '../RoomProvider';
import { getFurniture } from '../../../data/furniture/furniture';
import { useGame } from '../../../app/GameProvider';
import { useSound } from '../../../services/audio/SoundProvider';
import { useI18n, type TranslationKey } from '../../../i18n';
import type { PlacedFurniture, WallItem, WallSide } from '../../../types/furniture';

// 꾸미기 화면의 상태
type Mode =
  | { kind: 'idle' } // 아무것도 안 고름 → 아래 목록이 보인다
  | { kind: 'placing'; furnitureId: string } // 목록에서 고른 물건을 놓을 칸을 고르는 중
  | { kind: 'selected'; uid: string } // 방의 가구를 고름 → 옮기기/돌리기/치우기
  | { kind: 'moving'; uid: string }; // 고른 가구를 옮길 칸을 고르는 중

const MODE_HINT: Record<Mode['kind'], TranslationKey> = {
  idle: 'decorate.hintPick',
  placing: 'decorate.hintPlace',
  selected: 'decorate.hintSelected',
  moving: 'decorate.hintMove',
};

// 누른 칸에 놓을 수 없으면, 바로 옆(대각선 포함)에서 놓을 수 있는 칸을 찾는다.
// 휴대폰에서는 바닥 칸이 작아서(약 56×28px) 아이 손가락이 옆 칸을 누르기 쉽기 때문이다.
function nearestSpot(spots: Set<string>, gx: number, gy: number): [number, number] | null {
  if (spots.has(spotKey(gx, gy))) return [gx, gy];
  let best: [number, number] | null = null;
  let bestDist = Infinity;
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      const dist = dx * dx + dy * dy;
      if (dist > 0 && dist < bestDist && spots.has(spotKey(gx + dx, gy + dy))) {
        best = [gx + dx, gy + dy];
        bestDist = dist;
      }
    }
  return best;
}

// 벽 장식을 걸 수 있는 모든 벽 칸 ('left:2' 형식)
function findWallSpots(wallItems: WallItem[], furnitureId: string, ignoreUid?: string) {
  const spots = new Set<string>();
  for (const wall of ['left', 'right'] as WallSide[])
    for (let slot = 0; slot < GRID; slot++) if (canPlaceWall(wallItems, furnitureId, wall, slot, ignoreUid)) spots.add(wallKey(wall, slot));
  return spots;
}

// 누른 벽 칸에 걸 수 없으면 같은 벽의 바로 옆 칸
function nearestWallSpot(spots: Set<string>, wall: WallSide, slot: number): number | null {
  for (const s of [slot, slot - 1, slot + 1]) if (spots.has(wallKey(wall, s))) return s;
  return null;
}

// 물건을 놓을 수 있는 모든 칸
function findSpots(placed: PlacedFurniture[], furnitureId: string, rotation: 0 | 1, ignoreUid?: string) {
  const spots = new Set<string>();
  for (let gy = 0; gy < GRID; gy++)
    for (let gx = 0; gx < GRID; gx++) if (canPlace(placed, furnitureId, rotation, gx, gy, ignoreUid)) spots.add(spotKey(gx, gy));
  return spots;
}

export default function DecorateScreen({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const { layout, dispatch } = useRoom();
  const { game } = useGame();
  const { play } = useSound();
  const [mode, setMode] = useState<Mode>({ kind: 'idle' });
  // 잠깐 보여주는 안내 (예: '거기는 자리가 없어요'). 상태가 바뀌면 사라진다.
  const [flash, setFlash] = useState<TranslationKey | null>(null);

  const change = (next: Mode, message: TranslationKey | null = null) => {
    setMode(next);
    setFlash(message);
  };

  const activeUid = mode.kind === 'selected' || mode.kind === 'moving' ? mode.uid : null;
  const selectedItem = activeUid ? layout.placed.find((p) => p.uid === activeUid) : undefined; // 바닥 가구
  const selectedWall = activeUid ? layout.wallItems.find((w) => w.uid === activeUid) : undefined; // 벽 장식
  const placingDef = mode.kind === 'placing' ? getFurniture(mode.furnitureId) : undefined;

  // 바닥을 고르는 중이면 놓을 수 있는 칸 목록을 만든다
  const validSpots = useMemo(() => {
    if (mode.kind === 'placing' && !isWallItem(placingDef)) return findSpots(layout.placed, mode.furnitureId, 0);
    if (mode.kind === 'moving' && selectedItem) return findSpots(layout.placed, selectedItem.furnitureId, selectedItem.rotation, selectedItem.uid);
    return null;
  }, [mode, layout.placed, selectedItem, placingDef]);

  // 벽 칸을 고르는 중이면 걸 수 있는 벽 칸 목록
  const validWallSpots = useMemo(() => {
    if (mode.kind === 'placing' && isWallItem(placingDef)) return findWallSpots(layout.wallItems, mode.furnitureId);
    if (mode.kind === 'moving' && selectedWall) return findWallSpots(layout.wallItems, selectedWall.furnitureId, selectedWall.uid);
    return null;
  }, [mode, layout.wallItems, selectedWall, placingDef]);

  // 목록에서 물건을 눌렀을 때
  const pick = (furnitureId: string) => {
    const def = getFurniture(furnitureId);
    if (!def) return;
    if (def.category === 'wallpaper') {
      const on = layout.wallpaperId !== furnitureId;
      dispatch({ type: 'setWallpaper', wallpaperId: on ? furnitureId : null });
      change({ kind: 'idle' }, on ? 'decorate.wallpaperOn' : 'decorate.wallpaperOff');
      return;
    }
    // 아직 안 놓은 것이 있으면 놓을 자리 고르기, 다 놓았으면 방에 있는 것을 고른 상태로
    const inRoom: { uid: string; furnitureId: string }[] = isWallItem(def) ? layout.wallItems : layout.placed;
    const placedCount = inRoom.filter((p) => p.furnitureId === furnitureId).length;
    if ((game.furniture[furnitureId] ?? 0) <= placedCount) {
      const existing = inRoom.find((p) => p.furnitureId === furnitureId);
      if (existing) change({ kind: 'selected', uid: existing.uid });
      return;
    }
    const free = isWallItem(def) ? findWallSpots(layout.wallItems, furnitureId) : findSpots(layout.placed, furnitureId, 0);
    if (free.size === 0) return change({ kind: 'idle' }, isWallItem(def) ? 'decorate.noWallSpace' : 'decorate.noSpace');
    change({ kind: 'placing', furnitureId }, isWallItem(def) ? 'decorate.hintPlaceWall' : null);
  };

  // 바닥 칸을 눌렀을 때
  const tapTile = (gx: number, gy: number) => {
    if (mode.kind === 'placing' || mode.kind === 'moving') {
      const spot = validSpots ? nearestSpot(validSpots, gx, gy) : null;
      if (!spot) return setFlash('decorate.spotTaken');
      const [x, y] = spot;
      play.place();
      if (mode.kind === 'placing') {
        const uid = newUid(mode.furnitureId);
        dispatch({ type: 'place', item: { uid, furnitureId: mode.furnitureId, gx: x, gy: y, rotation: 0 } });
        return change({ kind: 'selected', uid }, 'decorate.placed');
      }
      dispatch({ type: 'move', uid: mode.uid, gx: x, gy: y });
      return change({ kind: 'selected', uid: mode.uid }, 'decorate.placed');
    }
    // 빈 바닥을 누르면 선택을 푼다
    if (mode.kind === 'selected') change({ kind: 'idle' });
  };

  // 벽 칸을 눌렀을 때 (벽 장식 걸기·옮기기)
  const tapWall = (wall: WallSide, slot: number) => {
    if (!validWallSpots || (mode.kind !== 'placing' && mode.kind !== 'moving')) return;
    const s = nearestWallSpot(validWallSpots, wall, slot);
    if (s === null) return setFlash('decorate.spotTaken');
    play.place();
    if (mode.kind === 'placing') {
      const uid = newUid(mode.furnitureId);
      dispatch({ type: 'placeWall', item: { uid, furnitureId: mode.furnitureId, wall, slot: s } });
      return change({ kind: 'selected', uid }, 'decorate.placed');
    }
    dispatch({ type: 'moveWall', uid: mode.uid, wall, slot: s });
    change({ kind: 'selected', uid: mode.uid }, 'decorate.placed');
  };

  const turn = () => {
    if (!selectedItem) return;
    const next = selectedItem.rotation === 0 ? 1 : 0;
    if (!canPlace(layout.placed, selectedItem.furnitureId, next, selectedItem.gx, selectedItem.gy, selectedItem.uid)) return setFlash('decorate.cantTurn');
    dispatch({ type: 'rotate', uid: selectedItem.uid });
    setFlash(null);
  };

  const putAway = () => {
    if (!activeUid) return;
    dispatch({ type: 'remove', uid: activeUid });
    change({ kind: 'idle' });
  };

  const selectedDef = selectedItem ? getFurniture(selectedItem.furnitureId) : selectedWall ? getFurniture(selectedWall.furnitureId) : undefined;
  const picking = mode.kind === 'placing' || mode.kind === 'moving';

  return (
    <AppShell background="bg-gradient-to-b from-cream to-moss">
      <ScreenHeader title={t('decorate.title')} onBack={onBack} />

      {/* 안내 문구: 화면 읽기 프로그램도 바뀔 때마다 읽어 준다 */}
      <p aria-live="polite" className="mb-2 min-h-[2.5rem] rounded-2xl bg-cream/80 px-4 py-2 text-center text-lg font-semibold">
        {t(flash ?? MODE_HINT[mode.kind])}
      </p>

      <div className="flex min-h-0 flex-1 flex-col gap-3 [@media(max-height:500px)]:flex-row">
        <div className="min-h-[240px] flex-1 [@media(max-height:500px)]:min-h-0">
          <RoomView
            layout={layout}
            selectedUid={activeUid}
            validSpots={validSpots}
            onTileClick={tapTile}
            onFurnitureClick={(uid) => change({ kind: 'selected', uid })}
            validWallSpots={validWallSpots}
            wallBand={(placingDef ?? (selectedWall && getFurniture(selectedWall.furnitureId)))?.wallBand ?? 'middle'}
            onWallClick={tapWall}
          />
        </div>

        <div className="[@media(max-height:500px)]:w-72 [@media(max-height:500px)]:overflow-y-auto">
          {mode.kind === 'selected' && selectedDef ? (
            <SelectedActions
              def={selectedDef}
              onMove={() => change({ kind: 'moving', uid: mode.uid })}
              // 벽 장식은 돌리지 않는다
              onTurn={selectedWall ? undefined : turn}
              onPutAway={putAway}
              onDone={() => change({ kind: 'idle' })}
            />
          ) : picking ? (
            <BigButton variant="soft" className="w-full" onClick={() => change(mode.kind === 'moving' ? { kind: 'selected', uid: mode.uid } : { kind: 'idle' })}>
              <X size={26} strokeWidth={3} aria-hidden />
              {t('decorate.cancel')}
            </BigButton>
          ) : (
            <FurnitureTray layout={layout} owned={game.furniture} onPick={pick} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
