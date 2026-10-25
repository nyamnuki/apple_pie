import type { RegionDef, RegionId } from '../../types/resources';

// 마을 목록. 마을이 열리는 조건은 unlock 에 적는다. (열렸는지 계산은 src/utils/regions.ts)
export const REGIONS: RegionDef[] = [
  { id: 'acornVillage', nameKey: 'regions.acornVillage', topicsKey: 'regions.topics.acornVillage', emoji: '🌰', unlock: { type: 'always' } },
  // 도토리 마을 놀이를 2개 끝내면 열린다
  {
    id: 'moonlightForest',
    nameKey: 'regions.moonlightForest',
    topicsKey: 'regions.topics.moonlightForest',
    emoji: '🌙',
    unlock: { type: 'lessons', region: 'acornVillage', count: 2 },
  },
  // 달빛 숲 놀이를 2개 끝내면 열린다
  {
    id: 'crystalCave',
    nameKey: 'regions.crystalCave',
    topicsKey: 'regions.topics.crystalCave',
    emoji: '💎',
    unlock: { type: 'lessons', region: 'moonlightForest', count: 2 },
  },
];

export const getRegion = (id: RegionId) => REGIONS.find((r) => r.id === id)!;
