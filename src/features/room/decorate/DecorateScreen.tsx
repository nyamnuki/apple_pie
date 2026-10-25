import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import AppShell from '../../../components/AppShell';
import BigButton from '../../../components/BigButton';
import ScreenHeader from '../../../components/ScreenHeader';
import RoomView, { spotKey } from '../RoomView';
import FurnitureTray from './FurnitureTray';
import SelectedActions from './SelectedActions';
import { GRID } from '../iso';
import { canPlace } from '../placement';
import { newUid, useRoom } from '../RoomProvider';
import { getFurniture } from '../../../data/furniture/furniture';
import { useGame } from '../../../app/GameProvider';
import { useI18n, type TranslationKey } from '../../../i18n';
import type { PlacedFurniture } from '../../../types/furniture';

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
  const [mode, setMode] = useState<Mode>({ kind: 'idle' });
  // 잠깐 보여주는 안내 (예: '거기는 자리가 없어요'). 상태가 바뀌면 사라진다.
  const [flash, setFlash] = useState<TranslationKey | null>(null);

  const change = (next: Mode, message: TranslationKey | null = null) => {
    setMode(next);
    setFlash(message);
  };

  const selectedItem = mode.kind === 'selected' || mode.kind === 'moving' ? layout.placed.find((p) => p.uid === mode.uid) : undefined;

  // 바닥을 고르는 중이면 놓을 수 있는 칸 목록을 만든다
  const validSpots = useMemo(() => {
    if (mode.kind === 'placing') return findSpots(layout.placed, mode.furnitureId, 0);
    if (mode.kind === 'moving' && selectedItem) return findSpots(layout.placed, selectedItem.furnitureId, selectedItem.rotation, selectedItem.uid);
    return null;
  }, [mode, layout.placed, selectedItem]);

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
    const placedCount = layout.placed.filter((p) => p.furnitureId === furnitureId).length;
    if ((game.furniture[furnitureId] ?? 0) <= placedCount) {
      const existing = layout.placed.find((p) => p.furnitureId === furnitureId);
      if (existing) change({ kind: 'selected', uid: existing.uid });
      return;
    }
    if (findSpots(layout.placed, furnitureId, 0).size === 0) return change({ kind: 'idle' }, 'decorate.noSpace');
    change({ kind: 'placing', furnitureId });
  };

  // 바닥 칸을 눌렀을 때
  const tapTile = (gx: number, gy: number) => {
    if (mode.kind === 'placing') {
      if (!validSpots?.has(spotKey(gx, gy))) return setFlash('decorate.spotTaken');
      const uid = newUid(mode.furnitureId);
      dispatch({ type: 'place', item: { uid, furnitureId: mode.furnitureId, gx, gy, rotation: 0 } });
      return change({ kind: 'selected', uid }, 'decorate.placed');
    }
    if (mode.kind === 'moving') {
      if (!validSpots?.has(spotKey(gx, gy))) return setFlash('decorate.spotTaken');
      dispatch({ type: 'move', uid: mode.uid, gx, gy });
      return change({ kind: 'selected', uid: mode.uid }, 'decorate.placed');
    }
    // 빈 바닥을 누르면 선택을 푼다
    if (mode.kind === 'selected') change({ kind: 'idle' });
  };

  const turn = () => {
    if (!selectedItem) return;
    const next = selectedItem.rotation === 0 ? 1 : 0;
    if (!canPlace(layout.placed, selectedItem.furnitureId, next, selectedItem.gx, selectedItem.gy, selectedItem.uid)) return setFlash('decorate.cantTurn');
    dispatch({ type: 'rotate', uid: selectedItem.uid });
    setFlash(null);
  };

  const putAway = () => {
    if (!selectedItem) return;
    dispatch({ type: 'remove', uid: selectedItem.uid });
    change({ kind: 'idle' });
  };

  const selectedDef = selectedItem ? getFurniture(selectedItem.furnitureId) : undefined;
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
            selectedUid={selectedItem?.uid ?? null}
            validSpots={validSpots}
            onTileClick={tapTile}
            onFurnitureClick={(uid) => change({ kind: 'selected', uid })}
          />
        </div>

        <div className="[@media(max-height:500px)]:w-72 [@media(max-height:500px)]:overflow-y-auto">
          {mode.kind === 'selected' && selectedDef ? (
            <SelectedActions
              def={selectedDef}
              onMove={() => change({ kind: 'moving', uid: mode.uid })}
              onTurn={turn}
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
