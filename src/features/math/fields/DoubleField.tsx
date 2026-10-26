import ItemToken from './ItemToken';
import CountBubble from './CountBubble';
import { range, useSequence, type FieldMode } from './useSequence';
import { useI18n } from '../../../i18n';
import type { MathScene } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'double' }>;

// 두 배: 호숫가의 물건을 누르면 바로 아래 물속에 거꾸로 비친 모습이 생긴다.
// 비친 모습에는 호숫가 수 다음부터 이어 센 번호 (n+1, n+2, …), 아래 동그라미는 모두 몇 개인지.
export default function DoubleField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, formatNumber } = useI18n();
  const order = range(scene.n);
  const compact = scene.n > 6;
  const { picked, pick } = useSequence({ steps: scene.n, mode, demoOrder: order, onDone });

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <div className="w-full overflow-hidden rounded-[2rem] ring-4 ring-mist">
        {/* 호숫가 */}
        <div role="group" aria-label={t('math.a11y.shore')} className="flex flex-wrap justify-center gap-2 bg-moss/70 px-2 pb-2 pt-3">
          {order.map((i) => (
            <ItemToken key={i} item={scene.item} compact={compact} onClick={mode === 'interactive' && !picked.includes(i) ? () => pick(i) : undefined} label={t('math.a11y.doubleItem')} />
          ))}
        </div>
        {/* 물속: 누른 물건만 거꾸로, 흐리게 비친다 */}
        <div role="group" aria-label={t('math.a11y.water')} className="flex flex-wrap justify-center gap-2 bg-mist px-2 pb-3 pt-2" data-water>
          {order.map((i) => {
            const k = picked.indexOf(i);
            return (
              <span key={i} className={`relative ${k < 0 ? 'invisible' : 'animate-pop'}`} data-reflection={k >= 0 ? i : undefined} aria-hidden="true">
                <span className="block opacity-55" style={{ transform: 'scaleY(-1)' }}>
                  <ItemToken item={scene.item} compact={compact} />
                </span>
                {k >= 0 && (
                  <span className="absolute -right-1 -top-1 flex h-7 min-w-7 items-center justify-center rounded-full bg-wood px-1 text-base font-bold text-cream">{formatNumber(scene.n + k + 1)}</span>
                )}
              </span>
            );
          })}
        </div>
      </div>
      {mode !== 'static' && <CountBubble value={scene.n + picked.length} />}
    </div>
  );
}
