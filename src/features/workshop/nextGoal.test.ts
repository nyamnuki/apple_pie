import { describe, expect, it } from 'vitest';
import { nextGoal } from './nextGoal';
import { createInitialGameState, type GameState } from '../../app/gameState';
import { lockedRegionOf } from '../../utils/bundles';

const state = (over: Partial<GameState>): GameState => ({ ...createInitialGameState(), ...over });

describe('공방 다음 목표', () => {
  it('처음에는 열린 마을 재료로 만드는 가구 중 하나, 모자란 재료와 그 재료를 주는 놀이', () => {
    const goal = nextGoal(state({}))!;
    expect(goal).not.toBeNull();
    expect(lockedRegionOf((goal.def.unlockCondition as { cost: object }).cost, [])).toBeNull();
    expect(goal.missing.length).toBeGreaterThan(0);
    expect(goal.from.length).toBeGreaterThan(0);
    for (const l of goal.from) expect(l.region).toBe('acornVillage');
  });

  it('모자란 재료가 가장 적은 가구를 고르고, 이미 가진 가구는 뒤로', () => {
    // 책장은 도토리 4 + 사과 2: 도토리 4, 사과 1 이면 하나만 모자라다
    const near = nextGoal(state({ resources: { acorn: 4, apple: 1 } }))!;
    expect(near.def.id).toBe('forestBookshelf');
    expect(near.missing).toEqual([['apple', 1]]);
    const owned = nextGoal(state({ resources: { acorn: 4, apple: 1 }, furniture: { ...createInitialGameState().furniture, forestBookshelf: 1 } }))!;
    expect(owned.def.id).not.toBe('forestBookshelf');
  });

  it('재료가 다 있으면 목표가 없다 (지금 만들 수 있는 가구는 목표가 아니다)', () => {
    const all = Object.fromEntries(['acorn', 'apple', 'goldenAcorn', 'glowBranch', 'moonDew', 'crystal', 'mithril', 'sunflowerSeed', 'honey', 'feather', 'cloudCotton'].map((id) => [id, 99]));
    expect(nextGoal(state({ resources: all }))).toBeNull();
  });

  it('황금 도토리: 처음 보너스가 남았으면 그 놀이, 다 받았으면 오늘의 문제 도장', () => {
    const open = nextGoal(state({ resources: { acorn: 99, apple: 99 }, completedLessons: ['counting1'] }))!;
    expect(open.missing).toEqual([['goldenAcorn', 1]]);
    expect(open.from.map((l) => l.id)).not.toContain('counting1');
    expect(open.daily).toBe(false);
    const done = ['counting1', 'comparing1', 'addition1', 'subtraction1'] as GameState['completedLessons'];
    const later = nextGoal(state({ resources: { acorn: 99, apple: 99 }, completedLessons: done }))!;
    expect(later.missing).toEqual([['goldenAcorn', 1]]);
    expect(later.from).toEqual([]);
    expect(later.daily).toBe(true);
  });
});
