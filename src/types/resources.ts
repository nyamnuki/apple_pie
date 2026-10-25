import type { TranslationKey } from '../i18n';

// 마을(지역) id
export type RegionId = 'acornVillage' | 'moonlightForest';

export interface RegionDef {
  id: RegionId;
  nameKey: TranslationKey;
  emoji: string;
  open: boolean; // 지금 놀 수 있는 마을인지
}

// 재료 id — 마을마다 그 마을에서 나는 재료가 있다
export type ResourceId = 'acorn' | 'apple' | 'goldenAcorn' | 'glowBranch' | 'moonDew';

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
