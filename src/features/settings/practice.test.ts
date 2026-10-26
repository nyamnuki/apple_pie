import { describe, expect, it } from 'vitest';
import { practiceSuggestions } from './practice';

const s = (plays: number, firstTry: number, hints: number) => ({ plays, firstTry, hints, lastPlayed: '2026-10-26T09:00:00Z' });

describe('함께 해 보면 좋은 놀이', () => {
  it('힌트를 많이 본 놀이, 또는 여러 번 해도 한 번에 못 맞힌 놀이를 많이 본 순서로 3개까지', () => {
    expect(practiceSuggestions({})).toEqual([]);
    expect(practiceSuggestions({ counting1: s(3, 3, 0), addition1: s(2, 1, 2) })).toEqual([]); // 잘하고 있음
    const list = practiceSuggestions({ counting1: s(2, 0, 2), addition1: s(1, 0, 3), clock1: s(2, 0, 4), tens1: s(4, 1, 6), shapes1: s(1, 0, 2) });
    expect(list.map((l) => l.id)).toEqual(['addition1', 'shapes1', 'clock1']); // 3개, 같으면 목록 순서
  });
});
