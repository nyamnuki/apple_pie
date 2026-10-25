import { getRegion } from '../data/regions/regions';
import { LESSONS } from '../data/math/lessons';
import type { LessonId } from '../types/math';
import type { RegionId } from '../types/resources';

// 마을에서 끝낸 놀이 수 / 전체 놀이 수
export function regionProgress(regionId: RegionId, completed: LessonId[]) {
  const lessons = LESSONS.filter((l) => l.region === regionId);
  return { done: lessons.filter((l) => completed.includes(l.id)).length, total: lessons.length };
}

// 마을이 지금 열려 있는지 (끝낸 놀이로 계산)
export function isRegionOpen(regionId: RegionId, completed: LessonId[]): boolean {
  const { unlock } = getRegion(regionId);
  if (unlock.type === 'always') return true;
  return regionProgress(unlock.region, completed).done >= unlock.count;
}
