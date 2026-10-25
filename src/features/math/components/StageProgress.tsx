import { STAGES, type Stage } from '../lessonFlow';
import { useI18n, type TranslationKey } from '../../../i18n';

const STAGE_KEY: Record<(typeof STAGES)[number], TranslationKey> = {
  observe: 'math.stages.observe',
  manipulate: 'math.stages.manipulate',
  predict: 'math.stages.predict',
  verify: 'math.stages.verify',
  discover: 'math.stages.discover',
  apply: 'math.stages.apply',
};

// 잎사귀 하나 (지난 단계: 초록으로 칠함 / 지금: 크게 칠하고 테두리 / 남은 단계: 빈 잎 테두리만)
function LeafStep({ state }: { state: 'done' | 'now' | 'todo' }) {
  const size = state === 'now' ? 26 : 18;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="transition-all">
      <path
        d="M3 21 C3 10 10 3 21 3 C21 14 14 21 3 21 Z"
        fill={state === 'todo' ? 'none' : state === 'now' ? '#7FA077' : '#A8C3A0'}
        stroke={state === 'todo' ? 'rgb(89 72 60 / 0.35)' : '#6B5444'}
        strokeWidth={state === 'now' ? 2 : 1.6}
        strokeLinejoin="round"
      />
      {state !== 'todo' && <path d="M5 19 C9 15 13 11 18 6" fill="none" stroke="#FFF5DF" strokeWidth="1.4" strokeLinecap="round" />}
    </svg>
  );
}

// 6단계 중 지금 어디인지: 잎사귀 줄기(지난 단계는 칠함, 모양 크기로도 구분) + 단계 이름 글자
export default function StageProgress({ stage }: { stage: Stage }) {
  const { t, formatNumber } = useI18n();
  if (stage === 'complete') return null;
  const index = STAGES.indexOf(stage);
  return (
    <div className="flex items-center gap-3">
      <ol className="flex items-center gap-1" aria-hidden="true">
        {STAGES.map((s, i) => (
          <li key={s} className="flex">
            <LeafStep state={i < index ? 'done' : i === index ? 'now' : 'todo'} />
          </li>
        ))}
      </ol>
      <span className="text-lg font-semibold">
        {t('math.stepOf', { n: formatNumber(index + 1), total: formatNumber(STAGES.length), name: t(STAGE_KEY[stage]) })}
      </span>
    </div>
  );
}
