import { describe, expect, it } from 'vitest';
import { lastLesson } from './lastLesson';

describe('이어서 하기', () => {
  it('가장 최근에 끝낸 놀이, 기록이 없으면 null', () => {
    expect(lastLesson({})).toBeNull();
    const s = (at: string) => ({ plays: 1, firstTry: 1, hints: 0, lastPlayed: at });
    expect(lastLesson({ counting1: s('2026-10-25T09:00:00Z'), clock1: s('2026-10-26T08:00:00Z'), tens1: s('2026-10-24T20:00:00Z') })).toBe('clock1');
  });
});
