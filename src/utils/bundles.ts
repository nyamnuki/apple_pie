import { getResource } from '../data/resources/resources';
import { isRegionOpen } from './regions';
import type { ResourceBundle, ResourceId } from '../types/resources';
import type { LessonId } from '../types/math';

// 재료 묶음을 [id, 개수] 목록으로 (0개는 뺀다)
export const bundleEntries = (bundle: ResourceBundle) =>
  (Object.entries(bundle) as [ResourceId, number][]).filter(([, n]) => n > 0);

// 가진 재료로 cost 를 낼 수 있는지
export const canAfford = (have: ResourceBundle, cost: ResourceBundle) =>
  bundleEntries(cost).every(([id, n]) => (have[id] ?? 0) >= n);

// 아직 열리지 않은 마을의 재료가 필요하면 그 마을 id (없으면 null)
export function lockedRegionOf(cost: ResourceBundle, completed: LessonId[]) {
  for (const [id] of bundleEntries(cost)) {
    const region = getResource(id).region;
    if (!isRegionOpen(region, completed)) return region;
  }
  return null;
}
