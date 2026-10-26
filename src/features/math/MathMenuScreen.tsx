import { Check } from '../../components/icons';
import { useGame } from '../../app/GameProvider';
import AppShell from '../../components/AppShell';
import ScreenHeader from '../../components/ScreenHeader';
import AssetIcon from '../../components/AssetIcon';
import { LESSONS, lessonKey } from '../../data/math/lessons';
import { MATH_ITEMS } from '../../data/math/items';
import { useI18n, type TranslationKey } from '../../i18n';
import { getRegion } from '../../data/regions/regions';
import RegionIcon from '../../components/RegionIcon';
import GuideBubble from '../../components/GuideBubble';
import SpeakButton from '../../components/SpeakButton';
import { GUIDE_OF } from '../../data/regions/guides';
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
  clock: 'math.areas.clock',
  sharing: 'math.areas.sharing',
  doubling: 'math.areas.doubling',
  makingTen: 'math.areas.makingTen',
};

interface Props {
  regionId: RegionId;
  onPick: (id: LessonId) => void;
  onBack: () => void;
}

// 수학 놀이 고르기 (고른 마을의 놀이만)
export default function MathMenuScreen({ regionId, onPick, onBack }: Props) {
  const { t, tKey } = useI18n();
  const { game } = useGame();
  const region = getRegion(regionId);
  const lessons = LESSONS.filter((l) => l.region === regionId);
  return (
    <AppShell background="bg-gradient-to-b from-mist/60 via-cream to-moss">
      <ScreenHeader title={t('math.title')} onBack={onBack} />
      <p className="mb-1 text-lg font-semibold text-wood">
        <RegionIcon id={region.id} size={34} inline /> {tKey(region.nameKey)}
      </p>
      {/* 그 마을 안내 친구의 소개 (자동 읽기를 켜면 소리로도) */}
      <div className="mb-4">
        <GuideBubble compact speaker={GUIDE_OF[region.id]} expression="happy" text={`${t(`regions.intro.${region.id}`)} ${t('math.chooseLesson')}`} />
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {lessons.map((lesson) => {
          const icon = MATH_ITEMS[lesson.icon];
          return (
            <li key={lesson.id} className="relative">
              <button
                type="button"
                onClick={() => onPick(lesson.id)}
                className="flex min-h-[88px] w-full items-center gap-4 rounded-3xl bg-cream py-3 pl-4 pr-16 text-left shadow-pop transition-transform active:translate-y-1 active:shadow-pop-sm"
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-apricot">
                  <AssetIcon path={icon.assetPath} emoji={icon.emoji} size={44} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-wood">{t(AREA_KEY[lesson.area])}</span>
                  <span className="block text-2xl font-bold leading-tight">{t(lessonKey(lesson.id, 'title'))}</span>
                  {/* 해 본 놀이: 체크, '해 보기'를 한 번에 맞힌 적이 있으면 별 (글자와 모양으로 표시) */}
                  {game.completedLessons.includes(lesson.id) && (
                    <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <Check size={16} strokeWidth={3} aria-hidden />
                        {t('math.played')}
                      </span>
                      {(game.lessonStats[lesson.id]?.firstTry ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1" data-star={lesson.id}>
                          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                            <path d="M10 1.8 l2.5 5.2 l5.7 .7 l-4.2 3.9 l1.1 5.6 l-5.1 -2.8 l-5.1 2.8 l1.1 -5.6 l-4.2 -3.9 l5.7 -.7 z" fill="#F2C84B" stroke="#6B5444" strokeWidth="1.4" strokeLinejoin="round" />
                          </svg>
                          {t('math.firstTryStar')}
                        </span>
                      )}
                    </span>
                  )}
                </span>
              </button>
              {/* 놀이 이름 듣기 (카드 버튼 밖, 오른쪽 위) */}
              <SpeakButton text={t(lessonKey(lesson.id, 'title'))} className="absolute right-2 top-2" />
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
