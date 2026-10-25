import { useReducer, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import ScreenHeader from '../../components/ScreenHeader';
import GuideBubble from './components/GuideBubble';
import StageProgress from './components/StageProgress';
import ChoiceButtons from './components/ChoiceButtons';
import SceneField from './fields/SceneField';
import RewardPanel from '../rewards/RewardPanel';
import { useGame } from '../../app/GameProvider';
import { rewardFor } from '../../app/gameState';
import type { FieldMode } from './fields/useSequence';
import { hintLevel, initialLessonState, lessonReducer, type LessonState } from './lessonFlow';
import { answerOf, sceneVars } from './answers';
import { getLesson, lessonKey } from '../../data/math/lessons';
import { useI18n } from '../../i18n';
import type { LessonId, MathLesson, MathScene } from '../../types/math';
import type { ResourceBundle } from '../../types/resources';
import type { Expression } from '../../data/characters/characters';

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

interface Props {
  lessonId: LessonId;
  onExit: () => void;
  onWorkshop: () => void;
}

export default function LessonScreen({ lessonId, onExit, onWorkshop }: Props) {
  const { t, formatNumber } = useI18n();
  const lesson = getLesson(lessonId);
  const [state, dispatch] = useReducer(lessonReducer, initialLessonState);
  const { game, dispatch: gameDispatch } = useGame();
  // 이번에 받은 보상 (보상 화면에 보여준다)
  const [earned, setEarned] = useState<{ rewards: ResourceBundle; bonus: ResourceBundle } | null>(null);

  // 끝내기: 보상을 계산해 지급하고 보상 화면으로
  const finish = () => {
    setEarned(rewardFor(lesson, game));
    gameDispatch({ type: 'completeLesson', lesson });
    dispatch({ type: 'next' });
  };
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

  // 루루의 표정: 예상할 땐 생각 중, 틀렸을 땐 응원, 맞혔을 땐 기쁨, 예상과 다르면 '와!' 놀람
  const expression: Expression = (() => {
    switch (state.stage) {
      case 'manipulate':
        return state.manipulated ? 'happy' : 'cheer';
      case 'predict':
        return 'thinking';
      case 'verify':
        if (!state.verified) return 'thinking';
        return state.guess === predictAnswer ? 'happy' : 'surprised';
      case 'discover':
        return 'happy';
      case 'apply':
        return state.solved ? 'happy' : level > 0 ? 'cheer' : 'default';
      default:
        return 'default';
    }
  })();

  const field = fieldFor(lesson, state);
  // 장면이나 방식이 바뀌면 새로 그린다 (센 숫자 초기화)
  const fieldKey = `${state.stage}-${field.mode}`;
  const onFieldDone = state.stage === 'manipulate' ? () => dispatch({ type: 'manipulated' }) : state.stage === 'verify' ? () => dispatch({ type: 'verified' }) : undefined;

  const nextButton = (enabled: boolean) => (
    <BigButton size="lg" className="w-full" disabled={!enabled} onClick={() => dispatch({ type: 'next' })}>
      {t('math.next')}
      <ArrowRight size={28} strokeWidth={3} aria-hidden />
    </BigButton>
  );

  return (
    <AppShell background="bg-gradient-to-b from-mist/60 via-cream to-moss">
      <ScreenHeader title={t(k('title'))} onBack={onExit} />

      {state.stage === 'complete' && earned ? (
        <RewardPanel
          rewards={earned.rewards}
          bonus={earned.bonus}
          discovery={t(k('discover'))}
          onWorkshop={onWorkshop}
          onAgain={() => dispatch({ type: 'restart' })}
          onMoreGames={onExit}
        />
      ) : (
        // 세로 화면: 단계 → 말풍선 → 장면 → 버튼 (위에서 아래로)
        // 높이가 낮은 가로 화면: 왼쪽에 장면, 오른쪽에 단계·말풍선·버튼
        <main className="grid flex-1 grid-rows-[auto_auto_1fr_auto] gap-4 [grid-template-areas:'progress'_'guide'_'field'_'controls'] [@media(max-height:500px)]:grid-cols-2 [@media(max-height:500px)]:grid-rows-[auto_1fr_auto] [@media(max-height:500px)]:gap-3 [@media(max-height:500px)]:[grid-template-areas:'field_progress'_'field_guide'_'field_controls']">
          <div className="[grid-area:progress]">
            <StageProgress stage={state.stage} />
          </div>
          <div className="[grid-area:guide]">
            <GuideBubble text={guide} expression={expression} />
          </div>

          <section className="flex min-h-[220px] items-center justify-center overflow-auto rounded-[2rem] bg-cream/60 p-4 [grid-area:field] [@media(max-height:500px)]:min-h-0">
            <SceneField key={fieldKey} scene={field.scene} mode={field.mode} onDone={onFieldDone} />
          </section>

          {/* 아래 버튼: 단계마다 다르다 */}
          <div className="[grid-area:controls]">
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
                {state.solved && (
                  <BigButton size="lg" className="w-full" onClick={finish}>
                    {t('math.finish')}
                    <ArrowRight size={28} strokeWidth={3} aria-hidden />
                  </BigButton>
                )}
              </div>
            )}
          </div>
        </main>
      )}
    </AppShell>
  );
}
