import ResourceChip from '../../components/ResourceChip';
import { STAMPS_PER_GOLDEN, goldenForStamp } from '../../app/gameState';
import { useMemo, useState } from 'react';
import AppShell from '../../components/AppShell';
import ScreenHeader from '../../components/ScreenHeader';
import GuideBubble from '../../components/GuideBubble';
import BigButton from '../../components/BigButton';
import ChoiceButtons from '../math/components/ChoiceButtons';
import SceneField from '../math/fields/SceneField';
import { GUIDE_OF } from '../math/LessonScreen';
import { answerOf, sceneVars } from '../math/answers';
import { lessonKey } from '../../data/math/lessons';
import { streak, dailyLesson, dateKey } from './daily';
import { useGame } from '../../app/GameProvider';
import { useSound } from '../../services/audio/SoundProvider';
import { useI18n } from '../../i18n';
import { Check } from '../../components/icons';
import type { MathAnswer } from '../../types/math';

// 오늘의 문제: 끝낸 놀이에서 하루 한 문제. 틀리면 그 놀이의 힌트, 두 번 틀리면 직접 만져 보기, 세 번이면 같이 해 보기.
export default function DailyScreen({ onBack }: { onBack: () => void }) {
  const { t, formatNumber } = useI18n();
  const { game, dispatch } = useGame();
  const { play } = useSound();
  const [today] = useState(() => new Date());
  const key = dateKey(today);
  const lesson = useMemo(() => dailyLesson(today, game.completedLessons), [today, game.completedLessons]);
  const [wrong, setWrong] = useState<MathAnswer[]>([]);
  const [solved, setSolved] = useState(game.dailyDone.includes(key));
  const [justSolved, setJustSolved] = useState(false); // 이 화면에서 방금 풀었는지 (선물은 그때만 보여 준다)

  if (!lesson) return null;
  const answer = answerOf(lesson.apply);
  const vars = sceneVars(lesson.apply, formatNumber);
  const level = Math.min(wrong.length, 3);
  const k = (part: Parameters<typeof lessonKey>[1]) => t(lessonKey(lesson.id, part), vars);
  const text = solved ? `${k('correct')} ${t('daily.stamp')}` : level === 0 ? k('apply') : `${t('math.tryAgain')} ${k(`hint${level}` as 'hint1')}`;

  const days = streak(game.dailyDone, today); // 연속으로 푼 날

  const choose = (c: MathAnswer) => {
    if (solved) return;
    if (c === answer) {
      play.reward();
      setSolved(true);
      setJustSolved(true);
      dispatch({ type: 'dailyDone', date: key });
    } else {
      play.tryAgain();
      if (!wrong.includes(c)) setWrong([...wrong, c]);
    }
  };

  return (
    <AppShell background="bg-gradient-to-b from-apricot/40 via-cream to-moss">
      <ScreenHeader title={t('daily.title')} onBack={onBack} />
      <div className="flex flex-1 flex-col gap-4">
        <p className="text-lg font-semibold text-wood">{t('daily.from', { lesson: t(lessonKey(lesson.id, 'title')) })}</p>
        <GuideBubble text={text} speaker={GUIDE_OF[lesson.region]} expression={solved ? 'happy' : level > 0 ? 'cheer' : 'thinking'} />
        <section className="flex min-h-[200px] items-center justify-center rounded-[2rem] border-2 border-bark/10 bg-cream/85 p-4">
          <SceneField key={`${level}-${solved}`} scene={lesson.apply} mode={solved ? 'revealed' : level >= 3 ? 'demo' : level >= 2 ? 'interactive' : 'static'} />
        </section>
        {solved ? (
          <div className="flex flex-col items-center gap-3">
            {/* 오늘의 도장 */}
            <div role="status" className="flex animate-pop items-center gap-3 rounded-3xl bg-apricot/70 px-5 py-3">
              <span className="flex h-14 w-14 rotate-[-8deg] items-center justify-center rounded-full border-4 border-wood text-wood">
                <Check size={30} strokeWidth={3} aria-hidden />
              </span>
              <span className="text-xl font-bold">
                {t('daily.stamps', { n: formatNumber(game.dailyDone.length) })}
                {days >= 2 && <span className="block text-lg">{t('daily.streak', { n: formatNumber(days) })}</span>}
              </span>
            </div>
            {justSolved && goldenForStamp(game.dailyDone.length) ? (
              <div role="status" className="flex animate-rise items-center gap-3 text-xl font-bold" style={{ animationDelay: '300ms' }}>
                {t('daily.golden')}
                <ResourceChip id="goldenAcorn" amount={1} prefix="+" size="lg" />
              </div>
            ) : (
              <p className="text-lg font-semibold">{t('daily.nextGolden', { n: formatNumber(STAMPS_PER_GOLDEN - (game.dailyDone.length % STAMPS_PER_GOLDEN)) })}</p>
            )}
            <BigButton size="lg" className="w-full" onClick={onBack}>
              {t('daily.back')}
            </BigButton>
          </div>
        ) : (
          <ChoiceButtons choices={lesson.applyChoices} labels={lesson.applyLabels} tried={wrong} onChoose={choose} />
        )}
      </div>
    </AppShell>
  );
}
