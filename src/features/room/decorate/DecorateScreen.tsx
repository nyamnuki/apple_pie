import { useMemo, useState } from 'react';
import ZoomableRoom from './ZoomableRoom';
import AppShell from '../../../components/AppShell';
import ScreenHeader from '../../../components/ScreenHeader';
import RoomView, { spotKey, wallKey, type FloorGhost, type WallGhostSpot } from '../RoomView';
import FurnitureTray from './FurnitureTray';
import SelectedActions from './SelectedActions';
import PlacingPanel from './PlacingPanel';
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
// 찾은 칸에 바로 놓지 않고 '여기는 어때요?' 하고 미리 보여준 뒤, 아이가 한 번 더 눌러야 놓는다.
function nearestSpot(spots: Set<string>, gx: number, gy: number): [number, number] | null {
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

// 누른 벽 칸에 걸 수 없으면 같은 벽의 바로 옆 칸 (이것도 미리 보여주기만 한다)
function nearestWallSpot(spots: Set<string>, wall: WallSide, slot: number): number | null {
  for (const s of [slot - 1, slot + 1]) if (spots.has(wallKey(wall, s))) return s;
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
  // '여기는 어때요?' 하고 권하는 근처 자리 (바닥 또는 벽)
  const [suggest, setSuggest] = useState<{ gx: number; gy: number } | { wall: WallSide; slot: number } | null>(null);
  // 마우스·키보드로 가리키는 칸 (미리 보기)
  const [hover, setHover] = useState<{ gx: number; gy: number } | null>(null);
  // 피드백: 방금 놓은 가구 (빛 퍼짐), 돌릴 수 없을 때 흔들기
  const [celebrate, setCelebrate] = useState<{ uid: string; n: number } | null>(null);
  const [shake, setShake] = useState<{ uid: string; n: number } | null>(null);

  const change = (next: Mode, message: TranslationKey | null = null) => {
    setMode(next);
    setFlash(message);
    setSuggest(null);
    setHover(null);
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
  // 바닥 칸에 놓기·옮기기 (놓을 수 있는 칸인지 미리 확인된 상태)
  const putFloor = (x: number, y: number) => {
    if (mode.kind !== 'placing' && mode.kind !== 'moving') return;
    play.place();
    const uid = mode.kind === 'placing' ? newUid(mode.furnitureId) : mode.uid;
    if (mode.kind === 'placing') dispatch({ type: 'place', item: { uid, furnitureId: mode.furnitureId, gx: x, gy: y, rotation: 0 } });
    else dispatch({ type: 'move', uid, gx: x, gy: y });
    setCelebrate((c) => ({ uid, n: (c?.n ?? 0) + 1 }));
    change({ kind: 'selected', uid }, 'decorate.placed');
  };

  const tapTile = (gx: number, gy: number) => {
    if (mode.kind === 'placing' || mode.kind === 'moving') {
      if (validSpots?.has(spotKey(gx, gy))) return putFloor(gx, gy);
      // 놓을 수 없는 칸: 바로 옆 빈 칸을 반짝이며 권한다 (저절로 놓지 않는다)
      const near = validSpots ? nearestSpot(validSpots, gx, gy) : null;
      setHover(null);
      if (!near) {
        setSuggest(null);
        play.nope();
        return setFlash('decorate.spotTaken');
      }
      setSuggest({ gx: near[0], gy: near[1] });
      return setFlash('decorate.tryHere');
    }
    // 빈 바닥을 누르면 선택을 푼다
    if (mode.kind === 'selected') change({ kind: 'idle' });
  };

  // 벽 칸을 눌렀을 때 (벽 장식 걸기·옮기기)
  const putWall = (wall: WallSide, slot: number) => {
    if (mode.kind !== 'placing' && mode.kind !== 'moving') return;
    play.place();
    if (mode.kind === 'placing') {
      const uid = newUid(mode.furnitureId);
      dispatch({ type: 'placeWall', item: { uid, furnitureId: mode.furnitureId, wall, slot } });
      return change({ kind: 'selected', uid }, 'decorate.placed');
    }
    dispatch({ type: 'moveWall', uid: mode.uid, wall, slot });
    change({ kind: 'selected', uid: mode.uid }, 'decorate.placed');
  };

  const tapWall = (wall: WallSide, slot: number) => {
    if (!validWallSpots || (mode.kind !== 'placing' && mode.kind !== 'moving')) return;
    if (validWallSpots.has(wallKey(wall, slot))) return putWall(wall, slot);
    const s = nearestWallSpot(validWallSpots, wall, slot);
    if (s === null) {
      setSuggest(null);
      play.nope();
      return setFlash('decorate.spotTaken');
    }
    setSuggest({ wall, slot: s });
    setFlash('decorate.tryHere');
  };

  // 권한 자리에 놓기 ('여기에 놓기' 버튼)
  const acceptSuggest = () => {
    if (!suggest) return;
    if ('wall' in suggest) putWall(suggest.wall, suggest.slot);
    else putFloor(suggest.gx, suggest.gy);
  };

  const turn = () => {
    if (!selectedItem) return;
    const next = selectedItem.rotation === 0 ? 1 : 0;
    if (!canPlace(layout.placed, selectedItem.furnitureId, next, selectedItem.gx, selectedItem.gy, selectedItem.uid)) {
      // 돌릴 자리가 없으면 가구를 살짝 흔들어 '안 돼요'를 보여준다 (글을 못 읽어도 알 수 있게)
      setShake((s) => ({ uid: selectedItem.uid, n: (s?.n ?? 0) + 1 }));
      play.nope();
      return setFlash('decorate.cantTurn');
    }
    play.place();
    dispatch({ type: 'rotate', uid: selectedItem.uid });
    setFlash('decorate.turned');
  };

  const putAway = () => {
    if (!activeUid) return;
    dispatch({ type: 'remove', uid: activeUid });
    change({ kind: 'idle' });
  };

  const selectedDef = selectedItem ? getFurniture(selectedItem.furnitureId) : selectedWall ? getFurniture(selectedWall.furnitureId) : undefined;
  const picking = mode.kind === 'placing' || mode.kind === 'moving';
  // 지금 놓으려는 물건 (놓기: 목록에서 고른 것, 옮기기: 고른 가구)
  const pickingDef = placingDef ?? (mode.kind === 'moving' ? selectedDef : undefined);

  // 미리 보기: 권하는 자리가 우선, 아니면 마우스·키보드로 가리키는 놓을 수 있는 칸
  const ghost: FloorGhost | null = (() => {
    if (!pickingDef || isWallItem(pickingDef)) return null;
    const rotation = mode.kind === 'moving' && selectedItem ? selectedItem.rotation : 0;
    if (suggest && 'gx' in suggest) return { def: pickingDef, ...suggest, rotation, suggested: true };
    if (hover && validSpots?.has(spotKey(hover.gx, hover.gy))) return { def: pickingDef, ...hover, rotation, suggested: false };
    return null;
  })();
  const wallGhost: WallGhostSpot | null = pickingDef && suggest && 'wall' in suggest ? { def: pickingDef, ...suggest, suggested: true } : null;

  return (
    <AppShell background="bg-gradient-to-b from-cream to-moss">
      <ScreenHeader title={t('decorate.title')} onBack={onBack} />

      {/* 안내 문구: 화면 읽기 프로그램도 바뀔 때마다 읽어 준다 */}
      <p aria-live="polite" className="mb-2 min-h-[2.5rem] rounded-2xl bg-cream/80 px-4 py-2 text-center text-lg font-semibold">
        {t(flash ?? MODE_HINT[mode.kind])}
      </p>

      <div className="flex min-h-0 flex-1 flex-col gap-3 [@media(max-height:500px)]:flex-row">
        <ZoomableRoom className="min-h-[240px] flex-1 [@media(max-height:500px)]:min-h-0">
          <RoomView
            layout={layout}
            selectedUid={activeUid}
            validSpots={validSpots}
            onTileClick={tapTile}
            onFurnitureClick={(uid) => change({ kind: 'selected', uid })}
            validWallSpots={validWallSpots}
            wallBand={(placingDef ?? (selectedWall && getFurniture(selectedWall.furnitureId)))?.wallBand ?? 'middle'}
            onWallClick={tapWall}
            onTileHover={picking ? setHover : undefined}
            ghost={ghost}
            wallGhost={wallGhost}
            shake={shake}
            celebrate={celebrate}
          />
        </ZoomableRoom>

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
          ) : picking && pickingDef ? (
            <PlacingPanel
              def={pickingDef}
              moving={mode.kind === 'moving'}
              suggested={Boolean(suggest)}
              onAccept={acceptSuggest}
              onCancel={() => change(mode.kind === 'moving' ? { kind: 'selected', uid: mode.uid } : { kind: 'idle' })}
            />
          ) : (
            <FurnitureTray layout={layout} owned={game.furniture} onPick={pick} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
