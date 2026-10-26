import type { ResourceDef, ResourceId } from '../../types/resources';

// ===== 재료 목록 =====
// 그림은 public/assets/items/ 에 넣으면 자동으로 바뀐다. (없으면 색 동그라미 + 그림 문자)
export const RESOURCES: ResourceDef[] = [
  // 도토리 마을
  { id: 'acorn', nameKey: 'resources.acorn', region: 'acornVillage', rare: false, assetPath: 'items/res-acorn.png', placeholder: { emoji: '🌰', color: '#F5D0AD' } },
  { id: 'apple', nameKey: 'resources.apple', region: 'acornVillage', rare: false, assetPath: 'items/res-apple.png', placeholder: { emoji: '🍎', color: '#F3C6D2' } },
  { id: 'goldenAcorn', nameKey: 'resources.goldenAcorn', region: 'acornVillage', rare: true, assetPath: 'items/res-golden-acorn.png', placeholder: { emoji: '🌰', color: '#F2C94C' } },
  // 달빛 숲
  { id: 'glowBranch', nameKey: 'resources.glowBranch', region: 'moonlightForest', rare: false, assetPath: 'items/res-glow-branch.png', placeholder: { emoji: '🪄', color: '#D9D0EC' } },
  { id: 'moonDew', nameKey: 'resources.moonDew', region: 'moonlightForest', rare: true, assetPath: 'items/res-moon-dew.png', placeholder: { emoji: '💧', color: '#C8DFE8' } },
  // 수정 동굴
  { id: 'crystal', nameKey: 'resources.crystal', region: 'crystalCave', rare: false, assetPath: 'items/res-crystal.png', placeholder: { emoji: '💎', color: '#C8DFE8' } },
  // 햇살 들판
  { id: 'sunflowerSeed', nameKey: 'resources.sunflowerSeed', region: 'sunnyMeadow', rare: false, assetPath: 'items/res-sunflower-seed.png', placeholder: { emoji: '🌻', color: '#F5D0AD' } },
  { id: 'honey', nameKey: 'resources.honey', region: 'sunnyMeadow', rare: true, assetPath: 'items/res-honey.png', placeholder: { emoji: '🍯', color: '#F2CF5B' } },
  // 바람 언덕
  { id: 'feather', nameKey: 'resources.feather', region: 'windyHill', rare: false, assetPath: 'items/res-feather.png', placeholder: { emoji: '🪶', color: '#F3C6D2' } },
  { id: 'cloudCotton', nameKey: 'resources.cloudCotton', region: 'windyHill', rare: true, assetPath: 'items/res-cloud-cotton.png', placeholder: { emoji: '☁️', color: '#D9D0EC' } },
  { id: 'lilyPad', nameKey: 'resources.lilyPad', region: 'rainbowLake', rare: false, assetPath: 'items/res-lily-pad.png', placeholder: { emoji: '🪷', color: '#A8C3A0' } },
  { id: 'pearl', nameKey: 'resources.pearl', region: 'rainbowLake', rare: true, assetPath: 'items/res-pearl.png', placeholder: { emoji: '🫧', color: '#F1E9F7' } },
  { id: 'mithril', nameKey: 'resources.mithril', region: 'crystalCave', rare: true, assetPath: 'items/res-mithril.png', placeholder: { emoji: '🪙', color: '#D9D0EC' } },
];

export const getResource = (id: ResourceId) => RESOURCES.find((r) => r.id === id)!;
