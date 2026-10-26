import { describe, expect, it } from 'vitest';
import { dailyLesson, streak } from './daily';
import { dateKey } from '../../utils/dates';
import { answerOf } from '../math/answers';
import { sizeOk } from '../../data/math/sceneRules';
import { createInitialGameState, gameReducer } from '../../app/gameState';

describe('오늘의 문제', () => {
  it('날짜 글자는 기기 날짜 기준 YYYY-MM-DD', () => {
    expect(dateKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });

  it('끝낸 놀이가 없으면 없음, 같은 날은 같은 문제, 끝낸 놀이에서만 나온다', () => {
    expect(dailyLesson(new Date(2026, 9, 26), [])).toBeNull();
    const done = ['counting1', 'patterns1', 'tens1'] as const;
    const a = dailyLesson(new Date(2026, 9, 26, 8), [...done])!;
    const b = dailyLesson(new Date(2026, 9, 26, 20), [...done])!;
    expect(b).toEqual(a);
    const ids = new Set<string>();
    for (let d = 1; d <= 30; d++) {
      const l = dailyLesson(new Date(2026, 10, d), [...done])!;
      ids.add(l.id);
      expect(done).toContain(l.id);
      expect(sizeOk(l.apply)).toBe(true);
      expect(l.applyChoices).toContain(answerOf(l.apply));
    }
    expect(ids.size).toBe(3); // 한 달이면 끝낸 놀이가 고루 나온다
  });

  it('도장은 하루에 한 번만 쌓인다', () => {
    let s = gameReducer(createInitialGameState(), { type: 'dailyDone', date: '2026-10-26' });
    s = gameReducer(s, { type: 'dailyDone', date: '2026-10-26' });
    s = gameReducer(s, { type: 'dailyDone', date: '2026-10-27' });
    expect(s.dailyDone).toEqual(['2026-10-26', '2026-10-27']);
  });
});

describe('연속 기록', () => {
  const today = new Date(2026, 10, 2, 9);
  it('오늘부터 거꾸로, 오늘 아직 안 풀었으면 어제부터 (달이 바뀌어도)', () => {
    expect(streak([], today)).toBe(0);
    expect(streak(['2026-10-31', '2026-11-01', '2026-11-02'], today)).toBe(3);
    expect(streak(['2026-10-31', '2026-11-01'], today)).toBe(2); // 오늘은 아직
    expect(streak(['2026-10-30', '2026-11-01', '2026-11-02'], today)).toBe(2); // 31일에 끊김
    expect(streak(['2026-10-30', '2026-10-31'], today)).toBe(0); // 어제도 안 풀었으면 끊김
  });
});

describe('오늘 보여 준 놀이는 그날 그대로', () => {
  it('놀이를 더 끝내도 기억해 둔 놀이로 같은 문제, 기억한 놀이가 없으면 새로 고른다', () => {
    const day = new Date(2026, 9, 26, 9);
    const first = dailyLesson(day, ['counting1', 'patterns1'])!;
    const later = dailyLesson(day, ['counting1', 'patterns1', 'tens1', 'clock1'], first.id)!;
    expect(later).toEqual(first);
    expect(dailyLesson(day, ['counting1'], 'clock1')!.id).toBe('counting1'); // 끝낸 놀이에 없으면 무시
  });
});
