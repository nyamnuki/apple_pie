import ItemToken from './ItemToken';
import CountBubble from './CountBubble';
import { range, useSequence, type FieldMode } from './useSequence';
import { useI18n } from '../../../i18n';
import type { MathScene } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'count' }>;

// 수 세기: 물건을 하나씩 누르면 센 순서대로 숫자가 붙는다
export default function CountField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, formatNumber } = useI18n();
  const order = range(scene.total);
  const { picked, pick } = useSequence({ steps: scene.total, mode, demoOrder: order, onDone });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex max-w-md flex-wrap justify-center gap-3">
        {order.map((i) => {
          const n = picked.indexOf(i);
          return (
            <ItemToken
              key={i}
              item={scene.item}
              badge={n >= 0 ? formatNumber(n + 1) : undefined}
              onClick={mode === 'interactive' && n < 0 ? () => pick(i) : undefined}
              label={t('math.a11y.countItem')}
            />
          );
        })}
      </div>
      {mode !== 'static' && <CountBubble value={picked.length} />}
    </div>
  );
}
