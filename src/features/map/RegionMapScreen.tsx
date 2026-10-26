import { Lock, ChevronRight, Check, Question } from '../../components/icons';
import AppShell from '../../components/AppShell';
import ScreenHeader from '../../components/ScreenHeader';
import { REGIONS, getRegion } from '../../data/regions/regions';
import { useGame } from '../../app/GameProvider';
import { isRegionOpen, regionProgress } from '../../utils/regions';
import Rosette from '../../components/art/Rosette';
import { useI18n } from '../../i18n';
import RegionLandmark from '../../components/art/RegionLandmark';
import { dateKey, streak } from '../daily/daily';
import type { RegionId } from '../../types/resources';

// 마을마다 카드 색 (도토리 마을: 낮의 숲, 달빛 숲: 밤의 숲, 수정 동굴: 푸른 동굴)
const CARD_STYLE: Record<RegionId, string> = {
  acornVillage: 'bg-moss',
  moonlightForest: 'bg-lavender',
  crystalCave: 'bg-mist',
  sunnyMeadow: 'bg-apricot',
  windyHill: 'bg-petal',
  rainbowLake: 'bg-mist',
};

// 마을 사이 오솔길: 세로 화면은 위아래로, 높이가 낮은 가로 화면은 옆으로 구불구불
function Trail() {
  const steps = [0.18, 0.42, 0.66, 0.88];
  return (
    <span aria-hidden="true" className="mx-auto block h-16 w-16 [@media(max-height:500px)]:h-16 [@media(max-height:500px)]:w-12 [@media(max-height:500px)]:-rotate-90">
      <svg viewBox="0 0 40 64" className="h-full w-full overflow-visible">
        <path d="M20 0 C4 16 36 28 20 40 C8 50 28 58 20 64" fill="none" stroke="#F1DDBC" strokeWidth="12" strokeLinecap="round" />
        <path d="M20 0 C4 16 36 28 20 40 C8 50 28 58 20 64" fill="none" stroke="#B9855A" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
        {/* 작은 발자국 */}
        {steps.map((t, i) => (
          <ellipse key={t} cx={i % 2 ? 24 : 16} cy={t * 64} rx="2.2" ry="3" fill="#946539" opacity="0.45" />
        ))}
      </svg>
    </span>
  );
}

// 마을 지도: 가고 싶은 마을을 고른다. 잠긴 마을은 열리는 조건과 진행 정도를 보여준다.
export default function RegionMapScreen({ onPick, onBack, onDaily }: { onPick: (id: RegionId) => void; onBack: () => void; onDaily?: () => void }) {
  const { t, tKey, formatNumber } = useI18n();
  const { game } = useGame();
  // 지도는 아래(처음 마을)에서 위(다음 마을)로 올라간다
  const regions = [...REGIONS].reverse();
  const doneToday = game.dailyDone.includes(dateKey(new Date()));
  const days = streak(game.dailyDone, new Date()); // 연속으로 푼 날 (2일부터 보여 준다)

  return (
    <AppShell background="bg-gradient-to-b from-lavender/70 via-mist/60 to-moss">
      <ScreenHeader title={t('map.title')} onBack={onBack} />
      <p className="mb-4 text-xl">{t('map.intro')}</p>

      {/* 오늘의 문제: 끝낸 놀이가 있으면. 오늘 이미 풀었으면 도장 표시 */}
      {onDaily && game.completedLessons.length > 0 && (
        <button
          type="button"
          onClick={onDaily}
          className="mb-4 flex min-h-[72px] w-full items-center gap-3 rounded-[2rem] border-2 border-bark/10 bg-cream px-4 py-3 text-left shadow-pop active:translate-y-1 active:shadow-pop-sm"
        >
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 ${doneToday ? 'rotate-[-8deg] border-wood text-wood' : 'border-dashed border-bark/40 text-bark/60'}`} aria-hidden="true">
            {doneToday ? <Check size={24} strokeWidth={3} /> : <Question size={24} />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xl font-bold">{t('daily.title')}</span>
            <span className="block text-base">{t(doneToday ? 'daily.doneToday' : 'daily.waiting')}</span>
            {days >= 2 && <span className="mt-0.5 block text-base font-bold text-wood">{t('daily.streak', { n: formatNumber(days) })}</span>}
          </span>
          <ChevronRight size={28} aria-hidden className="shrink-0" />
        </button>
      )}

      <ol className="flex flex-1 flex-col justify-center [@media(max-height:500px)]:flex-row-reverse [@media(max-height:500px)]:items-center">
        {regions.map((region, index) => {
          const open = isRegionOpen(region.id, game.completedLessons);
          const { done, total } = regionProgress(region.id, game.completedLessons);
          const unlock = region.unlock;
          const need = unlock.type === 'lessons' ? regionProgress(unlock.region, game.completedLessons).done : 0;
          return (
            <li key={region.id} className="flex flex-col items-stretch [@media(max-height:500px)]:flex-1 [@media(max-height:500px)]:flex-row-reverse [@media(max-height:500px)]:items-center">
              {/* 마을 사이를 잇는 구불구불한 오솔길과 발자국 (첫 카드 위에는 없음) */}
              {index > 0 && <Trail />}
              <button
                type="button"
                disabled={!open}
                onClick={() => onPick(region.id)}
                // 잠긴 마을: 투명하게 하지 않고 점선 테두리로 구분 (글자가 흐려지지 않게)
                className={`flex min-h-[112px] w-full items-center gap-3 rounded-[2rem] border-4 p-3 text-left min-[360px]:gap-4 min-[360px]:p-4 transition-transform [@media(max-height:500px)]:flex-col [@media(max-height:500px)]:items-start [@media(max-height:500px)]:gap-1 [@media(max-height:500px)]:p-3 ${CARD_STYLE[region.id]} ${
                  open ? 'border-transparent shadow-pop active:translate-y-1 active:shadow-pop-sm' : 'border-dashed border-bark/30'
                }`}
              >
                <span className="relative h-[3.6rem] w-20 shrink-0 overflow-visible rounded-[22px] min-[360px]:h-[4.4rem] min-[360px]:w-24 min-[400px]:h-[5.5rem] min-[400px]:w-32 [@media(max-height:500px)]:!h-16 [@media(max-height:500px)]:!w-24 shadow-[inset_0_0_0_2px_rgb(89_72_60/0.12)]" aria-hidden="true">
                  <RegionLandmark id={region.id} locked={!open} />
                  {/* 놀이를 모두 끝낸 마을: 모서리에 리본 */}
                  {open && done === total && (
                    <span className="absolute -right-3 -top-3" data-complete={region.id}>
                      <Rosette size={34} />
                    </span>
                  )}
                  {!open && (
                    <span className="absolute -bottom-1 -right-1 rounded-full bg-bark p-1.5 text-cream">
                      <Lock size={18} />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xl font-bold leading-tight min-[360px]:text-2xl">{tKey(region.nameKey)}</span>
                  <span className="block text-base">{tKey(region.topicsKey)}</span>
                  {open ? (
                    <span className="mt-1 block text-base font-bold">
                      {done === total ? t('map.complete') : t('map.gamesDone', { n: formatNumber(done), total: formatNumber(total) })}
                    </span>
                  ) : (
                    unlock.type === 'lessons' && (
                      <span className="mt-1 block text-base font-semibold">
                        {t('map.locked', { count: formatNumber(unlock.count), region: tKey(getRegion(unlock.region).nameKey) })}{' '}
                        ({formatNumber(need)}/{formatNumber(unlock.count)})
                      </span>
                    )
                  )}
                </span>
                {open && <ChevronRight size={32} aria-hidden className="shrink-0" />}
              </button>
            </li>
          );
        })}
      </ol>
    </AppShell>
  );
}
