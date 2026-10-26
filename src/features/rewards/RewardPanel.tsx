import { Hammer, LayoutGrid, RotateCcw, Backpack } from '../../components/icons';
import BigButton from '../../components/BigButton';
import ResourceChip from '../../components/ResourceChip';
import Character from '../../components/characters/Character';
import { bundleEntries } from '../../utils/bundles';
import { getRegion } from '../../data/regions/regions';
import RegionIcon from '../../components/RegionIcon';
import { useI18n, type TranslationKey } from '../../i18n';
import type { CharacterId } from '../../data/characters/characters';
import { ItemArt } from '../../components/art/itemArt';
import { getSticker } from '../../data/stickers/stickers';
import PetArt from '../pets/PetArt';
import Rosette from '../../components/art/Rosette';
import { PETS, type PetId } from '../pets/pets';
import type { RegionId, ResourceBundle } from '../../types/resources';

interface Props {
  rewards: ResourceBundle;
  bonus: ResourceBundle; // 처음 끝냈을 때 보너스 (없으면 빈 묶음)
  discovery: string; // 이번 놀이에서 발견한 원리
  newRegion?: RegionId | null; // 이번에 새로 열린 마을
  sticker?: string | null; // 이번에 받은 스티커
  guide?: CharacterId; // 칭찬해 주는 친구 (그 마을 안내 친구)
  praise?: number; // 칭찬 말 번호 (판마다 달라진다)
  newPet?: PetId | null; // 이번에 방에 찾아온 친구
  completedRegion?: RegionId | null; // 이번에 놀이를 모두 끝낸 마을 (처음일 때만)
  onWorkshop: () => void;
  onAgain: () => void;
  onMoreGames: () => void;
}

const PRAISE: TranslationKey[] = ['reward.praise1', 'reward.praise2', 'reward.praise3', 'reward.praise4', 'reward.praise5'];

// 보상 화면: 받은 재료를 크게 보여주고, 발견한 원리를 다시 짚어 준다. (화려한 효과는 쓰지 않는다)
export default function RewardPanel({ rewards, bonus, discovery, newRegion, sticker, newPet, completedRegion, guide = 'lulu', praise = 0, onWorkshop, onAgain, onMoreGames }: Props) {
  const { t, tKey } = useI18n();
  const bonusEntries = bundleEntries(bonus);
  const stickerDef = sticker ? getSticker(sticker) : undefined;
  const petDef = newPet ? PETS.find((p) => p.id === newPet) : undefined;

  return (
    // 세로 화면: 위에서 아래로 / 높이가 낮은 가로 화면: 왼쪽 받은 재료, 오른쪽 발견한 것과 버튼
    <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center [@media(max-height:500px)]:grid [@media(max-height:500px)]:grid-cols-2 [@media(max-height:500px)]:items-start [@media(max-height:500px)]:gap-4">
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="animate-hop">
            <Character id={guide} expression="cheer" size={96} bob />
          </span>
          <div className="text-left">
            <h2 className="text-3xl font-bold sm:text-4xl [@media(max-height:500px)]:text-2xl">{t('reward.title')}</h2>
            {/* 판마다 다른 칭찬 한마디 */}
            <p className="text-lg font-semibold text-wood">{t(PRAISE[praise % PRAISE.length])}</p>
          </div>
        </div>

        <section aria-labelledby="reward-got" className="storybook-card w-full max-w-md rounded-3xl p-5">
          <h3 id="reward-got" className="mb-3 flex items-center justify-center gap-2 text-xl font-semibold">
            {t('reward.youGot')}
            {/* 재료가 다 나타난 뒤 가방이 한 번 통통 (가방에 들어갔다는 느낌) */}
            <span className="inline-flex animate-hop text-wood" style={{ animationDelay: `${(bundleEntries(rewards).length + 1) * 150 + 200}ms` }} aria-hidden="true">
              <Backpack size={26} />
            </span>
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {bundleEntries(rewards).map(([id, n], i) => (
              <span key={id} className="animate-rise" style={{ animationDelay: `${i * 150}ms` }}>
                <ResourceChip id={id} amount={n} prefix="+" size="lg" />
              </span>
            ))}
          </div>
          {bonusEntries.length > 0 && (
            <div className="mt-4 animate-rise rounded-2xl border-4 border-dashed border-oak/50 p-3" style={{ animationDelay: '450ms' }}>
              <p className="mb-2 text-lg font-bold text-wood">{t('reward.firstTimeBonus')}</p>
              <div className="flex flex-wrap justify-center gap-3">
                {bonusEntries.map(([id, n]) => (
                  <ResourceChip key={id} id={id} amount={n} prefix="+" size="lg" />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 새 스티커: 살짝 기울어진 흰 테두리 스티커 */}
        {stickerDef && (
          <div role="status" className="flex w-full max-w-md animate-rise items-center gap-3 rounded-3xl bg-apricot/60 p-3" style={{ animationDelay: '500ms' }}>
            <span className="flex h-20 w-20 shrink-0 rotate-[-4deg] items-center justify-center rounded-3xl bg-white shadow-pop-sm ring-4 ring-white">
              <ItemArt path={stickerDef.art} size={60} />
            </span>
            <span className="text-left text-xl font-bold">{t('stickers.got', { name: tKey(stickerDef.nameKey) })}</span>
          </div>
        )}

        {petDef && (
          <div role="status" className="flex w-full max-w-md animate-rise items-center gap-3 rounded-3xl bg-moss p-3" style={{ animationDelay: '550ms' }}>
            <svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true" className="shrink-0 overflow-visible">
              <PetArt id={petDef.id} />
            </svg>
            <span className="text-left text-xl font-bold">{t('reward.newPet', { name: tKey(petDef.nameKey) })}</span>
          </div>
        )}

        {completedRegion && (
          <div role="status" className="flex w-full max-w-md animate-rise items-center gap-3 rounded-3xl bg-apricot p-3" style={{ animationDelay: '580ms' }}>
            <span className="shrink-0 animate-hop pl-1" style={{ animationDelay: '800ms' }}>
              <Rosette size={48} />
            </span>
            <span className="text-left text-xl font-bold">{t('reward.regionComplete', { region: tKey(getRegion(completedRegion).nameKey) })}</span>
          </div>
        )}

        {newRegion && (
          <p role="status" className="w-full max-w-md animate-rise rounded-3xl bg-lavender p-4 text-xl font-bold" style={{ animationDelay: '600ms' }}>
            <RegionIcon id={newRegion} size={36} inline /> {t('reward.newRegion', { region: tKey(getRegion(newRegion).nameKey) })}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <section className="w-full max-w-md rounded-3xl bg-moss/70 p-4">
          <h3 className="mb-1 text-lg font-semibold">{t('math.learned')}</h3>
          <p className="text-lg font-semibold">{discovery}</p>
        </section>

        <div className="grid w-full max-w-md gap-3">
          <BigButton size="lg" onClick={onWorkshop}>
            <Hammer size={28} aria-hidden />
            {t('reward.goWorkshop')}
          </BigButton>
          <div className="grid grid-cols-2 gap-3">
            <BigButton variant="soft" onClick={onAgain}>
              <RotateCcw size={24} aria-hidden />
              {t('math.again')}
            </BigButton>
            <BigButton variant="soft" onClick={onMoreGames}>
              <LayoutGrid size={24} aria-hidden />
              {t('math.moreGames')}
            </BigButton>
          </div>
        </div>
      </div>
    </div>
  );
}
