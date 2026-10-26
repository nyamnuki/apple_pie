import AppShell from '../../components/AppShell';
import ScreenHeader from '../../components/ScreenHeader';
import AssetIcon from '../../components/AssetIcon';
import { LESSONS, lessonKey } from '../../data/math/lessons';
import { MATH_ITEMS } from '../../data/math/items';
import { useI18n, type TranslationKey } from '../../i18n';
import { getRegion } from '../../data/regions/regions';
import RegionIcon from '../../components/RegionIcon';
import type { LessonId, MathArea } from '../../types/math';
import type { RegionId } from '../../types/resources';

const AREA_KEY: Record<MathArea, TranslationKey> = {
  counting: 'math.areas.counting',
  comparing: 'math.areas.comparing',
  addition: 'math.areas.addition',
  subtraction: 'math.areas.subtraction',
  patterns: 'math.areas.patterns',
  shapes: 'math.areas.shapes',
  skipCounting: 'math.areas.skipCounting',
  placeValue: 'math.areas.placeValue',
  measuring: 'math.areas.measuring',
  numberLine: 'math.areas.numberLine',
  evenOdd: 'math.areas.evenOdd',
};

interface Props {
  regionId: RegionId;
  onPick: (id: LessonId) => void;
  onBack: () => void;
}

// 수학 놀이 고르기 (고른 마을의 놀이만)
export default function MathMenuScreen({ regionId, onPick, onBack }: Props) {
  const { t, tKey } = useI18n();
  const region = getRegion(regionId);
  const lessons = LESSONS.filter((l) => l.region === regionId);
  return (
    <AppShell background="bg-gradient-to-b from-mist/60 via-cream to-moss">
      <ScreenHeader title={t('math.title')} onBack={onBack} />
      <p className="mb-1 text-lg font-semibold text-wood">
        <RegionIcon id={region.id} size={34} inline /> {tKey(region.nameKey)}
      </p>
      <p className="mb-4 text-xl">{t('math.chooseLesson')}</p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {lessons.map((lesson) => {
          const icon = MATH_ITEMS[lesson.icon];
          return (
            <li key={lesson.id}>
              <button
                type="button"
                onClick={() => onPick(lesson.id)}
                className="flex min-h-[88px] w-full items-center gap-4 rounded-3xl bg-cream px-4 py-3 text-left shadow-pop transition-transform active:translate-y-1 active:shadow-pop-sm"
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-apricot">
                  <AssetIcon path={icon.assetPath} emoji={icon.emoji} size={44} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-wood">{t(AREA_KEY[lesson.area])}</span>
                  <span className="block text-2xl font-bold leading-tight">{t(lessonKey(lesson.id, 'title'))}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
