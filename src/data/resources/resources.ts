import type { ResourceDef, ResourceId } from '../../types/resources';

// ===== 재료 목록 =====
// 그림은 public/assets/items/ 에 넣으면 자동으로 바뀐다. (없으면 색 동그라미 + 그림 문자)
export const RESOURCES: ResourceDef[] = [
  // 도토리 마을
  { id: 'acorn', nameKey: 'resources.acorn', region: 'acornVillage', rare: false, assetPath: 'items/res-acorn.png', placeholder: { emoji: '🌰', color: '#F5D0AD' } },
  { id: 'apple', nameKey: 'resources.apple', region: 'acornVillage', rare: false, assetPath: 'items/res-apple.png', placeholder: { emoji: '🍎', color: '#F3C6D2' } },
  { id: 'goldenAcorn', nameKey: 'resources.goldenAcorn', region: 'acornVillage', rare: true, assetPath: 'items/res-golden-acorn.png', placeholder: { emoji: '🌰', color: '#F2C94C' } },
  // 달빛 숲 (아직 열리지 않음)
  { id: 'glowBranch', nameKey: 'resources.glowBranch', region: 'moonlightForest', rare: false, assetPath: 'items/res-glow-branch.png', placeholder: { emoji: '🪄', color: '#D9D0EC' } },
  { id: 'moonDew', nameKey: 'resources.moonDew', region: 'moonlightForest', rare: true, assetPath: 'items/res-moon-dew.png', placeholder: { emoji: '💧', color: '#C8DFE8' } },
];

export const getResource = (id: ResourceId) => RESOURCES.find((r) => r.id === id)!;
