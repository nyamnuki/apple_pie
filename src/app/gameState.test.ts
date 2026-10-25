import { describe, expect, it } from 'vitest';
import { createInitialGameState, gameReducer, rewardFor, type GameState } from './gameState';
import { getLesson } from '../data/math/lessons';

// 보상과 가구 만들기 규칙
const counting = getLesson('counting1'); // 보상: 도토리 3 + 사과 1, 처음 보너스: 황금 도토리 1
const patterns = getLesson('patterns1'); // 달빛 숲 레슨

describe('처음 상태', () => {
  it('재료 없음, 처음부터 가진 가구 4개, 끝낸 놀이 없음', () => {
    const s = createInitialGameState();
    expect(s.resources).toEqual({});
    expect(s.furniture).toEqual({ leafBed: 1, petalRug: 1, mushroomLamp: 1, flowerPot: 1 });
    expect(s.completedLessons).toEqual([]);
  });
});

describe('보상 정책', () => {
  it('처음 끝내면 기본 보상 + 처음 보너스, 다시 하면 기본 보상만', () => {
    let s = createInitialGameState();
    expect(rewardFor(counting, s)).toEqual({ rewards: { acorn: 3, apple: 1 }, bonus: { goldenAcorn: 1 } });
    s = gameReducer(s, { type: 'completeLesson', lesson: counting });
    expect(s.resources).toEqual({ acorn: 3, apple: 1, goldenAcorn: 1 });
    expect(rewardFor(counting, s)).toEqual({ rewards: { acorn: 3, apple: 1 }, bonus: {} });
    s = gameReducer(s, { type: 'completeLesson', lesson: counting });
    expect(s.resources).toEqual({ acorn: 6, apple: 2, goldenAcorn: 1 });
    expect(s.completedLessons).toEqual(['counting1']); // 같은 놀이는 한 번만 기록
  });

  it('놀이마다 처음 보너스는 따로 받는다', () => {
    let s = gameReducer(createInitialGameState(), { type: 'completeLesson', lesson: counting });
    s = gameReducer(s, { type: 'completeLesson', lesson: getLesson('addition1') });
    expect(s.resources.goldenAcorn).toBe(2);
  });
});

describe('가구 만들기', () => {
  const withResources = (resources: GameState['resources'], completedLessons: GameState['completedLessons'] = []): GameState => ({
    ...createInitialGameState(),
    resources,
    completedLessons,
  });

  it('재료가 충분하면 재료가 줄고 가구가 1개 늘어난다', () => {
    const s = gameReducer(withResources({ acorn: 5, apple: 2 }), { type: 'craft', furnitureId: 'forestBookshelf' });
    expect(s.resources).toEqual({ acorn: 1, apple: 0 });
    expect(s.furniture.forestBookshelf).toBe(1);
  });

  it('재료가 모자라면 아무것도 바뀌지 않는다 (같은 상태)', () => {
    const before = withResources({ acorn: 3, apple: 2 });
    expect(gameReducer(before, { type: 'craft', furnitureId: 'forestBookshelf' })).toBe(before);
  });

  it('아직 열리지 않은 마을의 재료가 필요하면 재료가 있어도 만들 수 없다', () => {
    const locked = withResources({ glowBranch: 5, moonDew: 5, acorn: 5 }, ['counting1']);
    expect(gameReducer(locked, { type: 'craft', furnitureId: 'moonLantern' })).toBe(locked);
    const open = withResources({ glowBranch: 5, moonDew: 5 }, ['counting1', 'comparing1']);
    expect(gameReducer(open, { type: 'craft', furnitureId: 'moonLantern' }).furniture.moonLantern).toBe(1);
  });

  it('처음부터 가진 가구나 없는 가구는 만들 수 없다', () => {
    const s = withResources({ acorn: 99, apple: 99 });
    expect(gameReducer(s, { type: 'craft', furnitureId: 'leafBed' })).toBe(s);
    expect(gameReducer(s, { type: 'craft', furnitureId: 'ghostSofa' })).toBe(s);
  });

  it('지우기는 처음 상태로', () => {
    const s = gameReducer(withResources({ acorn: 5 }, ['counting1']), { type: 'reset' });
    expect(s).toEqual(createInitialGameState());
  });

  it('달빛 숲 레슨 보상은 달빛 숲 재료', () => {
    expect(rewardFor(patterns, createInitialGameState())).toEqual({ rewards: { glowBranch: 2 }, bonus: { moonDew: 1 } });
  });
});
