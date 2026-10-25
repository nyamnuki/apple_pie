import type { RegionDef, RegionId } from '../../types/resources';

// 마을 목록. 새 마을을 열려면 open 을 true 로 바꾸고 그 마을의 놀이를 추가한다.
export const REGIONS: RegionDef[] = [
  { id: 'acornVillage', nameKey: 'regions.acornVillage', emoji: '🌰', open: true },
  { id: 'moonlightForest', nameKey: 'regions.moonlightForest', emoji: '🌙', open: false },
];

export const getRegion = (id: RegionId) => REGIONS.find((r) => r.id === id)!;
