import type { LessonStats } from '../../app/gameState';
import type { LessonId } from '../../types/math';

// 마지막으로 끝낸 놀이 (타이틀 화면 '이어서 하기'). 기록이 없으면 null
export function lastLesson(stats: Partial<Record<LessonId, LessonStats>>): LessonId | null {
  let best: { id: LessonId; at: number } | null = null;
  for (const [id, s] of Object.entries(stats) as [LessonId, LessonStats | undefined][]) {
    const at = s ? Date.parse(s.lastPlayed) : NaN;
    if (!Number.isNaN(at) && (!best || at > best.at)) best = { id, at };
  }
  return best?.id ?? null;
}
