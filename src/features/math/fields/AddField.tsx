import { Plus } from 'lucide-react';
import ItemToken from './ItemToken';
import CountBubble from './CountBubble';
import { range, useSequence, type FieldMode } from './useSequence';
import { useI18n } from '../../../i18n';
import type { MathScene } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'add' }>;

// 더하기: 처음 묶음(왼쪽)에 기다리는 물건(오른쪽)을 하나씩 옮기며 이어 센다
export default function AddField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, formatNumber } = useI18n();
  const { picked, pick } = useSequence({ steps: scene.add, mode, demoOrder: range(scene.add), onDone });
  const showNumbers = mode !== 'static';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        {/* 처음 묶음 + 옮겨 온 물건 */}
        <div className="flex min-h-[88px] max-w-xs flex-wrap justify-center gap-2 rounded-3xl bg-moss/70 p-3">
          {range(scene.start).map((i) => (
            <ItemToken key={`s${i}`} item={scene.item} badge={showNumbers ? formatNumber(i + 1) : undefined} />
          ))}
          {picked.map((i, n) => (
            <ItemToken key={`a${i}`} item={scene.item} badge={formatNumber(scene.start + n + 1)} />
          ))}
        </div>

        {picked.length < scene.add && (
          <>
            <Plus size={36} strokeWidth={3} aria-hidden />
            {/* 기다리는 물건 */}
            <div className="flex min-h-[88px] flex-wrap justify-center gap-2 rounded-3xl border-4 border-dashed border-oak/40 p-2">
              {range(scene.add)
                .filter((i) => !picked.includes(i))
                .map((i) => (
                  <ItemToken key={`w${i}`} item={scene.item} onClick={mode === 'interactive' ? () => pick(i) : undefined} label={t('math.a11y.addItem')} />
                ))}
            </div>
          </>
        )}
      </div>
      {showNumbers && <CountBubble value={scene.start + picked.length} />}
    </div>
  );
}
