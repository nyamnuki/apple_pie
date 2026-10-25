import { useReducer } from 'react';
import { ArrowRight, RotateCcw, LayoutGrid } from 'lucide-react';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import ScreenHeader from '../../components/ScreenHeader';
import GuideBubble from './components/GuideBubble';
import StageProgress from './components/StageProgress';
import ChoiceButtons from './components/ChoiceButtons';
import SceneField from './fields/SceneField';
import type { FieldMode } from './fields/useSequence';
import { hintLevel, initialLessonState, lessonReducer, type LessonState } from './lessonFlow';
import { answerOf, sceneVars } from './answers';
import { getLesson, lessonKey } from '../../data/math/lessons';
import { useI18n } from '../../i18n';
import type { LessonId, MathLesson, MathScene } from '../../types/math';

// 단계마다 어떤 장면을 어떤 방식으로 보여줄지
function fieldFor(lesson: MathLesson, s: LessonState): { scene: MathScene; mode: FieldMode } {
  switch (s.stage) {
    case 'observe':
      return { scene: lesson.explore, mode: 'static' };
    case 'manipulate':
      return { scene: lesson.explore, mode: 'interactive' };
    case 'predict':
      return { scene: lesson.predict, mode: 'static' };
    case 'verify':
      return { scene: lesson.predict, mode: 'demo' };
    case 'discover':
      return { scene: lesson.predict, mode: 'revealed' };
    case 'apply':
    case 'complete': {
      if (s.solved) return { scene: lesson.apply, mode: 'revealed' };
      const level = hintLevel(s);
      // 힌트 2: 직접 눌러 보기 / 힌트 3: 같이 세는 시범
      return { scene: lesson.apply, mode: level >= 3 ? 'demo' : level >= 2 ? 'interactive' : 'static' };
    }
  }
}

export default function LessonScreen({ lessonId, onExit }: { lessonId: LessonId; onExit: () => void }) {
  const { t, formatNumber } = useI18n();
  const lesson = getLesson(lessonId);
  const [state, dispatch] = useReducer(lessonReducer, initialLessonState);
  const k = (part: Parameters<typeof lessonKey>[1]) => lessonKey(lessonId, part);
  const vars = (scene: MathScene) => sceneVars(scene, formatNumber);

  const predictAnswer = answerOf(lesson.predict);
  const applyAnswer = answerOf(lesson.apply);
  const level = hintLevel(state);

  // 안내 말풍선 문장
  const guide = (() => {
    switch (state.stage) {
      case 'observe':
        return t(k('observe'), vars(lesson.explore));
      case 'manipulate':
        return t(k(state.manipulated ? 'manipulateDone' : 'manipulate'), vars(lesson.explore));
      case 'predict':
        return t(k('predict'), vars(lesson.predict));
      case 'verify':
        if (!state.verified) return t('math.checking');
        return `${t(k('verify'), vars(lesson.predict))} ${t(state.guess === predictAnswer ? 'math.guessRight' : 'math.guessGood')}`;
      case 'discover':
        return t(k('discover'));
      case 'apply':
        if (state.solved) return t(k('correct'), vars(lesson.apply));
        if (level === 0) return t(k('apply'), vars(lesson.apply));
        return `${t('math.tryAgain')} ${t(k(`hint${level}`), vars(lesson.apply))}`;
      case 'complete':
        return t('math.completeTitle');
    }
  })();

  const field = fieldFor(lesson, state);
  // 장면이나 방식이 바뀌면 새로 그린다 (센 숫자 초기화)
  const fieldKey = `${state.stage}-${field.mode}`;
  const onFieldDone = state.stage === 'manipulate' ? () => dispatch({ type: 'manipulated' }) : state.stage === 'verify' ? () => dispatch({ type: 'verified' }) : undefined;

  const nextButton = (enabled: boolean, label = t('math.next')) => (
    <BigButton size="lg" className="w-full" disabled={!enabled} onClick={() => dispatch({ type: 'next' })}>
      {label}
      <ArrowRight size={28} strokeWidth={3} aria-hidden />
    </BigButton>
  );

  return (
    <AppShell background="bg-gradient-to-b from-mist/60 via-cream to-moss">
      <ScreenHeader title={t(k('title'))} onBack={onExit} />

      {state.stage === 'complete' ? (
        // 다 했을 때: 발견한 원리를 다시 보여준다 (보상은 Phase 4 에서 연결)
        <main className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
          <span className="text-7xl" aria-hidden>
            🌟
          </span>
          <h2 className="text-4xl font-bold">{t('math.completeTitle')}</h2>
          <section className="max-w-md rounded-3xl bg-cream p-5 shadow-pop-sm">
            <h3 className="mb-2 text-lg text-oak">{t('math.learned')}</h3>
            <p className="text-xl font-semibold">{t(k('discover'))}</p>
          </section>
          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            <BigButton variant="soft" onClick={() => dispatch({ type: 'restart' })}>
              <RotateCcw size={26} aria-hidden />
              {t('math.again')}
            </BigButton>
            <BigButton onClick={onExit}>
              <LayoutGrid size={26} aria-hidden />
              {t('math.moreGames')}
            </BigButton>
          </div>
        </main>
      ) : (
        <main className="flex flex-1 flex-col gap-4">
          <StageProgress stage={state.stage} />
          <GuideBubble text={guide} />

          <section className="flex min-h-[220px] flex-1 items-center justify-center rounded-[2rem] bg-cream/60 p-4">
            <SceneField key={fieldKey} scene={field.scene} mode={field.mode} onDone={onFieldDone} />
          </section>

          {/* 아래 버튼: 단계마다 다르다 */}
          <div>
            {state.stage === 'observe' && nextButton(true)}
            {state.stage === 'manipulate' && nextButton(state.manipulated)}
            {state.stage === 'predict' && (
              <ChoiceButtons choices={lesson.predictChoices} labels={lesson.predictLabels} onChoose={(answer) => dispatch({ type: 'guess', answer })} />
            )}
            {state.stage === 'verify' && nextButton(state.verified)}
            {state.stage === 'discover' && nextButton(true)}
            {state.stage === 'apply' && (
              <div className="flex flex-col gap-3">
                <ChoiceButtons
                  choices={lesson.applyChoices}
                  labels={lesson.applyLabels}
                  tried={state.wrong}
                  chosen={state.solved ? applyAnswer : null}
                  onChoose={(answer) => dispatch({ type: 'answer', answer, correct: applyAnswer })}
                />
                {state.solved && nextButton(true, t('math.finish'))}
              </div>
            )}
          </div>
        </main>
      )}
    </AppShell>
  );
}
