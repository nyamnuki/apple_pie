import type { TranslationKey } from '../../i18n';

// ===== 캐릭터 목록 =====
// 표정별 그림을 public/assets/characters/<id>-<표정>.png 로 넣으면 그 그림을 쓴다.
// (표정 그림이 없으면 <id>-default.png, 그것도 없으면 코드로 그린 그림이나 그림 문자)

export const EXPRESSIONS = ['default', 'happy', 'thinking', 'cheer', 'surprised'] as const;
export type Expression = (typeof EXPRESSIONS)[number];

export type CharacterId = 'lulu' | 'doto' | 'momo';

export interface CharacterDef {
  id: CharacterId;
  nameKey: TranslationKey;
  descriptionKey: TranslationKey;
  fallbackEmoji: string; // 코드로 그린 그림도 없을 때
}

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  // 대표 캐릭터: 크림색 토끼, 잎사귀 망토, 작은 꽃 장식
  lulu: { id: 'lulu', nameKey: 'characters.lulu.name', descriptionKey: 'characters.lulu.description', fallbackEmoji: '🐰' },
  // 친구 캐릭터 (나중에 등장): 도토리 가방을 멘 고슴도치, 세이지색 스카프 다람쥐
  doto: { id: 'doto', nameKey: 'characters.doto.name', descriptionKey: 'characters.doto.description', fallbackEmoji: '🦔' },
  momo: { id: 'momo', nameKey: 'characters.momo.name', descriptionKey: 'characters.momo.description', fallbackEmoji: '🐿️' },
};

export const characterAssetPath = (id: CharacterId, expression: Expression) => `characters/${id}-${expression}.png`;
