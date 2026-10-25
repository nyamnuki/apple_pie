import ItemToken from './ItemToken';
import { range, useSequence, type FieldMode } from './useSequence';
import { useI18n } from '../../../i18n';
import type { MathItemId, MathScene } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'compare' }>;

// 비교하기: 두 그릇에서 하나씩 꺼내 짝을 짓는다. 짝 없이 남는 쪽이 더 많다.
export default function CompareField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t } = useI18n();
  const compact = Math.max(scene.a, scene.b) > 8; // 물건이 많으면 조금 작게
  const pairsNeeded = Math.min(scene.a, scene.b);
  const { picked, pick, finished } = useSequence({ steps: pairsNeeded, mode, demoOrder: range(pairsNeeded), onDone });
  const pairs = picked.length;
  // 그릇 안의 물건을 누르면 다음 짝을 만든다 (어느 것을 눌러도 같다)
  const makePair = mode === 'interactive' && !finished ? () => pick(pairs) : undefined;
  const showLeftover = finished && mode !== 'static';

  const bowl = (item: MathItemId, count: number) => (
    <div className={`relative flex flex-1 flex-wrap content-start justify-center gap-2 rounded-3xl bg-moss/70 p-3 ${compact ? 'min-h-[64px]' : 'min-h-[96px]'}`}>
      {range(count - pairs).map((i) => (
        <ItemToken compact={compact} key={i} item={item} onClick={makePair} label={t('math.a11y.pairItem')} />
      ))}
      {showLeftover && count > pairs && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-wood px-3 py-0.5 text-sm font-bold text-cream">{t('math.leftOver')}</span>
      )}
    </div>
  );

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4">
      {/* 물건이 많으면 두 그릇을 위아래로 놓아 한 줄에 더 많이 들어가게 한다 */}
      <div className={`flex w-full gap-3 ${compact ? 'flex-col' : ''}`}>
        {bowl(scene.itemA, scene.a)}
        {bowl(scene.itemB, scene.b)}
      </div>
      {/* 만든 짝: 위아래로 한 쌍씩 */}
      {pairs > 0 && (
        <div className="flex flex-wrap justify-center gap-2" aria-hidden="true">
          {range(pairs).map((i) => (
            <div key={i} className="flex flex-col items-center rounded-2xl bg-apricot/60 px-1 py-1">
              <ItemToken compact item={scene.itemA} size={compact ? 30 : 40} />
              <span className="h-2 w-1 rounded bg-wood" />
              <ItemToken compact item={scene.itemB} size={compact ? 30 : 40} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
