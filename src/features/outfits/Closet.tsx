import Character from '../../components/characters/Character';
import { Lock } from '../../components/icons';
import { useGame } from '../../app/GameProvider';
import { useI18n, type TranslationKey } from '../../i18n';
import { useSound } from '../../services/audio/SoundProvider';
import OutfitArt, { OUTFIT_VIEWBOX } from './OutfitArt';
import { OUTFITS, isUnlocked, nextOutfit, type OutfitSlot } from './outfits';

const SLOT_TITLE: Record<OutfitSlot, TranslationKey> = { hat: 'outfits.hats', scarf: 'outfits.scarves' };

// 루루 옷장 (스티커 도감 맨 위): 왼쪽에 지금 모습, 오른쪽에 모자·스카프 고르기.
// 아직 안 열린 옷은 자물쇠와 '스티커 ○장' (색만으로 구분하지 않음), 누를 수 없다.
export default function Closet() {
  const { t, tKey, formatNumber } = useI18n();
  const { game, dispatch } = useGame();
  const { play } = useSound();
  const count = game.stickers.length;
  const next = nextOutfit(count);

  return (
    <section aria-labelledby="closet-title" className="storybook-card mb-4 flex flex-col items-center gap-3 rounded-[2rem] p-4 sm:flex-row sm:items-start">
      <div className="flex flex-col items-center">
        <h2 id="closet-title" className="text-xl font-bold">
          {t('outfits.title')}
        </h2>
        <Character expression="happy" size={120} />
      </div>
      <div className="flex w-full min-w-0 flex-1 flex-col gap-3">
        <p className="text-base font-semibold">{next ? t('outfits.next', { n: formatNumber(next.stickers - count) }) : t('outfits.intro')}</p>
        {(['hat', 'scarf'] as const).map((slot) => {
          const worn = game.outfit[slot];
          const options = OUTFITS.filter((o) => o.slot === slot);
          const wear = (id: (typeof options)[number]['id'] | null) => {
            if (worn === id) return;
            play.place();
            dispatch({ type: 'wear', slot, id });
          };
          return (
            <div key={slot} role="radiogroup" aria-label={t(SLOT_TITLE[slot])} className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">{t(SLOT_TITLE[slot])}</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  role="radio"
                  aria-checked={worn === null}
                  onClick={() => wear(null)}
                  className={`selectable flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-cream p-1 text-sm font-bold shadow-pop-sm ring-4 ${worn === null ? 'ring-wood' : 'ring-transparent'}`}
                >
                  {t('outfits.none')}
                </button>
                {options.map((o) => {
                  const open = isUnlocked(o, count);
                  const name = tKey(`outfits.${o.id}`);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      role="radio"
                      data-outfit={o.id}
                      aria-checked={worn === o.id}
                      aria-disabled={!open}
                      aria-label={open ? name : t('outfits.lockedLabel', { name, n: formatNumber(o.stickers) })}
                      onClick={() => (open ? wear(o.id) : play.nope())}
                      className={`selectable flex h-[72px] w-[72px] flex-col items-center justify-center rounded-2xl p-1 ring-4 ${
                        open ? `bg-white shadow-pop-sm ${worn === o.id ? 'ring-wood' : 'ring-transparent'}` : 'border-4 border-dashed border-bark/25 ring-transparent'
                      }`}
                    >
                      {open ? (
                        <svg viewBox={OUTFIT_VIEWBOX[o.id]} width="58" height="52" aria-hidden="true" className="overflow-visible">
                          <g filter="url(#wc-small)">
                            <OutfitArt id={o.id} />
                          </g>
                        </svg>
                      ) : (
                        <>
                          <Lock size={24} aria-hidden className="text-bark/50" />
                          <span aria-hidden="true" className="text-xs font-bold leading-tight text-bark/70">
                            {t('outfits.needs', { n: formatNumber(o.stickers) })}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
