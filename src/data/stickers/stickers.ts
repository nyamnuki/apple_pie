import type { TranslationKey } from '../../i18n';
import type { RegionId } from '../../types/resources';

// ===== 스티커 도감 =====
// 놀이를 끝낼 때마다 그 마을의 스티커를 하나씩 (순서대로, 아직 없는 것) 받는다. 마을마다 6장.
// 그림은 물건·재료 그림을 그대로 쓴다 (src/components/art/itemArt.tsx), 이름도 같은 번역을 쓴다.
export interface StickerDef {
  id: string;
  region: RegionId;
  art: string; // 그림 경로
  nameKey: TranslationKey;
}

const s = (id: string, region: RegionId, art: string, nameKey: TranslationKey): StickerDef => ({ id, region, art, nameKey });

export const STICKERS: StickerDef[] = [
  s('apple', 'acornVillage', 'items/apple.png', 'mathItems.apple'),
  s('acorn', 'acornVillage', 'items/acorn.png', 'mathItems.acorn'),
  s('flower', 'acornVillage', 'items/flower.png', 'mathItems.flower'),
  s('ladybug', 'acornVillage', 'items/ladybug.png', 'mathItems.ladybug'),
  s('butterfly', 'acornVillage', 'items/butterfly.png', 'mathItems.butterfly'),
  s('frog', 'acornVillage', 'items/frog.png', 'mathItems.frog'),
  s('moon', 'moonlightForest', 'items/moon.png', 'mathItems.moon'),
  s('star', 'moonlightForest', 'items/star.png', 'mathItems.star'),
  s('owl', 'moonlightForest', 'items/owl.png', 'mathItems.owl'),
  s('leaf', 'moonlightForest', 'items/leaf.png', 'mathItems.leaf'),
  s('glowBranch', 'moonlightForest', 'items/res-glow-branch.png', 'resources.glowBranch'),
  s('moonDew', 'moonlightForest', 'items/res-moon-dew.png', 'resources.moonDew'),
  s('gem', 'crystalCave', 'items/gem.png', 'mathItems.gem'),
  s('crystal', 'crystalCave', 'items/res-crystal.png', 'resources.crystal'),
  s('bat', 'crystalCave', 'items/bat.png', 'mathItems.bat'),
  s('candle', 'crystalCave', 'items/candle.png', 'mathItems.candle'),
  s('pebble', 'crystalCave', 'items/pebble.png', 'mathItems.pebble'),
  s('mithril', 'crystalCave', 'items/res-mithril.png', 'resources.mithril'),
  s('bee', 'sunnyMeadow', 'items/bee.png', 'mathItems.bee'),
  s('sunflower', 'sunnyMeadow', 'items/sunflower.png', 'mathItems.sunflower'),
  s('snail', 'sunnyMeadow', 'items/snail.png', 'mathItems.snail'),
  s('cloud', 'sunnyMeadow', 'items/cloud.png', 'mathItems.cloud'),
  s('sunflowerSeed', 'sunnyMeadow', 'items/res-sunflower-seed.png', 'resources.sunflowerSeed'),
  s('honey', 'sunnyMeadow', 'items/res-honey.png', 'resources.honey'),
];

export const getSticker = (id: string) => STICKERS.find((x) => x.id === id);

// 이 마을에서 다음에 받을 스티커 (다 모았으면 null)
export function nextSticker(region: RegionId, owned: readonly string[]): StickerDef | null {
  return STICKERS.find((x) => x.region === region && !owned.includes(x.id)) ?? null;
}
