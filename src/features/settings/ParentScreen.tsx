import { useState } from 'react';
import { ShieldCheck, BarChart3, BookOpen, Trash2, Clock } from '../../components/icons';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import ScreenHeader from '../../components/ScreenHeader';
import { useGame } from '../../app/GameProvider';
import { useRoom } from '../room/RoomProvider';
import { LESSONS, lessonKey } from '../../data/math/lessons';
import { REGIONS } from '../../data/regions/regions';
import RegionIcon from '../../components/RegionIcon';
import BackupSection from './BackupSection';
import InstallSection from './InstallSection';
import WeekChart from './WeekChart';
import { useSound } from '../../services/audio/SoundProvider';
import { useI18n } from '../../i18n';

// 부모 설정: 개인정보 안내, 진행 요약, 진행 상황 지우기 (언어 설정은 그대로 둔다)
export default function ParentScreen({ onBack }: { onBack: () => void }) {
  const { t, tKey, formatNumber, formatDateTime } = useI18n();
  const { game, dispatch } = useGame();
  const { breakMinutes, setBreakMinutes } = useSound();
  const { dispatch: roomDispatch } = useRoom();
  const [step, setStep] = useState<'idle' | 'confirm' | 'done'>('idle');
  const furnitureCount = Object.values(game.furniture).reduce((a, b) => a + b, 0);

  const eraseAll = () => {
    dispatch({ type: 'reset' });
    roomDispatch({ type: 'reset' });
    setStep('done');
  };

  const card = 'rounded-[2rem] border-2 border-bark/10 bg-moss/60 p-5 shadow-[inset_0_2px_0_rgb(255_255_255/0.5)]';
  const heading = 'mb-2 flex items-center gap-2 text-2xl font-bold';

  return (
    <AppShell>
      <ScreenHeader title={t('parent.title')} onBack={onBack} />
      {/* 어른용 안내 화면: 글을 복사할 수 있게 글자 선택을 허용한다 (버튼은 그대로) */}
      <div className="selectable flex flex-col gap-4 pb-4">
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

        <WeekChart className={card} />

        {/* 놀이별 기록: 몇 번 했는지, 한 번에 맞혔는지, 힌트를 얼마나 봤는지 */}
        <section aria-labelledby="lessons-h" className={card}>
          <h2 id="lessons-h" className={heading}>
            <BookOpen size={28} aria-hidden />
            {t('parent.lessonsTitle')}
          </h2>
          <p className="mb-3 text-base">{t('parent.lessonsIntro')}</p>
          {REGIONS.map((region) => (
            <div key={region.id} className="mb-3 last:mb-0">
              <h3 className="mb-1 text-xl font-bold">
                <RegionIcon id={region.id} size={28} inline /> {tKey(region.nameKey)}
              </h3>
              <ul className="flex flex-col gap-2">
                {LESSONS.filter((l) => l.region === region.id).map((lesson) => {
                  const s = game.lessonStats[lesson.id];
                  return (
                    <li key={lesson.id} data-lesson={lesson.id} className="rounded-2xl bg-cream/80 px-4 py-2">
                      <p className="text-lg font-bold">{t(lessonKey(lesson.id, 'title'))}</p>
                      {s ? (
                        <p className="text-base">
                          {t('parent.stats', { plays: formatNumber(s.plays), firstTry: formatNumber(s.firstTry), hints: formatNumber(s.hints) })}
                          <br />
                          {t('parent.lastPlayed', { time: formatDateTime(new Date(s.lastPlayed)) })}
                        </p>
                      ) : (
                        <p className="text-base">{t('parent.notPlayed')}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        {/* 쉬어 가기 알림 */}
        <section aria-labelledby="break-h" className={card}>
          <h2 id="break-h" className={heading}>
            <Clock size={28} aria-hidden />
            {t('breaks.setting')}
          </h2>
          <p className="mb-3 text-lg">{t('breaks.settingBody')}</p>
          <div role="radiogroup" aria-labelledby="break-h" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {([0, 15, 20, 30] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={breakMinutes === m}
                onClick={() => setBreakMinutes(m)}
                className={`min-h-[56px] rounded-3xl border-4 px-3 text-lg font-bold ${breakMinutes === m ? 'border-wood bg-apricot' : 'border-transparent bg-cream'}`}
              >
                {m === 0 ? t('breaks.off') : t('breaks.minutes', { n: formatNumber(m) })}
              </button>
            ))}
          </div>
        </section>

        <BackupSection className={card} />

        <InstallSection className={card} />

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
