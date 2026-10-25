import { useState } from 'react';
import { Hammer, Lock, Sofa } from 'lucide-react';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import ScreenHeader from '../../components/ScreenHeader';
import AssetThumb from '../../components/AssetThumb';
import ResourceChip from '../../components/ResourceChip';
import Character from '../../components/characters/Character';
import GuideBubble from '../../components/GuideBubble';
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

  return (
    <AppShell background="bg-gradient-to-b from-apricot/50 via-cream to-moss">
      <ScreenHeader title={t('workshop.title')} onBack={onBack} />

      {/* 방금 만든 가구 안내 */}
      {madeDef ? (
        <section aria-live="polite" className="mb-4 flex flex-col items-center gap-3 rounded-3xl bg-cream p-5 text-center shadow-pop-sm">
          <div className="flex items-end gap-2">
            <Character id="doto" expression="happy" size={88} />
            <AssetThumb def={madeDef} size={88} />
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

      {/* 레시피 목록 */}
      <ul className="grid gap-3 pb-4 sm:grid-cols-2">
        {recipes.map((def) => {
          if (def.unlockCondition.type !== 'recipe') return null;
          const { cost } = def.unlockCondition;
          const locked = lockedRegionOf(cost, game.completedLessons);
          const affordable = !locked && canAfford(game.resources, cost);
          const owned = game.furniture[def.id] ?? 0;
          return (
            <li key={def.id} className={`flex flex-col gap-3 rounded-3xl bg-cream p-4 shadow-pop-sm ${locked ? 'opacity-80' : ''}`}>
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
