import { Check, Clock, Play, RotateCcw, Settings } from '../../components/icons';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import SaveNotice from '../../components/SaveNotice';
import Character from '../../components/characters/Character';
import TitleScene from '../../components/art/TitleScene';
import { useI18n } from '../../i18n';
import { useGame } from '../GameProvider';
import { useSound } from '../../services/audio/SoundProvider';
import { lessonKey } from '../../data/math/lessons';
import { LEVELS, type Level } from '../../data/math/sceneRules';
import { lastLesson } from '../../features/math/lastLesson';
import type { LessonId } from '../../types/math';
import type { LoadStatus } from '../../services/storage/gameSave';

// 타이틀 화면: 루루가 반겨 준다.
interface Props {
  onStart: () => void;
  onSettings: () => void;
  notice: LoadStatus | null; // 보여줄 저장 안내 (없으면 null)
  onCloseNotice: () => void;
  onContinue?: (id: LessonId) => void; // 마지막으로 한 놀이를 바로 시작
  onParent: () => void; // 쉬어 가기 표시를 누르면 어른 설정 (곱하기 확인을 거친다)
}

export default function TitleScreen({ onStart, onSettings, notice, onCloseNotice, onContinue, onParent }: Props) {
  const { t, formatNumber } = useI18n();
  const { game } = useGame();
  const { mathLevel, setMathLevel, breakMinutes } = useSound();
  const last = lastLesson(game.lessonStats);
  // 쉬어 가기 상태 (어른이 바꾼다). 어디 있는지 찾지 않아도 되도록 타이틀에 그대로 보여 준다.
  const restState = breakMinutes ? t('breaks.every', { n: formatNumber(breakMinutes) }) : t('breaks.everyOff');
  const LEVEL_LABEL: Record<Level, { name: string; range: string }> = {
    normal: { name: t('level.normal'), range: t('level.normalRange') },
    hard: { name: t('level.hard'), range: t('level.hardRange') },
  };
  return (
    <AppShell background="bg-gradient-to-b from-mist via-cream to-moss">
      <TitleScene />
      {notice && <SaveNotice status={notice} onClose={onCloseNotice} />}
      <div className="relative flex justify-end">
        <BigButton variant="soft" size="icon" onClick={onSettings} aria-label={t('a11y.openSettings')}>
          <Settings size={28} aria-hidden />
        </BigButton>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 text-center [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:gap-10">
        {/* 루루와 친구들 (도토·모모) */}
        <div className="flex items-end gap-1">
          <Character id="doto" expression="happy" size={92} />
          <Character expression="cheer" size={150} bob />
          <Character id="momo" expression="happy" size={92} />
        </div>
        <div className="flex w-full max-w-xs flex-col items-center gap-6 [@media(max-height:500px)]:gap-3">
          <div>
            {/* 제목: 크림색 종이 띠 위에 (뒤 풍경과 겹쳐도 또렷하게) */}
            <h1 className="storybook-card rounded-[2rem] px-6 py-2 text-5xl font-bold sm:text-6xl">{t('app.title')}</h1>
            <p className="mt-3 inline-block rounded-full bg-cream/80 px-4 text-2xl font-semibold text-wood">{t('app.subtitle')}</p>
          </div>
          <BigButton size="lg" onClick={onStart} className="w-full">
            <Play size={30} fill="currentColor" aria-hidden />
            {t('menu.start')}
          </BigButton>
          {/* 이어서 하기: 마지막으로 끝낸 놀이를 바로 (처음 하는 아이에게는 없음) */}
          {onContinue && last && (
            <BigButton variant="sage" onClick={() => onContinue(last)} className="w-full">
              <RotateCcw size={24} aria-hidden />
              {t('menu.continue', { title: t(lessonKey(last, 'title')) })}
            </BigButton>
          )}

          {/* 문제의 수 크기: 보통(20까지) / 어려움(50까지). 고르면 바로 저장된다 */}
          <div className="w-full rounded-[2rem] bg-cream/85 p-3">
            <p className="mb-2 text-center text-base font-bold text-wood">{t('level.label')}</p>
            <div role="radiogroup" aria-label={t('level.label')} className="grid grid-cols-2 gap-2">
              {LEVELS.map((code) => {
                const selected = code === mathLevel;
                const label = LEVEL_LABEL[code];
                return (
                  <button
                    key={code}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setMathLevel(code)}
                    // 색만으로 구분하지 않도록 고른 쪽에 체크 표시도 함께 보여 준다
                    className={`flex min-h-[56px] flex-col items-center justify-center rounded-3xl border-4 px-1 py-1 leading-tight ${
                      selected ? 'border-oak bg-apricot shadow-pop-sm' : 'border-transparent bg-white shadow-pop'
                    }`}
                  >
                    <span className="flex items-center gap-1 text-lg font-bold">
                      {selected && <Check size={18} strokeWidth={3} aria-hidden />}
                      {label.name}
                    </span>
                    <span className="text-sm text-bark">{label.range}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 하루 놀이 시간 안전장치: 지금 상태를 타이틀에 보여 주고, 누르면 어른 설정으로 간다 */}
      <button
        type="button"
        onClick={onParent}
        aria-label={t('breaks.open', { state: restState })}
        className="relative mx-auto mt-4 flex min-h-[56px] items-center gap-2 rounded-full bg-cream/85 px-5 text-lg font-bold text-wood shadow-pop-sm"
      >
        <Clock size={22} aria-hidden />
        {restState}
      </button>

      <p className="relative mx-auto mt-2 rounded-full bg-cream/85 px-4 py-1 text-center text-sm text-bark">{t('app.promise')}</p>
    </AppShell>
  );
}
