import type { MathAnswer } from '../../types/math';

// ===== 수학 놀이 진행 상태 =====
// 단계: 살펴보기 → 만져 보기 → 예상하기 → 확인하기 → 발견하기 → 해 보기 → 끝
export const STAGES = ['observe', 'manipulate', 'predict', 'verify', 'discover', 'apply'] as const;
export type Stage = (typeof STAGES)[number] | 'complete';

export interface LessonState {
  stage: Stage;
  manipulated: boolean; // 만져 보기를 끝냈는지
  guess: MathAnswer | null; // 예상한 답
  verified: boolean; // 확인하기(자동 세기)가 끝났는지
  wrong: MathAnswer[]; // 해 보기에서 고른 오답들 (힌트 단계를 정한다)
  solved: boolean; // 해 보기를 맞혔는지
}

export const initialLessonState: LessonState = {
  stage: 'observe',
  manipulated: false,
  guess: null,
  verified: false,
  wrong: [],
  solved: false,
};

export type LessonAction =
  | { type: 'next' }
  | { type: 'manipulated' }
  | { type: 'guess'; answer: MathAnswer }
  | { type: 'verified' }
  | { type: 'answer'; answer: MathAnswer; correct: MathAnswer }
  | { type: 'restart' };

const NEXT: Record<Stage, Stage> = {
  observe: 'manipulate',
  manipulate: 'predict',
  predict: 'verify',
  verify: 'discover',
  discover: 'apply',
  apply: 'complete',
  complete: 'complete',
};

export function lessonReducer(state: LessonState, action: LessonAction): LessonState {
  switch (action.type) {
    case 'next':
      return { ...state, stage: NEXT[state.stage] };
    case 'manipulated':
      return { ...state, manipulated: true };
    case 'guess':
      // 예상은 맞고 틀림이 없다. 고르면 바로 확인하기로 간다.
      return { ...state, guess: action.answer, stage: 'verify' };
    case 'verified':
      return { ...state, verified: true };
    case 'answer':
      if (action.answer === action.correct) return { ...state, solved: true };
      if (state.wrong.includes(action.answer)) return state;
      return { ...state, wrong: [...state.wrong, action.answer] };
    case 'restart':
      return initialLessonState;
  }
}

// 틀린 횟수에 따른 힌트 단계: 1 = 관찰 힌트, 2 = 직접 해 보기, 3 = 시범 보기
export const hintLevel = (state: LessonState) => Math.min(state.wrong.length, 3) as 0 | 1 | 2 | 3;
