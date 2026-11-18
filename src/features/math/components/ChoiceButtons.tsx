import { Check, X } from '../../../components/icons';
import AssetIcon from '../../../components/AssetIcon';
import { MATH_ITEMS, itemManyKey, itemNameKey } from '../../../data/math/items';
import { useI18n } from '../../../i18n';
import type { MathAnswer, MathItemId, MathScene } from '../../../types/math';

const isItem = (c: MathAnswer): c is MathItemId => typeof c === 'string' && c in MATH_ITEMS;
const isTime = (c: MathAnswer) => typeof c === 'string' && /^\d{1,2}:\d\d$/.test(c);

interface Props {
  choices: MathAnswer[];
  scene?: MathScene; // 이 선택지의 장면 (비교 문제는 두 묶음의 물건 이름을 버튼에 쓴다)
  tried?: MathAnswer[]; // 이미 고른 오답 (흐리게 + ✕)
  chosen?: MathAnswer | null; // 맞힌 답 (✓)
  onChoose: (answer: MathAnswer) => void;
}

// 큰 답 버튼들. 상태를 색만이 아니라 ✓ / ✕ 표시로도 알려준다.
export default function ChoiceButtons({ choices, scene, tried = [], chosen = null, onChoose }: Props) {
  const { t, tKey, formatNumber } = useI18n();
  const groupLabel = (side: 'a' | 'b') =>
    scene?.kind === 'compare' ? t('math.groupLabel', { item: tKey(itemManyKey(side === 'a' ? scene.itemA : scene.itemB)) }) : side;
  // 시각: 영어 '7:00' / 한국어 '7시', '7시 30분'
  const timeLabel = (c: MathAnswer) => {
    const [h, m] = String(c).split(':');
    return t(m === '30' ? 'math.timeHalf' : 'math.timeHour', { h: formatNumber(Number(h)) });
  };
  const labelOf = (c: MathAnswer) =>
    typeof c === 'number'
      ? formatNumber(c)
      : isItem(c)
        ? t(itemNameKey(c))
        : c === 'same'
          ? t('math.same')
          : c === 'even' || c === 'odd'
            ? t(c === 'even' ? 'math.even' : 'math.odd')
            : isTime(c)
              ? timeLabel(c)
          : groupLabel(c === 'a' ? 'a' : 'b');
  const numeric = typeof choices[0] === 'number';
  const items = isItem(choices[0]);

  return (
    // 높이가 낮은 가로 화면: 버튼을 낮추고 시각 보기도 한 줄에 (두 줄이면 아래 줄이 화면 밖으로 잘린다)
    <div
      role="group"
      aria-label={t('math.a11y.choicesLabel')}
      className={`grid gap-3 [@media(max-height:500px)]:gap-2 ${numeric || (items && choices.length > 3) ? 'grid-cols-4' : choices.length === 2 ? 'grid-cols-2' : isTime(choices[0]) ? `grid-cols-2 ${choices.length === 4 ? '[@media(max-height:500px)]:grid-cols-4' : ''}` : 'grid-cols-3'}`}>
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
            className={`relative flex min-h-[72px] [@media(max-height:500px)]:min-h-[56px] items-center justify-center gap-2 rounded-3xl px-3 py-2 font-bold shadow-pop transition-transform active:translate-y-1 active:shadow-pop-sm ${
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
