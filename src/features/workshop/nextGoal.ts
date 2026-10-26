import { FURNITURE } from '../../data/furniture/furniture';
import { LESSONS } from '../../data/math/lessons';
import { bundleEntries, canAfford, lockedRegionOf } from '../../utils/bundles';
import type { GameState } from '../../app/gameState';
import type { FurnitureDef } from '../../types/furniture';
import type { MathLesson } from '../../types/math';
import type { ResourceId } from '../../types/resources';

export interface Goal {
  def: FurnitureDef;
  missing: [ResourceId, number][]; // 모자란 재료와 개수
  from: MathLesson[]; // 모자란 재료를 주는 놀이 (재료마다 하나, 겹치지 않게)
}

// 공방 '다음 목표': 지금 갈 수 있는 마을 재료로 만드는 가구 중, 아직 못 만드는 것에서
// 아직 하나도 없는 가구 → 모자란 재료 수가 적은 가구 → 목록 순서로 하나 고른다. 없으면 null.
// 더 모을 수 없는 재료(이미 받은 처음 보너스)가 모자란 가구는 고르지 않는다.
export function nextGoal(game: Pick<GameState, 'resources' | 'furniture' | 'completedLessons'>): Goal | null {
  // 모자란 재료를 얻을 수 있는 놀이 (보상, 아니면 아직 안 끝낸 놀이의 처음 보너스. 처음 보너스는 한 번뿐)
  const sourceOf = (id: ResourceId) =>
    LESSONS.find((l) => (l.rewards[id] ?? 0) > 0) ?? LESSONS.find((l) => (l.firstTimeBonus[id] ?? 0) > 0 && !game.completedLessons.includes(l.id));

  const candidates = FURNITURE.flatMap((def) => {
    if (def.unlockCondition.type !== 'recipe') return [];
    const { cost } = def.unlockCondition;
    if (lockedRegionOf(cost, game.completedLessons) || canAfford(game.resources, cost)) return [];
    const missing = bundleEntries(cost)
      .map(([id, n]): [ResourceId, number] => [id, n - (game.resources[id] ?? 0)])
      .filter(([, n]) => n > 0);
    const from = missing.map(([id]) => sourceOf(id));
    if (from.some((l) => !l)) return []; // 더 모을 길이 없는 재료가 필요하면 목표로 삼지 않는다
    const owned = (game.furniture[def.id] ?? 0) > 0;
    return [{ def, missing, from: [...new Set(from as MathLesson[])], owned, short: missing.reduce((sum, [, n]) => sum + n, 0) }];
  });
  // sort 는 같은 값이면 원래 순서를 지킨다
  const best = candidates.sort((a, b) => Number(a.owned) - Number(b.owned) || a.short - b.short)[0];
  if (!best) return null;
  return { def: best.def, missing: best.missing, from: best.from };
}
