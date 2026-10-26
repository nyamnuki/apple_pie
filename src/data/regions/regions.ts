import type { RegionDef, RegionId } from '../../types/resources';

// 마을 목록. 마을이 열리는 조건은 unlock 에 적는다. (열렸는지 계산은 src/utils/regions.ts)
export const REGIONS: RegionDef[] = [
  { id: 'acornVillage', nameKey: 'regions.acornVillage', topicsKey: 'regions.topics.acornVillage', emoji: '🌰', art: 'items/acorn.png', unlock: { type: 'always' } },
  // 도토리 마을 놀이를 2개 끝내면 열린다
  {
    id: 'moonlightForest',
    nameKey: 'regions.moonlightForest',
    topicsKey: 'regions.topics.moonlightForest',
    emoji: '🌙',
    art: 'items/moon.png',
    unlock: { type: 'lessons', region: 'acornVillage', count: 2 },
  },
  // 달빛 숲 놀이를 2개 끝내면 열린다
  {
    id: 'crystalCave',
    nameKey: 'regions.crystalCave',
    topicsKey: 'regions.topics.crystalCave',
    emoji: '💎',
    art: 'items/gem.png',
    unlock: { type: 'lessons', region: 'moonlightForest', count: 2 },
  },
  // 수정 동굴 놀이를 2개 끝내면 열린다
  {
    id: 'sunnyMeadow',
    nameKey: 'regions.sunnyMeadow',
    topicsKey: 'regions.topics.sunnyMeadow',
    emoji: '🌻',
    art: 'items/sunflower.png',
    unlock: { type: 'lessons', region: 'crystalCave', count: 2 },
  },
  // 햇살 들판 놀이를 2개 끝내면 열린다
  {
    id: 'windyHill',
    nameKey: 'regions.windyHill',
    topicsKey: 'regions.topics.windyHill',
    emoji: '🪁',
    art: 'items/kite.png',
    unlock: { type: 'lessons', region: 'sunnyMeadow', count: 2 },
  },
];

export const getRegion = (id: RegionId) => REGIONS.find((r) => r.id === id)!;
