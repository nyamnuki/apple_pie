import { useEffect, useRef, useState } from 'react';
import { Hammer, Lock, Sofa } from '../../components/icons';
import { lessonKey } from '../../data/math/lessons';
import { nextGoal } from './nextGoal';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import ScreenHeader from '../../components/ScreenHeader';
import AssetThumb from '../../components/AssetThumb';
import ResourceChip from '../../components/ResourceChip';
import Character from '../../components/characters/Character';
import GuideBubble from '../../components/GuideBubble';
import SpeakButton from '../../components/SpeakButton';
import { FURNITURE, getFurniture } from '../../data/furniture/furniture';
import { RESOURCES } from '../../data/resources/resources';
import { getRegion } from '../../data/regions/regions';
import { useGame } from '../../app/GameProvider';
import { bundleEntries, canAfford, lockedRegionOf } from '../../utils/bundles';
import { isRegionOpen } from '../../utils/regions';
import { useI18n } from '../../i18n';
import { useSound } from '../../services/audio/SoundProvider';

// 공방: 모은 재료로 레시피대로 가구를 만든다
export default function WorkshopScreen({ onBack, onDecorate }: { onBack: () => void; onDecorate: () => void }) {
  const { t, tKey, formatNumber } = useI18n();
  const { game, dispatch } = useGame();
  const { play } = useSound();
  const [made, setMade] = useState<string | null>(null); // 방금 만든 가구
  const recipes = FURNITURE.filter((f) => f.unlockCondition.type === 'recipe');
  // 지금 가진 재료 (열린 마을 재료는 0개여도 보여준다)
  const shownResources = RESOURCES.filter((r) => isRegionOpen(r.region, game.completedLessons) || (game.resources[r.id] ?? 0) > 0);

  const madeDef = made ? getFurniture(made) : undefined;
  const goal = nextGoal(game);
  // 아래쪽 레시피를 만들었어도 완성 안내가 보이게 화면 위로 데려간다
  const madeRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!made) return;
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    madeRef.current?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  }, [made]);

  return (
    <AppShell background="bg-gradient-to-b from-apricot/50 via-cream to-moss">
      <ScreenHeader title={t('workshop.title')} onBack={onBack} />

      {/* 방금 만든 가구 안내 */}
      {madeDef ? (
        <section ref={madeRef} aria-live="polite" className="storybook-card mb-4 scroll-mt-4 flex flex-col items-center gap-3 rounded-3xl p-5 text-center">
          {/* 도토가 망치질(폴짝) → 완성된 가구가 톡 커지며 둘레에 반짝 (소리와 같은 박자) */}
          <div key={made} className="flex items-end gap-2">
            <span className="animate-hop">
              <Character id="doto" expression="happy" size={88} />
            </span>
            <span className="relative">
              <span className="block animate-pop" style={{ animationDelay: '450ms' }}>
                <AssetThumb def={madeDef} size={96} />
              </span>
              {[
                [-8, -6],
                [86, 0],
                [-4, 80],
                [90, 76],
              ].map(([x, y], i) => (
                <svg key={i} viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" className="absolute animate-pulse" style={{ left: x, top: y, animationDelay: `${500 + i * 150}ms` }}>
                  <path d="M10 1 l2.4 6.2 l6.2 2.4 l-6.2 2.4 l-2.4 6.2 l-2.4 -6.2 l-6.2 -2.4 l6.2 -2.4 z" fill="#FFF0B8" stroke="#946539" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              ))}
            </span>
          </div>
          <p className="text-2xl font-bold">{t('workshop.made', { name: tKey(madeDef.nameKey) })}</p>
          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            <BigButton onClick={onDecorate}>
              <Sofa size={24} aria-hidden />
              {t('workshop.placeIt')}
            </BigButton>
            <BigButton variant="soft" onClick={() => setMade(null)}>
              {t('workshop.keepMaking')}
            </BigButton>
          </div>
        </section>
      ) : (
        <div className="mb-3">
          <GuideBubble speaker="doto" expression="cheer" text={t('workshop.intro')} />
        </div>
      )}

      {/* 가진 재료 */}
      <section aria-label={t('inventory.materials')} className="mb-4 flex flex-wrap gap-2">
        {shownResources.map((r) => (
          <ResourceChip key={r.id} id={r.id} amount={game.resources[r.id] ?? 0} />
        ))}
      </section>

      {/* 다음 목표: 곧 만들 수 있는 가구 하나와 모자란 재료, 그 재료를 주는 놀이 */}
      {goal && (
        <section aria-labelledby="goal-h" data-goal={goal.def.id} className="mb-4 flex items-center gap-3 rounded-3xl border-4 border-dashed border-oak/50 bg-cream/70 p-4">
          <AssetThumb def={goal.def} size={64} />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h2 id="goal-h" className="text-xl font-bold leading-tight">
              <span className="block text-base font-semibold text-wood">{t('workshop.goalTitle')}</span>
              {t('workshop.goal', { name: tKey(goal.def.nameKey) })}
            </h2>
            <div className="flex flex-wrap items-center gap-2" aria-label={t('workshop.stillNeed')}>
              <span className="text-base font-semibold">{t('workshop.stillNeed')}</span>
              {goal.missing.map(([id, n]) => (
                <ResourceChip key={id} id={id} amount={n} />
              ))}
            </div>
            {goal.from.length > 0 && <p className="text-base">{t('workshop.getFrom', { games: goal.from.map((l) => t(lessonKey(l.id, 'title'))).join(', ') })}</p>}
            {goal.daily && <p className="text-base">{t('workshop.getDaily')}</p>}
          </div>
        </section>
      )}

      {/* 레시피 목록 */}
      <ul className="grid gap-3 pb-4 sm:grid-cols-2">
        {recipes.map((def) => {
          if (def.unlockCondition.type !== 'recipe') return null;
          const { cost } = def.unlockCondition;
          const locked = lockedRegionOf(cost, game.completedLessons);
          const affordable = !locked && canAfford(game.resources, cost);
          const owned = game.furniture[def.id] ?? 0;
          return (
            <li key={def.id} className={`storybook-card flex flex-col gap-3 rounded-3xl p-4 ${locked ? 'opacity-80' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="relative">
                  <AssetThumb def={def} size={64} />
                  {locked && (
                    <span className="absolute -bottom-1 -right-1 rounded-full bg-bark p-1 text-cream">
                      <Lock size={16} aria-hidden />
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold leading-tight">{tKey(def.nameKey)}</p>
                  {owned > 0 && <p className="text-base text-bark/85">{t('workshop.youHave', { n: formatNumber(owned) })}</p>}
                </div>
                <SpeakButton text={tKey(def.nameKey)} />
              </div>

              <div className="flex flex-wrap gap-2" aria-label={t('workshop.needs')}>
                {bundleEntries(cost).map(([id, n]) => (
                  <ResourceChip key={id} id={id} amount={game.resources[id] ?? 0} need={n} />
                ))}
              </div>

              {locked ? (
                <p className="flex items-center gap-2 rounded-2xl bg-lavender/60 px-3 py-2 text-base font-semibold">
                  <Lock size={18} aria-hidden />
                  {t('workshop.lockedRegion', { region: tKey(getRegion(locked).nameKey) })}
                </p>
              ) : (
                <BigButton
                  disabled={!affordable}
                  onClick={() => {
                    dispatch({ type: 'craft', furnitureId: def.id });
                    setMade(def.id);
                    play.craft();
                  }}
                >
                  <Hammer size={24} aria-hidden />
                  {affordable ? t('workshop.make') : t('workshop.needMore')}
                </BigButton>
              )}
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
