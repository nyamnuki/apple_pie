import { LESSONS } from '../../data/math/lessons';
import type { LessonStats } from '../../app/gameState';
import type { LessonId, MathLesson } from '../../types/math';

// 어른 설정 '함께 해 보면 좋은 놀이': 힌트를 많이 본 놀이 (한 판에 평균 1.5개 이상이거나,
// 두 번 넘게 했는데 한 번도 한 번에 맞히지 못한 놀이). 힌트를 많이 본 순서로 3개까지.
export function practiceSuggestions(stats: Partial<Record<LessonId, LessonStats>>): MathLesson[] {
  const hintsPerPlay = (s: LessonStats) => s.hints / s.plays;
  return LESSONS.filter((l) => {
    const s = stats[l.id];
    return s && s.plays > 0 && (hintsPerPlay(s) >= 1.5 || (s.plays >= 2 && s.firstTry === 0));
  })
    .sort((a, b) => hintsPerPlay(stats[b.id]!) - hintsPerPlay(stats[a.id]!))
    .slice(0, 3);
}
