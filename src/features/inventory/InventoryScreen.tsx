import { Hammer, Sofa } from '../../components/icons';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import ScreenHeader from '../../components/ScreenHeader';
import AssetThumb from '../../components/AssetThumb';
import ResourceChip from '../../components/ResourceChip';
import { FURNITURE } from '../../data/furniture/furniture';
import { RESOURCES } from '../../data/resources/resources';
import { getRegion } from '../../data/regions/regions';
import RegionIcon from '../../components/RegionIcon';
import { useGame } from '../../app/GameProvider';
import { useRoom } from '../room/RoomProvider';
import { LESSONS, lessonKey } from '../../data/math/lessons';
import { useI18n } from '../../i18n';

interface Props {
  onBack: () => void;
  onWorkshop: () => void;
  onDecorate: () => void;
  onPlace: (furnitureId: string) => void; // 가구를 누르면 꾸미기로 가서 바로 놓기
}

// 인벤토리: 모은 재료와 가진 가구를 한눈에 본다
export default function InventoryScreen({ onBack, onWorkshop, onDecorate, onPlace }: Props) {
  const { t, tKey, formatNumber } = useI18n();
  const { game } = useGame();
  const { layout } = useRoom();
  const materials = RESOURCES.filter((r) => (game.resources[r.id] ?? 0) > 0);
  const owned = FURNITURE.filter((f) => (game.furniture[f.id] ?? 0) > 0);
  // 그 재료를 보상으로 주는 놀이 이름 (없으면 황금 도토리처럼 오늘의 문제 도장으로 모은다)
  const whereFrom = (id: (typeof materials)[number]['id']) => {
    const games = LESSONS.filter((l) => (l.rewards[id] ?? 0) > 0).map((l) => t(lessonKey(l.id, 'title')));
    return games.length > 0 ? t('inventory.from', { games: games.join(', ') }) : t('inventory.fromDaily');
  };

  // 방에 놓인 개수 (벽지는 붙였으면 1)
  const inRoom = (id: string) =>
    id === layout.wallpaperId ? 1 : [...layout.placed, ...layout.wallItems].filter((p) => p.furnitureId === id).length;

  return (
    <AppShell background="bg-gradient-to-b from-cream to-moss">
      <ScreenHeader title={t('inventory.title')} onBack={onBack} />

      <section aria-labelledby="inv-materials" className="storybook-card mb-5 rounded-3xl p-4">
        <h2 id="inv-materials" className="mb-3 text-2xl font-bold">
          {t('inventory.materials')}
        </h2>
        {materials.length === 0 ? (
          <p className="text-lg">{t('inventory.noMaterials')}</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {materials.map((r) => (
              <li key={r.id} className="flex items-center gap-3">
                <ResourceChip id={r.id} amount={game.resources[r.id] ?? 0} size="lg" />
                <span>
                  <span className="block text-lg font-semibold">{tKey(r.nameKey)}</span>
                  <span className="block text-sm text-bark/85">
                    <RegionIcon id={r.region} size={24} inline /> {tKey(getRegion(r.region).nameKey)}
                  </span>
                  <span className="block text-sm text-bark/85" data-from={r.id}>
                    {whereFrom(r.id)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="inv-furniture" className="storybook-card mb-5 rounded-3xl p-4">
        <h2 id="inv-furniture" className="mb-3 text-2xl font-bold">
          {t('inventory.furniture')}
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {owned.map((f) => (
            <li key={f.id}>
              {/* 누르면 꾸미기 화면에서 이 가구를 고른 상태로 (놓을 자리 고르기 / 이미 놓았으면 그 가구 고르기) */}
              <button
                type="button"
                onClick={() => onPlace(f.id)}
                className="flex h-full w-full flex-col items-center gap-1 rounded-2xl bg-moss/60 p-3 text-center shadow-pop-sm transition-transform active:translate-y-0.5"
              >
                <AssetThumb def={f} size={56} />
                <span className="text-base font-semibold leading-tight">{tKey(f.nameKey)}</span>
                <span className="text-sm">
                  {t('inventory.inRoomOf', { placed: formatNumber(inRoom(f.id)), owned: formatNumber(game.furniture[f.id]) })}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <BigButton onClick={onWorkshop}>
          <Hammer size={24} aria-hidden />
          {t('menu.workshop')}
        </BigButton>
        <BigButton variant="sage" onClick={onDecorate}>
          <Sofa size={24} aria-hidden />
          {t('menu.decorate')}
        </BigButton>
      </div>
    </AppShell>
  );
}
