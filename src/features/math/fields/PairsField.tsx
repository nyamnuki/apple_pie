import ItemToken from './ItemToken';
import { range, useSequence, type FieldMode } from './useSequence';
import { useI18n } from '../../../i18n';
import type { MathScene } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'pairs' }>;

const PAIR_COLORS = ['#A8C3A0', '#F3C6D2', '#C8DFE8', '#F5D0AD', '#D9D0EC'];

// 짝짓기: 물건을 차례로 누르면 둘씩 짝이 된다 (짝마다 같은 색 테두리와 같은 번호).
// 다 누른 뒤 혼자 남은 것이 있으면 점선 테두리와 '!' 로 보여준다 (색만으로 알리지 않음).
export default function PairsField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, formatNumber } = useI18n();
  const order = range(scene.total);
  const { picked, pick, finished } = useSequence({ steps: scene.total, mode, demoOrder: order, onDone });

  return (
    <div className="flex max-w-md flex-wrap justify-center gap-3">
      {order.map((i) => {
        const k = picked.indexOf(i);
        const pair = k >= 0 ? Math.floor(k / 2) : -1;
        // 혼자 남은 것: 다 짝지었는데 마지막 하나가 짝이 없을 때
        const alone = finished && k === scene.total - 1 && scene.total % 2 === 1;
        return (
          <span
            key={i}
            className={`rounded-2xl ${alone ? 'outline-dashed outline-4 outline-offset-2 outline-bark/50' : ''}`}
            style={pair >= 0 && !alone ? { boxShadow: `0 0 0 4px ${PAIR_COLORS[pair % PAIR_COLORS.length]}` } : undefined}
          >
            <ItemToken
              item={scene.item}
              compact={scene.total > 10}
              badge={alone ? '!' : pair >= 0 ? formatNumber(pair + 1) : undefined}
              onClick={mode === 'interactive' && k < 0 ? () => pick(i) : undefined}
              label={t('math.a11y.pairItem2')}
            />
          </span>
        );
      })}
    </div>
  );
}
