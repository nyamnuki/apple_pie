import { useState } from 'react';
import { ShieldCheck, BarChart3, Trash2 } from 'lucide-react';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import ScreenHeader from '../../components/ScreenHeader';
import { useGame } from '../../app/GameProvider';
import { useRoom } from '../room/RoomProvider';
import { LESSONS } from '../../data/math/lessons';
import { useI18n } from '../../i18n';

// 부모 설정: 개인정보 안내, 진행 요약, 진행 상황 지우기 (언어 설정은 그대로 둔다)
export default function ParentScreen({ onBack }: { onBack: () => void }) {
  const { t, formatNumber } = useI18n();
  const { game, dispatch } = useGame();
  const { dispatch: roomDispatch } = useRoom();
  const [step, setStep] = useState<'idle' | 'confirm' | 'done'>('idle');
  const furnitureCount = Object.values(game.furniture).reduce((a, b) => a + b, 0);

  const eraseAll = () => {
    dispatch({ type: 'reset' });
    roomDispatch({ type: 'reset' });
    setStep('done');
  };

  const card = 'rounded-[2rem] bg-moss/60 p-5';
  const heading = 'mb-2 flex items-center gap-2 text-2xl font-bold';

  return (
    <AppShell>
      <ScreenHeader title={t('parent.title')} onBack={onBack} />
      <div className="flex flex-col gap-4 pb-4">
        <section aria-labelledby="privacy-h" className={card}>
          <h2 id="privacy-h" className={heading}>
            <ShieldCheck size={28} aria-hidden />
            {t('parent.privacyTitle')}
          </h2>
          <p className="text-lg">{t('parent.privacyBody')}</p>
        </section>

        <section aria-labelledby="progress-h" className={card}>
          <h2 id="progress-h" className={heading}>
            <BarChart3 size={28} aria-hidden />
            {t('parent.progressTitle')}
          </h2>
          <ul className="text-lg">
            <li>{t('parent.lessonsDone', { n: formatNumber(game.completedLessons.length), total: formatNumber(LESSONS.length) })}</li>
            <li>{t('parent.furnitureOwned', { n: formatNumber(furnitureCount) })}</li>
          </ul>
        </section>

        <section aria-labelledby="reset-h" className="rounded-[2rem] border-4 border-dashed border-bark/30 p-5">
          <h2 id="reset-h" className={heading}>
            <Trash2 size={28} aria-hidden />
            {t('parent.resetTitle')}
          </h2>
          {step === 'done' ? (
            <p role="status" className="text-lg font-semibold">
              {t('parent.resetDone')}
            </p>
          ) : step === 'confirm' ? (
            <div role="alertdialog" aria-labelledby="reset-h" aria-describedby="reset-warning" className="flex flex-col gap-3">
              <p id="reset-warning" className="text-lg font-semibold">
                {t('parent.resetWarning')}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <BigButton variant="soft" onClick={() => setStep('idle')}>
                  {t('parent.cancel')}
                </BigButton>
                <BigButton onClick={eraseAll}>{t('parent.resetConfirm')}</BigButton>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-3 text-lg">{t('parent.resetBody')}</p>
              <BigButton variant="soft" className="w-full" onClick={() => setStep('confirm')}>
                <Trash2 size={24} aria-hidden />
                {t('parent.resetButton')}
              </BigButton>
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}
