import { Check, X } from 'lucide-react';
import AssetThumb from '../../../components/AssetThumb';
import BigButton from '../../../components/BigButton';
import { useI18n } from '../../../i18n';
import type { FurnitureDef } from '../../../types/furniture';

interface Props {
  def: FurnitureDef; // 지금 놓으려는 물건
  moving: boolean; // 옮기는 중인지 (아니면 새로 놓는 중)
  suggested: boolean; // 근처 자리를 권하는 중이면 '여기에 놓기' 버튼이 나온다
  onAccept: () => void;
  onCancel: () => void;
}

// 자리 고르는 중에 아래에 보이는 칸: 무엇을 놓는지 그림으로 보여주고, 권한 자리에 놓기 / 그만두기
export default function PlacingPanel({ def, moving, suggested, onAccept, onCancel }: Props) {
  const { t, tKey } = useI18n();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-3xl bg-cream/90 p-2 pr-4 shadow-pop-sm">
        <AssetThumb def={def} size={56} />
        <p className="min-w-0 flex-1 text-lg font-semibold leading-snug">
          {t(moving ? 'decorate.movingFor' : 'decorate.placingFor', { name: tKey(def.nameKey) })}
        </p>
      </div>
      {/* 권하는 자리가 있으면 '여기에 놓기'가 가장 크게, 그 아래 그만두기 */}
      <div className="grid gap-3">
        {suggested && (
          <BigButton size="lg" className="animate-pop" onClick={onAccept}>
            <Check size={26} strokeWidth={3} aria-hidden />
            {t('decorate.putHere')}
          </BigButton>
        )}
        <BigButton variant="soft" onClick={onCancel}>
          <X size={26} strokeWidth={3} aria-hidden />
          {t('decorate.cancel')}
        </BigButton>
      </div>
    </div>
  );
}
