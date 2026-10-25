import { FURNITURE, getFurniture } from '../data/furniture/furniture';
import { canAfford, lockedRegionOf, bundleEntries } from '../utils/bundles';
import type { LessonId, MathLesson } from '../types/math';
import type { ResourceBundle } from '../types/resources';

// ===== 플레이어 상태: 가진 재료, 가진 가구, 끝낸 놀이 =====
// (방에 무엇을 어디에 놓았는지는 RoomProvider 가 따로 관리한다)
export interface GameState {
  resources: ResourceBundle;
  furniture: Record<string, number>; // 가구 id → 가진 개수 (방에 놓은 것 포함)
  completedLessons: LessonId[];
}

// 처음 상태: 재료 없음, '처음부터 가진' 가구 1개씩
export function createInitialGameState(): GameState {
  return {
    resources: {},
    furniture: Object.fromEntries(FURNITURE.filter((f) => f.unlockCondition.type === 'starter').map((f) => [f.id, 1])),
    completedLessons: [],
  };
}

// 놀이를 끝냈을 때 받을 보상 (정답 여부와 상관없이, 처음이면 보너스 추가)
export function rewardFor(lesson: MathLesson, state: GameState) {
  const firstTime = !state.completedLessons.includes(lesson.id);
  return { rewards: lesson.rewards, bonus: firstTime ? lesson.firstTimeBonus : {} };
}

function addBundle(have: ResourceBundle, add: ResourceBundle, sign = 1): ResourceBundle {
  const next = { ...have };
  for (const [id, n] of bundleEntries(add)) next[id] = (next[id] ?? 0) + sign * n;
  return next;
}

export type GameAction =
  | { type: 'completeLesson'; lesson: MathLesson }
  | { type: 'craft'; furnitureId: string };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'completeLesson': {
      const { rewards, bonus } = rewardFor(action.lesson, state);
      return {
        ...state,
        resources: addBundle(addBundle(state.resources, rewards), bonus),
        completedLessons: state.completedLessons.includes(action.lesson.id) ? state.completedLessons : [...state.completedLessons, action.lesson.id],
      };
    }
    case 'craft': {
      const def = getFurniture(action.furnitureId);
      if (!def || def.unlockCondition.type !== 'recipe') return state;
      const { cost } = def.unlockCondition;
      // 재료가 모자라거나 아직 못 가는 마을 재료가 필요하면 만들지 않는다
      if (!canAfford(state.resources, cost) || lockedRegionOf(cost)) return state;
      return {
        ...state,
        resources: addBundle(state.resources, cost, -1),
        furniture: { ...state.furniture, [def.id]: (state.furniture[def.id] ?? 0) + 1 },
      };
    }
  }
}
