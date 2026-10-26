import { describe, expect, it } from 'vitest';
import { seasonOf, timeOfDay } from './timeOfDay';

describe('timeOfDay', () => {
  it('6~17시 낮, 17~20시 저녁, 그 밖은 밤', () => {
    const at = (h: number) => timeOfDay(new Date(2026, 9, 26, h, 30));
    expect([5, 6, 12, 16, 17, 19, 20, 23, 0].map(at)).toEqual(['night', 'day', 'day', 'day', 'evening', 'evening', 'night', 'night', 'night']);
  });
});

describe('seasonOf', () => {
  it('3~5월 봄, 6~8월 여름, 9~11월 가을, 12~2월 겨울', () => {
    expect(Array.from({ length: 12 }, (_, m) => seasonOf(new Date(2026, m, 15)))).toEqual([
      'winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter',
    ]);
  });
});
