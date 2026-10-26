import { useEffect, useRef, useState } from 'react';
import { X } from '../../../components/icons';
import SceneField from '../fields/SceneField';
import { useI18n } from '../../../i18n';
import type { MathScene } from '../../../types/math';

interface Props {
  scene: MathScene; // 살펴보기 장면
  before: string; // 시범 전 문장 (살펴보기)
  after: string; // 시범이 끝난 뒤 문장 (만져 보기를 마쳤을 때)
  onClose: () => void;
}

// 다시 보기: 놀이 중 언제든 살펴보기 장면을 시범(자동으로 하나씩)으로 다시 보여 준다.
// Esc·닫기·바깥을 누르면 닫히고, 하던 단계는 그대로다.
export default function WatchAgain({ scene, before, after, onClose }: Props) {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bark/40 p-4" onClick={(e) => e.target === e.currentTarget && onClose()} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="watch-title" className="storybook-card relative flex max-h-full w-full max-w-lg flex-col gap-3 overflow-y-auto rounded-[2rem] p-5">
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t('math.close')} className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-cream shadow-pop-sm">
          <X size={26} aria-hidden />
        </button>
        <h2 id="watch-title" className="pr-14 text-2xl font-bold">
          {t('math.watchTitle')}
        </h2>
        <p aria-live="polite" className="text-lg font-semibold">
          {done ? after : before}
        </p>
        <div className="flex min-h-[180px] items-center justify-center rounded-[2rem] bg-cream/85 p-3">
          <SceneField scene={scene} mode="demo" onDone={() => setDone(true)} />
        </div>
      </div>
    </div>
  );
}
