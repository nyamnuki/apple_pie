import AssetIcon from '../../../components/AssetIcon';
import { ArrowLeft } from '../../../components/icons';
import { MATH_ITEMS } from '../../../data/math/items';
import { useSequence, range, type FieldMode } from './useSequence';
import { useI18n } from '../../../i18n';
import type { MathScene } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'ordinal' }>;

// 몇 번째: 왼쪽이 맨 앞인 한 줄. 맨 앞부터 차례로만 누를 수 있어서 언제나 앞에서부터 센다 (1, 2, 3…).
// 시범(확인하기·같이 세기)에서는 찾는 자리에 오면 그 친구를 둥근 테두리로 표시한다.
export default function OrdinalField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, formatNumber } = useI18n();
  const n = scene.items.length;
  const { picked, pick } = useSequence({ steps: n, mode, demoOrder: range(n), onDone });
  const showTarget = (mode === 'demo' || mode === 'revealed') && picked.includes(scene.position - 1);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-end gap-1 border-b-8 border-dotted border-oak/50 px-1 pb-1 min-[400px]:gap-2">
        {scene.items.map((item, i) => {
          const counted = picked.includes(i);
          const next = mode === 'interactive' && i === picked.length; // 다음 차례만 누를 수 있다
          const target = showTarget && i === scene.position - 1;
          const { emoji, assetPath } = MATH_ITEMS[item];
          const body = (
            <>
              <AssetIcon path={assetPath} emoji={emoji} size={38} />
              {counted && (
                <span className="absolute -right-1 -top-2 flex h-6 min-w-6 animate-pop items-center justify-center rounded-full bg-wood px-1 text-sm font-bold text-cream">{formatNumber(i + 1)}</span>
              )}
            </>
          );
          const frame = `relative flex h-11 w-11 min-[400px]:h-14 min-[400px]:w-14 items-center justify-center rounded-2xl ${target ? 'ring-4 ring-wood' : ''} ${counted ? 'bg-apricot/60' : ''}`;
          return next ? (
            <button key={item} type="button" onClick={() => pick(i)} aria-label={t('math.a11y.lineItem')} className={`${frame} bg-cream shadow-pop-sm transition-transform active:scale-95`} data-line={i}>
              {body}
            </button>
          ) : (
            <span key={item} className={frame} aria-hidden="true" data-line={i} data-target={target || undefined}>
              {body}
            </span>
          );
        })}
      </div>
      {/* 맨 앞 표시 (왼쪽) */}
      <div className="flex w-full items-center gap-1 text-base font-bold" aria-hidden="true">
        <ArrowLeft size={20} />
        {t('math.front')}
      </div>
      <span className="sr-only">{t('math.a11y.lineInfo', { total: formatNumber(n) })}</span>
    </div>
  );
}
