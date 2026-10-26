import { Move, RotateCw, PackageOpen, Check } from '../../../components/icons';
import BigButton from '../../../components/BigButton';
import AssetThumb from '../../../components/AssetThumb';
import { useI18n } from '../../../i18n';
import type { FurnitureDef } from '../../../types/furniture';

interface Props {
  def: FurnitureDef;
  onMove: () => void;
  onTurn?: () => void; // 없으면 '돌리기' 버튼을 숨긴다 (벽 장식)
  onPutAway: () => void;
  onDone: () => void;
}

// 방의 가구를 골랐을 때 나오는 버튼들: 옮기기 / 돌리기 / 치우기 / 다 했어요
export default function SelectedActions({ def, onMove, onTurn, onPutAway, onDone }: Props) {
  const { t, tKey } = useI18n();
  return (
    <div className="flex flex-col gap-3">
      {/* 지금 고른 물건: 그림 + 이름 (방에서도 화살표로 가리킨다) */}
      <div className="flex items-center gap-3 rounded-3xl bg-cream/90 p-2 pr-4 shadow-pop-sm">
        <AssetThumb def={def} size={56} />
        <p className="min-w-0 flex-1 text-base leading-snug">
          <strong className="block text-lg">{tKey(def.nameKey)}</strong>
          {tKey(def.descriptionKey)}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 [@media(max-height:500px)]:grid-cols-2">
        <BigButton variant="sage" onClick={onMove}>
          <Move size={26} aria-hidden />
          {t('decorate.move')}
        </BigButton>
        {onTurn && (
          <BigButton variant="sage" onClick={onTurn}>
            <RotateCw size={26} aria-hidden />
            {t('decorate.turn')}
          </BigButton>
        )}
        <BigButton variant="soft" onClick={onPutAway}>
          <PackageOpen size={26} aria-hidden />
          {t('decorate.putAway')}
        </BigButton>
        <BigButton onClick={onDone}>
          <Check size={26} strokeWidth={3} aria-hidden />
          {t('decorate.done')}
        </BigButton>
      </div>
    </div>
  );
}
