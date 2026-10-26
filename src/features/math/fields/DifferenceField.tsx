import ItemToken from './ItemToken';
import CountBubble from './CountBubble';
import { range, useSequence, type FieldMode } from './useSequence';
import { useI18n } from '../../../i18n';
import type { MathScene } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'difference' }>;

// 몇 개 더 많을까: 두 줄을 한 칸씩 위아래로 세운다. 아래 줄 물건을 누르면 위 물건과 짝(막대로 이어짐).
// 다 짝지으면 짝 없는 위 줄 물건에 1, 2, 3… 번호, 아래 동그라미가 '몇 개 더'.
export default function DifferenceField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, formatNumber } = useI18n();
  const { picked, pick, finished } = useSequence({ steps: scene.b, mode, demoOrder: range(scene.b), onDone });
  const showExtra = finished && mode !== 'static';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex max-w-md flex-wrap justify-center gap-x-1 gap-y-3">
        {range(scene.a).map((i) => {
          const paired = picked.includes(i);
          const extra = i >= scene.b;
          return (
            <div key={i} className={`flex w-12 flex-col items-center rounded-2xl py-1 ${paired ? 'bg-apricot/60' : ''}`} data-column={i}>
              <ItemToken compact item={scene.itemA} badge={showExtra && extra ? formatNumber(i - scene.b + 1) : undefined} />
              {/* 짝을 지으면 위아래를 잇는 막대 */}
              <span className={`h-3 w-1 rounded ${paired ? 'bg-wood' : 'bg-transparent'}`} aria-hidden="true" />
              {i < scene.b ? (
                <ItemToken
                  compact
                  item={scene.itemB}
                  onClick={mode === 'interactive' && !paired ? () => pick(i) : undefined}
                  label={t('math.a11y.matchItem')}
                />
              ) : (
                <span className="h-12 w-12 rounded-2xl border-4 border-dashed border-bark/20" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
      {showExtra && <CountBubble value={scene.a - scene.b} />}
    </div>
  );
}
