import { useEffect, useState } from 'react';
import ShapeIcon from './ShapeIcon';
import CountBubble from './CountBubble';
import { range, useSequence, type FieldMode } from './useSequence';
import { useI18n, type TranslationKey } from '../../../i18n';
import { useSound } from '../../../services/audio/SoundProvider';
import type { MathScene, ShapeId } from '../../../types/math';

type Scene = Extract<MathScene, { kind: 'shapes' }>;

export const SHAPE_NAME: Record<ShapeId, TranslationKey> = {
  circle: 'shapes.circle',
  square: 'shapes.square',
  triangle: 'shapes.triangle',
};

// 도형 찾기: 찾는 도형을 누르면 센 순서대로 숫자가 붙는다.
// 다른 도형을 누르면 살짝 흔들리기만 한다 (벌칙 없음).
export default function ShapesField({ scene, mode, onDone }: { scene: Scene; mode: FieldMode; onDone?: () => void }) {
  const { t, formatNumber } = useI18n();
  const targets = range(scene.shapes.length).filter((i) => scene.shapes[i].shape === scene.target);
  const { picked, pick } = useSequence({ steps: targets.length, mode, demoOrder: targets, onDone });
  const [shaking, setShaking] = useState<number | null>(null);
  const { play } = useSound();

  // 흔들림은 잠깐만
  useEffect(() => {
    if (shaking === null) return;
    const timer = setTimeout(() => setShaking(null), 450);
    return () => clearTimeout(timer);
  }, [shaking]);

  const tap = (i: number) => {
    if (scene.shapes[i].shape === scene.target) return pick(i);
    setShaking(i);
    play.nope();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex max-w-md flex-wrap items-center justify-center gap-2">
        {scene.shapes.map((spec, i) => {
          const n = picked.indexOf(i);
          const counted = n >= 0;
          const body = (
            <>
              <ShapeIcon spec={spec} />
              {counted && (
                <span className="absolute -right-1 -top-1 flex h-7 min-w-7 animate-pop items-center justify-center rounded-full bg-wood px-1 text-base font-bold text-cream">
                  {formatNumber(n + 1)}
                </span>
              )}
            </>
          );
          const frame = `relative flex h-16 w-16 items-center justify-center rounded-2xl ${shaking === i ? 'animate-shake' : ''}`;
          return mode === 'interactive' && !counted ? (
            <button key={i} type="button" onClick={() => tap(i)} aria-label={t(SHAPE_NAME[spec.shape])} className={`${frame} bg-cream/70 shadow-pop-sm active:scale-90`}>
              {body}
            </button>
          ) : (
            <span key={i} className={frame} role="img" aria-label={t(SHAPE_NAME[spec.shape])}>
              {body}
            </span>
          );
        })}
      </div>
      {mode !== 'static' && <CountBubble value={picked.length} />}
    </div>
  );
}
