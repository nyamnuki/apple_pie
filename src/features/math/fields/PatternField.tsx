import ItemToken from './ItemToken';
import { range, useSequence, type FieldMode } from './useSequence';
import { itemNameKey } from '../../../data/math/items';
import { useI18n } from '../../../i18n';
import type { MathScene } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'pattern' }>;

// 되풀이되는 묶음마다 번갈아 칠할 바탕색
const CHUNK_BG = ['bg-moss', 'bg-lavender'];

// 규칙 찾기: 하나씩 누르며 이름을 말하면, 되풀이되는 묶음이 색으로 묶이고
// 묶음 안의 순서(1, 2, …)가 붙는다. 다 누르면 '?' 자리에 다음 것이 나타난다.
export default function PatternField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, tKey, formatNumber } = useI18n();
  const L = scene.unit.length;
  const seq = range(scene.shown).map((i) => scene.unit[i % L]);
  const { picked, pick, finished } = useSequence({ steps: scene.shown, mode, demoOrder: range(scene.shown), onDone });
  const count = picked.length;
  const next = scene.unit[scene.shown % L];
  const reveal = finished && mode !== 'static';

  return (
    <div className="flex max-w-lg flex-wrap items-center justify-center gap-2">
      {seq.map((item, i) => {
        const said = i < count;
        // 묶음 하나를 다 말했으면 그 묶음에 바탕색
        const chunkDone = Math.floor(i / L) < Math.floor(count / L);
        return (
          <span key={i} className={`rounded-2xl p-0.5 transition-colors ${chunkDone ? CHUNK_BG[Math.floor(i / L) % 2] : ''}`}>
            <ItemToken
              item={item}
              badge={said ? formatNumber((i % L) + 1) : undefined}
              // 어느 것을 눌러도 다음 차례의 물건을 말한다 (순서대로 말하기)
              onClick={mode === 'interactive' && !finished ? () => pick(count) : undefined}
              label={t('math.a11y.sayItem', { name: tKey(itemNameKey(seq[count] ?? item)) })}
              size={44}
            />
          </span>
        );
      })}
      {/* 다음에 올 자리 */}
      <span className="rounded-2xl p-0.5">
        {reveal ? (
          <ItemToken item={next} badge={formatNumber((scene.shown % L) + 1)} size={44} />
        ) : (
          <span
            role="img"
            aria-label={t('math.a11y.nextSlot')}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-dashed border-wood/60 text-3xl font-bold text-wood"
          >
            ?
          </span>
        )}
      </span>
    </div>
  );
}
