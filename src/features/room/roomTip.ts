import { FURNITURE } from '../../data/furniture/furniture';
import { REGIONS } from '../../data/regions/regions';
import { canAfford, lockedRegionOf } from '../../utils/bundles';
import { isRegionOpen, regionProgress } from '../../utils/regions';
import type { GameState } from '../../app/gameState';
import type { RoomLayout } from '../../types/furniture';
import type { TranslationKey } from '../../i18n';

// 방에서 루루가 하는 말: 지금 상황에서 아이가 다음에 하면 좋은 것 하나.
// name / region 은 번역 키 (화면에서 번역해서 문장에 넣는다)
export type RoomTip = { key: TranslationKey; nameKey?: TranslationKey; regionKey?: TranslationKey };

const COZY: TranslationKey[] = ['room.tips.cozy1', 'room.tips.cozy2', 'room.tips.cozy3'];

export function roomTip(game: GameState, layout: RoomLayout): RoomTip {
  // 1) 아직 놀이를 하나도 안 했다
  if (game.completedLessons.length === 0) return { key: 'room.tips.firstGame' };

  // 2) 새로 열렸는데 아직 안 가 본 마을
  const fresh = REGIONS.find((r) => r.unlock.type !== 'always' && isRegionOpen(r.id, game.completedLessons) && regionProgress(r.id, game.completedLessons).done === 0);
  if (fresh) return { key: 'room.tips.newRegion', regionKey: fresh.nameKey };

  // 3) 가방에 있는데 방에 안 놓은 가구 (벽지 제외)
  const unplaced = FURNITURE.find((f) => {
    if (f.category === 'wallpaper') return false;
    const inRoom = (f.category === 'wall' ? layout.wallItems : layout.placed).filter((p) => p.furnitureId === f.id).length;
    return (game.furniture[f.id] ?? 0) > inRoom;
  });
  if (unplaced) return { key: 'room.tips.place', nameKey: unplaced.nameKey };

  // 4) 지금 재료로 만들 수 있는 가구 (아직 없는 것부터)
  const craftable = FURNITURE.filter(
    (f) => f.unlockCondition.type === 'recipe' && canAfford(game.resources, f.unlockCondition.cost) && !lockedRegionOf(f.unlockCondition.cost, game.completedLessons),
  ).sort((a, b) => (game.furniture[a.id] ?? 0) - (game.furniture[b.id] ?? 0))[0];
  if (craftable) return { key: 'room.tips.canCraft', nameKey: craftable.nameKey };

  // 5) 그 밖에: 놀이 횟수에 따라 돌아가며 다정한 말
  const plays = Object.values(game.lessonStats).reduce((n, s) => n + (s?.plays ?? 0), 0);
  return { key: COZY[plays % COZY.length] };
}
