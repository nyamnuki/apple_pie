import { useState } from 'react';
import AppShell from '../../components/AppShell';
import ScreenHeader from '../../components/ScreenHeader';
import RegionIcon from '../../components/RegionIcon';
import { ItemArt } from '../../components/art/itemArt';
import { STICKERS } from '../../data/stickers/stickers';
import { REGIONS } from '../../data/regions/regions';
import { useGame } from '../../app/GameProvider';
import { useI18n } from '../../i18n';
import { nextPetGoal } from '../pets/pets';
import Closet from '../outfits/Closet';
import StickerCloseUp from './StickerCloseUp';

// 스티커 도감: 마을마다 6칸. 모은 스티커는 그림과 이름, 아직 없는 칸은 점선 테두리와 '?' (색만으로 구분하지 않음)
export default function StickerBookScreen({ onBack }: { onBack: () => void }) {
  const { t, tKey, formatNumber } = useI18n();
  const { game } = useGame();
  const owned = new Set(game.stickers);
  const goal = nextPetGoal(owned.size);
  // 크게 보기: 모은 스티커(도감 순서) 중 몇 번째인지. 닫으면 그 스티커 버튼으로 초점을 돌린다
  const ownedList = STICKERS.filter((s) => owned.has(s.id));
  const [open, setOpen] = useState<number | null>(null);
  const close = () => {
    const id = open === null ? null : ownedList[open]?.id;
    setOpen(null);
    if (id) requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-sticker="${id}"] button`)?.focus());
  };

  return (
    <AppShell background="bg-gradient-to-b from-apricot/40 via-cream to-moss">
      <ScreenHeader title={t('stickers.title')} onBack={onBack} />
      <p className="mb-1 text-lg">{t('stickers.intro', { n: formatNumber(owned.size), total: formatNumber(STICKERS.length) })}</p>
      {game.dailyDone.length > 0 && <p className="mb-1 text-base font-semibold">{t('stickers.stamps', { n: formatNumber(game.dailyDone.length) })}</p>}
      {goal && <p className="mb-3 text-base font-semibold text-wood">{t('stickers.petGoal', { n: formatNumber(goal.stickers - owned.size) })}</p>}
      <Closet />
      <div className="flex flex-col gap-4 pb-4">
        {REGIONS.map((region) => {
          const list = STICKERS.filter((s) => s.region === region.id);
          return (
            <section key={region.id} aria-labelledby={`stickers-${region.id}`} className="storybook-card rounded-[2rem] p-4">
              <h2 id={`stickers-${region.id}`} className="mb-3 flex items-center gap-2 text-xl font-bold">
                <RegionIcon id={region.id} size={30} />
                {tKey(region.nameKey)}
                <span className="ml-auto text-base font-semibold">
                  {formatNumber(list.filter((s) => owned.has(s.id)).length)}/{formatNumber(list.length)}
                </span>
              </h2>
              <ul className="grid grid-cols-3 gap-3">
                {list.map((s) => {
                  const has = owned.has(s.id);
                  return (
                    <li
                      key={s.id}
                      data-sticker={s.id}
                      data-owned={has}
                      aria-label={has ? tKey(s.nameKey) : t('stickers.missing')}
                      className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-3xl p-1 text-center ${has ? 'rotate-[-2deg] bg-white shadow-pop-sm ring-4 ring-white' : 'border-4 border-dashed border-bark/25'}`}
                    >
                      {has ? (
                        // 누르면 크게 보기
                        <button
                          type="button"
                          aria-label={t('stickers.look', { name: tKey(s.nameKey) })}
                          onClick={() => setOpen(ownedList.findIndex((o) => o.id === s.id))}
                          className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-3xl"
                        >
                          <ItemArt path={s.art} size={56} />
                          <span className="text-sm font-semibold leading-tight">{tKey(s.nameKey)}</span>
                        </button>
                      ) : (
                        <span aria-hidden="true" className="text-3xl font-bold text-bark/40">
                          ?
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
      {open !== null && ownedList[open] && <StickerCloseUp list={ownedList} index={open} onIndex={setOpen} onClose={close} />}
    </AppShell>
  );
}
