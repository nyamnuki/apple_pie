import type { TranslationKey } from '../i18n';

// 마을(지역) id
export type RegionId = 'acornVillage' | 'moonlightForest' | 'crystalCave' | 'sunnyMeadow' | 'windyHill';

// 마을이 열리는 조건
export type RegionUnlock =
  | { type: 'always' } // 처음부터 열려 있음
  | { type: 'lessons'; region: RegionId; count: number }; // region 의 놀이를 count 개 끝내면 열림

export interface RegionDef {
  id: RegionId;
  nameKey: TranslationKey;
  topicsKey: TranslationKey; // 이 마을의 수학 영역 (지도에 표시)
  emoji: string;
  art: string; // 마을 상징 그림 (src/components/art/itemArt.tsx 의 경로)
  unlock: RegionUnlock;
}

// 재료 id — 마을마다 그 마을에서 나는 재료가 있다
export type ResourceId = 'acorn' | 'apple' | 'goldenAcorn' | 'glowBranch' | 'moonDew' | 'crystal' | 'mithril' | 'sunflowerSeed' | 'honey' | 'feather' | 'cloudCotton';

export interface ResourceDef {
  id: ResourceId;
  nameKey: TranslationKey;
  region: RegionId; // 이 재료가 나는 마을
  rare: boolean; // 드문 재료
  assetPath: string; // public/assets/ 아래 그림 경로
  placeholder: { emoji: string; color: string }; // 그림이 없을 때
}

// 재료 묶음 (예: { acorn: 4, apple: 2 })
export type ResourceBundle = Partial<Record<ResourceId, number>>;
