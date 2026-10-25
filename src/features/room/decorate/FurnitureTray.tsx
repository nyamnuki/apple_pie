import { Check } from 'lucide-react';
import AssetThumb from '../../../components/AssetThumb';
import { FURNITURE } from '../../../data/furniture/furniture';
import { useI18n } from '../../../i18n';
import type { RoomLayout } from '../../../types/furniture';

interface Props {
  layout: RoomLayout;
  onPick: (furnitureId: string) => void;
}

// 방에 넣을 수 있는 물건 목록. 이미 방에 있는 물건에는 체크 표시가 붙는다.
// 카드 폭은 다음 카드가 살짝 보이도록 정해서 옆으로 밀 수 있다는 걸 알 수 있게 한다.
// (Phase 4 에서 '가진 물건만' 보이도록 인벤토리와 연결한다)
export default function FurnitureTray({ layout, onPick }: Props) {
  const { t, tKey } = useI18n();

  return (
    <ul
      aria-label={t('decorate.trayLabel')}
      className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] [@media(max-height:500px)]:grid [@media(max-height:500px)]:grid-cols-2 [@media(max-height:500px)]:overflow-y-auto"
    >
      {FURNITURE.map((def) => {
        const inRoom = def.category === 'wallpaper' ? layout.wallpaperId === def.id : layout.placed.some((p) => p.furnitureId === def.id);
        return (
          <li key={def.id} className="shrink-0">
            <button
              type="button"
              onClick={() => onPick(def.id)}
              className="flex h-full w-[6.5rem] flex-col items-center gap-1 rounded-3xl bg-cream p-2 text-center shadow-pop-sm transition-transform active:translate-y-0.5"
            >
              <AssetThumb def={def} size={56} />
              <span className="text-base font-semibold leading-tight">{tKey(def.nameKey)}</span>
              {inRoom && (
                <span className="mt-auto flex items-center gap-0.5 rounded-full bg-sage px-2 text-sm">
                  <Check size={14} strokeWidth={3} aria-hidden />
                  {t('decorate.inRoom')}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
