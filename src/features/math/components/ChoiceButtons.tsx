import { Check, X } from 'lucide-react';
import AssetIcon from '../../../components/AssetIcon';
import { MATH_ITEMS, itemNameKey } from '../../../data/math/items';
import { useI18n } from '../../../i18n';
import type { CompareLabels, MathAnswer, MathItemId } from '../../../types/math';

const isItem = (c: MathAnswer): c is MathItemId => typeof c === 'string' && c in MATH_ITEMS;

interface Props {
  choices: MathAnswer[];
  labels?: CompareLabels; // 비교 문제의 그룹 이름
  tried?: MathAnswer[]; // 이미 고른 오답 (흐리게 + ✕)
  chosen?: MathAnswer | null; // 맞힌 답 (✓)
  onChoose: (answer: MathAnswer) => void;
}

// 큰 답 버튼들. 상태를 색만이 아니라 ✓ / ✕ 표시로도 알려준다.
export default function ChoiceButtons({ choices, labels, tried = [], chosen = null, onChoose }: Props) {
  const { t, formatNumber } = useI18n();
  const labelOf = (c: MathAnswer) =>
    typeof c === 'number'
      ? formatNumber(c)
      : isItem(c)
        ? t(itemNameKey(c))
        : c === 'same'
          ? t('math.same')
          : t(c === 'a' ? labels!.a : labels!.b);
  const numeric = typeof choices[0] === 'number';
  const items = isItem(choices[0]);

  return (
    <div role="group" aria-label={t('math.a11y.choicesLabel')} className={`grid gap-3 ${numeric || (items && choices.length > 3) ? 'grid-cols-4' : 'grid-cols-3'}`}>
      {choices.map((c) => {
        const isTried = tried.includes(c);
        const isChosen = chosen === c;
        const label = labelOf(c);
        return (
          <button
            key={String(c)}
            type="button"
            disabled={isTried || chosen !== null}
            onClick={() => onChoose(c)}
            aria-label={isTried ? t('math.a11y.triedChoice', { choice: label }) : label}
            className={`relative flex min-h-[72px] items-center justify-center gap-2 rounded-3xl px-3 py-2 font-bold shadow-pop transition-transform active:translate-y-1 active:shadow-pop-sm ${
              // 비교 문제 답(글자)은 좁은 폰에서도 한 줄에 3개가 들어가도록 조금 작게, 필요하면 두 줄
              numeric ? 'text-4xl' : items ? 'text-xl' : 'text-lg leading-tight sm:text-xl'
            } ${isChosen ? 'bg-sage ring-4 ring-wood' : 'bg-cream'} ${isTried ? 'opacity-40 shadow-none line-through' : ''}`}
          >
            {/* 물건 답은 그림 + 작은 이름 */}
            {isItem(c) ? (
              <span className="flex flex-col items-center">
                <AssetIcon path={MATH_ITEMS[c].assetPath} emoji={MATH_ITEMS[c].emoji} size={44} />
                <span className="text-base">{label}</span>
              </span>
            ) : (
              label
            )}
            {isTried && <X size={24} strokeWidth={3} aria-hidden className="absolute right-2 top-2" />}
            {isChosen && <Check size={28} strokeWidth={3} aria-hidden className="absolute right-2 top-2" />}
          </button>
        );
      })}
    </div>
  );
}
