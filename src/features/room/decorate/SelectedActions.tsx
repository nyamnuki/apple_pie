import { Move, RotateCw, PackageOpen, Check } from 'lucide-react';
import BigButton from '../../../components/BigButton';
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
      <p className="text-center text-lg">
        <strong>{tKey(def.nameKey)}</strong> · {tKey(def.descriptionKey)}
      </p>
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
