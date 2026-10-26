import AssetIcon from '../../../components/AssetIcon';
import { MATH_ITEMS } from '../../../data/math/items';
import CountBubble from './CountBubble';
import { range, useSequence, type FieldMode } from './useSequence';
import { useI18n } from '../../../i18n';
import type { MathScene } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'makeTen' }>;

// 10 만들기: 5칸씩 두 줄인 10칸 상자. 처음부터 있는 물건 뒤의 빈칸을 누르면 채워지고,
// 채운 것에는 1, 2, 3… 번호가 붙는다. 아래 동그라미는 '몇 개 더' 채웠는지.
export default function MakeTenField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, formatNumber } = useI18n();
  const more = 10 - scene.have;
  const { picked, pick } = useSequence({ steps: more, mode, demoOrder: range(more), onDone });
  const { emoji, assetPath } = MATH_ITEMS[scene.item];
  // 좁은 화면(320px)에서도 5칸이 한 줄에 들어가게 칸 크기를 줄인다
  const cellSize = 'h-11 w-11 min-[400px]:h-14 min-[400px]:w-14';
  const icon = <AssetIcon path={assetPath} emoji={emoji} size={30} />;

  return (
    <div className="flex flex-col items-center gap-4">
      <div role="group" aria-label={t('math.a11y.tenFrame')} className="grid grid-cols-5 gap-1 rounded-3xl bg-oak/30 p-1.5 ring-4 ring-oak/50 min-[400px]:gap-1.5 min-[400px]:p-2">
        {range(10).map((cell) => {
          if (cell < scene.have)
            return (
              <span key={cell} className={`flex ${cellSize} items-center justify-center rounded-2xl bg-cream`} aria-hidden="true">
                {icon}
              </span>
            );
          const k = cell - scene.have; // 몇 번째 빈칸
          const n = picked.indexOf(k);
          if (n >= 0)
            return (
              <span key={cell} className={`relative flex ${cellSize} animate-pop items-center justify-center rounded-2xl bg-apricot/70`} aria-hidden="true" data-filled>
                {icon}
                <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-wood px-1 text-sm font-bold text-cream">{formatNumber(n + 1)}</span>
              </span>
            );
          return mode === 'interactive' ? (
            <button
              key={cell}
              type="button"
              onClick={() => pick(k)}
              aria-label={t('math.a11y.fillSpot')}
              className={`${cellSize} rounded-2xl border-4 border-dashed border-oak/60 bg-cream/60 shadow-pop-sm transition-transform active:scale-95`}
            />
          ) : (
            <span key={cell} aria-hidden="true" className={`${cellSize} rounded-2xl border-4 border-dashed border-oak/60 bg-cream/60`} />
          );
        })}
      </div>
      {mode !== 'static' && <CountBubble value={picked.length} />}
    </div>
  );
}
