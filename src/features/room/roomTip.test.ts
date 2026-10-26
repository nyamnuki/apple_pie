import { describe, expect, it } from 'vitest';
import { roomTip } from './roomTip';
import { createInitialGameState, type GameState } from '../../app/gameState';
import { DEFAULT_LAYOUT } from './roomState';

// 방에서 루루가 하는 말: 상황마다 알맞은 한 가지
const game = (over: Partial<GameState>): GameState => ({ ...createInitialGameState(), ...over });
const stats = (plays: number) => ({ counting1: { plays, firstTry: 0, hints: 0, lastPlayed: '2026-10-26T00:00:00Z' } });

describe('roomTip', () => {
  it('처음: 놀이를 해 보자', () => {
    expect(roomTip(createInitialGameState(), DEFAULT_LAYOUT)).toEqual({ key: 'room.tips.firstGame' });
  });

  it('새로 열린 마을이 있으면 가 보자', () => {
    expect(roomTip(game({ completedLessons: ['counting1', 'comparing1'] }), DEFAULT_LAYOUT)).toEqual({ key: 'room.tips.newRegion', regionKey: 'regions.moonlightForest' });
  });

  it('가방에 놓지 않은 가구가 있으면 놓아 보자', () => {
    const g = game({ completedLessons: ['counting1'], furniture: { ...createInitialGameState().furniture, toyChest: 1 } });
    expect(roomTip(g, DEFAULT_LAYOUT)).toEqual({ key: 'room.tips.place', nameKey: 'furniture.toyChest.name' });
  });

  it('재료가 있으면 만들 수 있는 가구를 알려 준다 (아직 없는 것부터)', () => {
    const tip = roomTip(game({ completedLessons: ['counting1'], resources: { acorn: 4, apple: 2 } }), DEFAULT_LAYOUT);
    expect(tip.key).toBe('room.tips.canCraft');
    expect(['furniture.forestBookshelf.name', 'furniture.mushroomStool.name', 'furniture.leafFrame.name', 'furniture.toyChest.name', 'furniture.appleBasket.name', 'furniture.acornGarland.name', 'furniture.cloverCushion.name']).toContain(tip.nameKey);
  });

  it('잠긴 마을 재료가 필요한 가구는 권하지 않는다', () => {
    const tip = roomTip(game({ completedLessons: ['counting1'], resources: { moonDew: 9, glowBranch: 9 } }), DEFAULT_LAYOUT);
    expect(tip.key).toMatch(/^room\.tips\.cozy/);
  });

  it('그 밖에는 다정한 말이 놀이 횟수에 따라 돌아간다', () => {
    const keys = [0, 1, 2, 3].map((n) => roomTip(game({ completedLessons: ['counting1'], lessonStats: stats(n) }), DEFAULT_LAYOUT).key);
    expect(keys).toEqual(['room.tips.cozy1', 'room.tips.cozy2', 'room.tips.cozy3', 'room.tips.cozy1']);
  });
});
