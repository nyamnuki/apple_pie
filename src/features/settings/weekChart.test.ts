import { describe, expect, it } from 'vitest';
import { lastWeek } from './WeekChart';

describe('이번 주 놀이', () => {
  it('오늘을 포함한 7일, 기록이 없는 날은 0 (달이 바뀌어도)', () => {
    const week = lastWeek({ '2026-11-02': 2, '2026-10-29': 1, '2026-10-20': 9 }, new Date(2026, 10, 2, 15));
    expect(week.map((d) => d.n)).toEqual([0, 0, 1, 0, 0, 0, 2]);
    expect(week[0].date.getDate()).toBe(27);
  });
});
