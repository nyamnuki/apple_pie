import { Lock, ChevronRight } from 'lucide-react';
import AppShell from '../../components/AppShell';
import ScreenHeader from '../../components/ScreenHeader';
import { REGIONS, getRegion } from '../../data/regions/regions';
import { useGame } from '../../app/GameProvider';
import { isRegionOpen, regionProgress } from '../../utils/regions';
import { useI18n } from '../../i18n';
import type { RegionId } from '../../types/resources';

// 마을마다 카드 색 (도토리 마을: 낮의 숲, 달빛 숲: 밤의 숲)
const CARD_STYLE: Record<RegionId, string> = {
  acornVillage: 'bg-moss',
  moonlightForest: 'bg-lavender',
};

// 마을 지도: 가고 싶은 마을을 고른다. 잠긴 마을은 열리는 조건과 진행 정도를 보여준다.
export default function RegionMapScreen({ onPick, onBack }: { onPick: (id: RegionId) => void; onBack: () => void }) {
  const { t, tKey, formatNumber } = useI18n();
  const { game } = useGame();
  // 지도는 아래(처음 마을)에서 위(다음 마을)로 올라간다
  const regions = [...REGIONS].reverse();

  return (
    <AppShell background="bg-gradient-to-b from-lavender/70 via-mist/60 to-moss">
      <ScreenHeader title={t('map.title')} onBack={onBack} />
      <p className="mb-4 text-xl">{t('map.intro')}</p>

      <ol className="flex flex-1 flex-col justify-center [@media(max-height:500px)]:flex-row-reverse [@media(max-height:500px)]:items-center">
        {regions.map((region, index) => {
          const open = isRegionOpen(region.id, game.completedLessons);
          const { done, total } = regionProgress(region.id, game.completedLessons);
          const unlock = region.unlock;
          const need = unlock.type === 'lessons' ? regionProgress(unlock.region, game.completedLessons).done : 0;
          return (
            <li key={region.id} className="flex flex-col items-stretch [@media(max-height:500px)]:flex-1 [@media(max-height:500px)]:flex-row-reverse [@media(max-height:500px)]:items-center">
              {/* 마을 사이를 잇는 점선 길 (첫 카드 위에는 없음) */}
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="mx-auto h-14 border-l-[6px] border-dotted border-wood/40 [@media(max-height:500px)]:h-0 [@media(max-height:500px)]:w-10 [@media(max-height:500px)]:border-l-0 [@media(max-height:500px)]:border-t-[6px]"
                />
              )}
              <button
                type="button"
                disabled={!open}
                onClick={() => onPick(region.id)}
                // 잠긴 마을: 투명하게 하지 않고 점선 테두리로 구분 (글자가 흐려지지 않게)
                className={`flex min-h-[112px] w-full items-center gap-4 rounded-[2rem] border-4 p-4 text-left transition-transform ${CARD_STYLE[region.id]} ${
                  open ? 'border-transparent shadow-pop active:translate-y-1 active:shadow-pop-sm' : 'border-dashed border-bark/30'
                }`}
              >
                <span className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-cream text-5xl" aria-hidden="true">
                  <span className={open ? '' : 'opacity-60 grayscale'}>{region.emoji}</span>
                  {!open && (
                    <span className="absolute -bottom-1 -right-1 rounded-full bg-bark p-1.5 text-cream">
                      <Lock size={18} />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-2xl font-bold leading-tight">{tKey(region.nameKey)}</span>
                  <span className="block text-base">{tKey(region.topicsKey)}</span>
                  {open ? (
                    <span className="mt-1 block text-base font-semibold text-wood">{t('map.gamesDone', { n: formatNumber(done), total: formatNumber(total) })}</span>
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
