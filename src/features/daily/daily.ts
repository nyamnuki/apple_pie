import { LESSONS } from '../../data/math/lessons';
import { lessonForSeed } from '../math/variation';
import { dateKey } from '../../utils/dates';
import type { LessonId, MathLesson } from '../../types/math';

// ===== 오늘의 문제 =====
// 하루에 한 번, 끝낸 놀이 가운데 하나에서 '해 보기' 한 문제. 날짜마다 놀이와 수가 바뀐다 (기기 날짜).

// 날짜를 하루 단위 번호로 (같은 날이면 같은 문제)
const dayNumber = (d: Date) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);

// keep: 오늘 이미 보여 준 놀이 (DailyScreen 이 기억해 둔다). 그날 놀이를 더 끝내도 문제가 바뀌지 않게 한다.
export function dailyLesson(date: Date, completed: LessonId[], keep?: LessonId | null): MathLesson | null {
  const done = LESSONS.filter((l) => completed.includes(l.id));
  if (done.length === 0) return null;
  const n = dayNumber(date);
  const kept = keep ? done.find((l) => l.id === keep) : undefined;
  return lessonForSeed(kept ?? done[n % done.length], n);
}

// 며칠 연속으로 풀었는지: 오늘(아직 안 풀었으면 어제)부터 거꾸로 하루씩. 끊기면 0 (혼내지 않고 그냥 안 보여 준다)
export function streak(done: readonly string[], today: Date): number {
  const days = new Set(done);
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!days.has(dateKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(dateKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
