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

// 6단계 중 지금 어디인지: 점(지난 단계는 채움) + 단계 이름 글자
export default function StageProgress({ stage }: { stage: Stage }) {
  const { t, formatNumber } = useI18n();
  if (stage === 'complete') return null;
  const index = STAGES.indexOf(stage);
  return (
    <div className="flex items-center gap-3">
      <ol className="flex gap-1.5" aria-hidden="true">
        {STAGES.map((s, i) => (
          <li key={s} className={`h-3 rounded-full transition-all ${i < index ? 'w-3 bg-wood' : i === index ? 'w-8 bg-wood' : 'w-3 bg-bark/15'}`} />
        ))}
      </ol>
      <span className="text-lg font-semibold">
        {t('math.stepOf', { n: formatNumber(index + 1), total: formatNumber(STAGES.length), name: t(STAGE_KEY[stage]) })}
      </span>
    </div>
  );
}
