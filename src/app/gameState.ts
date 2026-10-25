import { FURNITURE, getFurniture } from '../data/furniture/furniture';
import { canAfford, lockedRegionOf, bundleEntries } from '../utils/bundles';
import type { LessonId, MathLesson } from '../types/math';
import type { ResourceBundle } from '../types/resources';

// 놀이 하나의 기록 (부모 화면에서 보여준다. 이 기기에만 저장된다)
export interface LessonStats {
  plays: number; // 끝까지 한 횟수
  firstTry: number; // '해 보기'를 한 번에 맞힌 횟수
  hints: number; // 본 힌트 수 (한 판에 최대 3)
  lastPlayed: string; // 마지막으로 끝낸 시각 (ISO 형식)
}

// ===== 플레이어 상태: 가진 재료, 가진 가구, 끝낸 놀이 =====
// (방에 무엇을 어디에 놓았는지는 RoomProvider 가 따로 관리한다)
export interface GameState {
  resources: ResourceBundle;
  furniture: Record<string, number>; // 가구 id → 가진 개수 (방에 놓은 것 포함)
  completedLessons: LessonId[];
  lessonStats: Partial<Record<LessonId, LessonStats>>;
}

// 처음 상태: 재료 없음, '처음부터 가진' 가구 1개씩
export function createInitialGameState(): GameState {
  return {
    resources: {},
    furniture: Object.fromEntries(FURNITURE.filter((f) => f.unlockCondition.type === 'starter').map((f) => [f.id, 1])),
    completedLessons: [],
    lessonStats: {},
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

function addPlay(prev: LessonStats | undefined, wrongTries: number, at: string): LessonStats {
  const s = prev ?? { plays: 0, firstTry: 0, hints: 0, lastPlayed: at };
  return { plays: s.plays + 1, firstTry: s.firstTry + (wrongTries === 0 ? 1 : 0), hints: s.hints + Math.min(Math.max(wrongTries, 0), 3), lastPlayed: at };
}

export type GameAction =
  // wrongTries: '해 보기'에서 틀린 횟수, at: 끝낸 시각 (ISO)
  | { type: 'completeLesson'; lesson: MathLesson; wrongTries: number; at: string }
  | { type: 'craft'; furnitureId: string }
  | { type: 'reset' }; // 부모 설정에서 진행 상황 모두 지우기

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'reset':
      return createInitialGameState();
    case 'completeLesson': {
      const { rewards, bonus } = rewardFor(action.lesson, state);
      return {
        ...state,
        resources: addBundle(addBundle(state.resources, rewards), bonus),
        completedLessons: state.completedLessons.includes(action.lesson.id) ? state.completedLessons : [...state.completedLessons, action.lesson.id],
        lessonStats: { ...state.lessonStats, [action.lesson.id]: addPlay(state.lessonStats[action.lesson.id], action.wrongTries, action.at) },
      };
    }
    case 'craft': {
      const def = getFurniture(action.furnitureId);
      if (!def || def.unlockCondition.type !== 'recipe') return state;
      const { cost } = def.unlockCondition;
      // 재료가 모자라거나 아직 못 가는 마을 재료가 필요하면 만들지 않는다
      if (!canAfford(state.resources, cost) || lockedRegionOf(cost, state.completedLessons)) return state;
      return {
        ...state,
        resources: addBundle(state.resources, cost, -1),
        furniture: { ...state.furniture, [def.id]: (state.furniture[def.id] ?? 0) + 1 },
      };
    }
  }
}
