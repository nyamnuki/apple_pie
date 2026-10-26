import { LESSONS } from '../../data/math/lessons';
import { lessonForSeed } from '../math/variation';
import type { LessonId, MathLesson } from '../../types/math';

// ===== 오늘의 문제 =====
// 하루에 한 번, 끝낸 놀이 가운데 하나에서 '해 보기' 한 문제. 날짜마다 놀이와 수가 바뀐다 (기기 날짜).

export const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// 날짜를 하루 단위 번호로 (같은 날이면 같은 문제)
const dayNumber = (d: Date) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);

export function dailyLesson(date: Date, completed: LessonId[]): MathLesson | null {
  const done = LESSONS.filter((l) => completed.includes(l.id));
  if (done.length === 0) return null;
  const n = dayNumber(date);
  return lessonForSeed(done[n % done.length], n);
}
