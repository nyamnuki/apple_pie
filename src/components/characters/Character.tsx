import type { ComponentType } from 'react';
import LuluSvg from './LuluSvg';
import { CHARACTERS, characterAssetPath, type CharacterId, type Expression } from '../../data/characters/characters';
import { assetUrl } from '../../data/assets/assetRegistry';
import { useAssetStatus } from '../../services/assets/useAssetStatus';
import { useI18n, type TranslationKey } from '../../i18n';

// 코드로 그린 캐릭터 그림 (새 캐릭터를 그리면 여기에 추가)
const DRAWN: Partial<Record<CharacterId, ComponentType<{ expression: Expression }>>> = { lulu: LuluSvg };

const MOOD_KEY: Record<Expression, TranslationKey> = {
  default: 'characters.moods.default',
  happy: 'characters.moods.happy',
  thinking: 'characters.moods.thinking',
  cheer: 'characters.moods.cheer',
  surprised: 'characters.moods.surprised',
};

interface Props {
  id?: CharacterId;
  expression?: Expression;
  size?: number; // 높이(px)
  bob?: boolean; // 살짝 위아래로 움직이기
}

// 캐릭터 한 명. 그림 순서: 표정 그림 파일 → 기본 그림 파일 → 코드로 그린 그림 → 그림 문자
export default function Character({ id = 'lulu', expression = 'default', size = 64, bob = false }: Props) {
  const { t, tKey } = useI18n();
  const def = CHARACTERS[id];
  const exprUrl = assetUrl(characterAssetPath(id, expression));
  const baseUrl = assetUrl(characterAssetPath(id, 'default'));
  const exprStatus = useAssetStatus(exprUrl);
  const baseStatus = useAssetStatus(baseUrl);
  const Drawn = DRAWN[id];
  const label = t('characters.label', { name: tKey(def.nameKey), mood: t(MOOD_KEY[expression]) });

  const body =
    exprStatus === 'ok' ? (
      <img src={exprUrl} alt="" className="h-full w-full object-contain" />
    ) : baseStatus === 'ok' ? (
      <img src={baseUrl} alt="" className="h-full w-full object-contain" />
    ) : Drawn ? (
      <Drawn expression={expression} />
    ) : (
      <span className="flex h-full w-full items-center justify-center leading-none" style={{ fontSize: size * 0.8 }}>
        {def.fallbackEmoji}
      </span>
    );

  return (
    <span role="img" aria-label={label} className={`inline-block shrink-0 ${bob ? 'animate-bob' : ''}`} style={{ width: size * 0.8, height: size }}>
      {body}
    </span>
  );
}
