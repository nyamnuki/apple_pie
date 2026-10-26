import { Move, RotateCw, PackageOpen, Check } from '../../../components/icons';
import BigButton from '../../../components/BigButton';
import AssetThumb from '../../../components/AssetThumb';
import { useI18n } from '../../../i18n';
import { TINTS, tintCss, type Tint } from '../tints';
import type { FurnitureDef } from '../../../types/furniture';

interface Props {
  def: FurnitureDef;
  onMove: () => void;
  onTurn?: () => void; // 없으면 '돌리기' 버튼을 숨긴다 (벽 장식)
  onPutAway: () => void;
  onDone: () => void;
  tint?: Tint; // 지금 색 (바닥 가구만)
  onTint?: (tint: Tint) => void; // 없으면 색 고르기를 숨긴다 (벽 장식)
}

// 방의 가구를 골랐을 때 나오는 버튼들: 옮기기 / 돌리기 / 치우기 / 다 했어요
export default function SelectedActions({ def, onMove, onTurn, onPutAway, onDone, tint = 0, onTint }: Props) {
  const { t, tKey } = useI18n();
  return (
    <div className="flex flex-col gap-3">
      {/* 지금 고른 물건: 그림 + 이름 (방에서도 화살표로 가리킨다) */}
      <div className="flex items-center gap-3 rounded-3xl bg-cream/90 p-2 pr-4 shadow-pop-sm">
        <AssetThumb def={def} size={56} />
        <p className="min-w-0 flex-1 text-base leading-snug">
          <strong className="block text-lg">{tKey(def.nameKey)}</strong>
          {tKey(def.descriptionKey)}
        </p>
      </div>
      {/* 색 고르기: 같은 가구를 3가지 색으로 미리 보여 주고 하나를 고른다 */}
      {onTint && (
        <div role="radiogroup" aria-label={t('decorate.paint')} className="flex items-center justify-center gap-3">
          {TINTS.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={tint === n}
              aria-label={t('decorate.paintOption', { n: n + 1 })}
              onClick={() => onTint(n)}
              className={`selectable flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-cream shadow-pop-sm ring-4 ${tint === n ? 'ring-wood' : 'ring-transparent'}`}
            >
              <span style={{ filter: tintCss(n) }} className="flex">
                <AssetThumb def={def} size={52} />
              </span>
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 [@media(max-height:500px)]:grid-cols-2">
        <BigButton variant="sage" onClick={onMove}>
          <Move size={26} aria-hidden />
          {t('decorate.move')}
        </BigButton>
        {onTurn && (
          <BigButton variant="sage" onClick={onTurn}>
            <RotateCw size={26} aria-hidden />
            {t('decorate.turn')}
          </BigButton>
        )}
        <BigButton variant="soft" onClick={onPutAway}>
          <PackageOpen size={26} aria-hidden />
          {t('decorate.putAway')}
        </BigButton>
        <BigButton onClick={onDone}>
          <Check size={26} strokeWidth={3} aria-hidden />
          {t('decorate.done')}
        </BigButton>
      </div>
    </div>
  );
}
