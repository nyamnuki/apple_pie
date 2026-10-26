import { LESSONS } from '../../data/math/lessons';
import { isRegionOpen } from '../../utils/regions';
import type { LessonId, MathLesson } from '../../types/math';

// 보상 화면 '다음 놀이': 아직 안 끝낸 놀이 하나. 같은 마을 → 열린 다른 마을 순서 (목록 순서대로).
// 열린 마을의 놀이를 모두 끝냈으면 null (그때는 버튼을 보여 주지 않는다).
export function nextLesson(completed: LessonId[], current: MathLesson): MathLesson | null {
  const todo = LESSONS.filter((l) => l.id !== current.id && !completed.includes(l.id) && isRegionOpen(l.region, completed));
  return todo.find((l) => l.region === current.region) ?? todo[0] ?? null;
}
