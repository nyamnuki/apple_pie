import ItemToken from './ItemToken';
import TenBox, { BOX_FROM } from './TenBox';
import CountBubble from './CountBubble';
import { range, useSequence, type FieldMode } from './useSequence';
import { useI18n } from '../../../i18n';
import type { MathScene } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'subtract' }>;

// 빼기: 물건을 눌러 덜어 내고, 다 덜어 내면 남은 물건에 숫자를 붙여 센다
export default function SubtractField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, formatNumber } = useI18n();
  const compact = scene.start > 10; // 물건이 많으면 조금 작게
  const all = range(scene.start);
  // 자동 진행할 때는 끝에서부터 덜어 낸다
  const { picked, pick, finished } = useSequence({ steps: scene.remove, mode, demoOrder: [...all].reverse(), onDone });
  const remaining = all.filter((i) => !picked.includes(i));
  // 처음 수가 크면 덜어 내지 않는 앞쪽의 꽉 찬 10 묶음은 10 상자로 (덜어 낼 물건은 모두 낱개로 남긴다)
  const boxes = scene.start >= BOX_FROM ? Math.floor((scene.start - scene.remove) / 10) : 0;
  const loose = all.filter((i) => i >= boxes * 10);
  const looseLeft = remaining.filter((i) => i >= boxes * 10);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex max-w-md flex-wrap justify-center gap-3 rounded-3xl bg-moss/70 p-3">
        {range(boxes).map((b) => (
          <TenBox key={`b${b}`} item={scene.item} badge={finished && mode !== 'static' ? formatNumber((b + 1) * 10) : undefined} />
        ))}
        {loose.map((i) => {
          const removed = picked.includes(i);
          const leftIndex = looseLeft.indexOf(i);
          return (
            <ItemToken
              compact={compact}
              key={i}
              item={scene.item}
              removed={removed}
              // 문제만 보여줄 때는 덜어 낼 물건(끝에서부터)에 점선 표시
              leaving={mode === 'static' && i >= scene.start - scene.remove}
              badge={finished && mode !== 'static' && leftIndex >= 0 ? formatNumber(boxes * 10 + leftIndex + 1) : undefined}
              onClick={mode === 'interactive' && !removed && !finished ? () => pick(i) : undefined}
              label={t('math.a11y.removeItem')}
            />
          );
        })}
      </div>
      {mode !== 'static' && finished && <CountBubble value={remaining.length} />}
    </div>
  );
}
