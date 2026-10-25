import { Check } from 'lucide-react';
import AssetThumb from '../../../components/AssetThumb';
import { FURNITURE } from '../../../data/furniture/furniture';
import { useI18n } from '../../../i18n';
import type { RoomLayout } from '../../../types/furniture';

interface Props {
  layout: RoomLayout;
  owned: Record<string, number>; // 가진 가구 개수
  onPick: (furnitureId: string) => void;
}

// 방에 놓을 수 있는 물건 목록 — 가진 가구만 보인다.
// 아직 놓지 않은 개수는 '×2', 다 놓았으면 '방에 있음' 표시.
// 카드 폭은 다음 카드가 살짝 보이도록 정해서 옆으로 밀 수 있다는 걸 알 수 있게 한다.
export default function FurnitureTray({ layout, owned, onPick }: Props) {
  const { t, tKey, formatNumber } = useI18n();
  const items = FURNITURE.filter((def) => (owned[def.id] ?? 0) > 0);

  return (
    <ul
      aria-label={t('decorate.trayLabel')}
      // 옆으로 밀면 카드가 한 장씩 딱 멈춘다 (좁은 화면에서 보기 쉽게)
      className="flex snap-x snap-mandatory scroll-px-1 gap-3 overflow-x-auto px-1 pb-2 pt-1 [scrollbar-width:thin] [@media(max-height:500px)]:grid [@media(max-height:500px)]:grid-cols-2 [@media(max-height:500px)]:overflow-y-auto"
    >
      {items.map((def) => {
        const placed =
          def.category === 'wallpaper'
            ? layout.wallpaperId === def.id ? 1 : 0
            : (def.category === 'wall' ? layout.wallItems : layout.placed).filter((p) => p.furnitureId === def.id).length;
        const available = def.category === 'wallpaper' ? 0 : owned[def.id] - placed;
        return (
          <li key={def.id} className="shrink-0 snap-start">
            <button
              type="button"
              onClick={() => onPick(def.id)}
              className="flex h-full w-[6.5rem] flex-col items-center gap-1 rounded-3xl bg-cream p-2 text-center shadow-pop-sm transition-transform active:translate-y-0.5"
            >
              <AssetThumb def={def} size={64} />
              <span className="text-base font-semibold leading-tight">{tKey(def.nameKey)}</span>
              {available > 0 ? (
                <span className="mt-auto rounded-full bg-apricot px-2 text-sm font-bold" aria-label={t('decorate.available', { n: formatNumber(available) })}>
                  ×{formatNumber(available)}
                </span>
              ) : (
                placed > 0 && (
                  <span className="mt-auto flex items-center gap-0.5 rounded-full bg-sage px-2 text-sm">
                    <Check size={14} strokeWidth={3} aria-hidden />
                    {t('decorate.inRoom')}
                  </span>
                )
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
