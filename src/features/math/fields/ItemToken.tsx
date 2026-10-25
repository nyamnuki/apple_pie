import { X } from 'lucide-react';
import AssetIcon from '../../../components/AssetIcon';
import { MATH_ITEMS } from '../../../data/math/items';
import type { MathItemId } from '../../../types/math';

interface Props {
  item: MathItemId;
  badge?: number | string; // 오른쪽 위 숫자 (센 순서)
  removed?: boolean; // 덜어 낸 물건 (흐리게 + ✕)
  leaving?: boolean; // 곧 덜어 낼 물건 (점선 테두리)
  onClick?: () => void; // 있으면 누를 수 있는 버튼이 된다
  label?: string; // 누를 수 있을 때 화면 읽기용 이름
  size?: number;
}

// 수학 장면의 물건 하나 (사과, 꽃 등). 누르기 영역은 최소 56px.
export default function ItemToken({ item, badge, removed, leaving, onClick, label, size = 52 }: Props) {
  const { emoji, assetPath } = MATH_ITEMS[item];
  const body = (
    <>
      <span className={`flex items-center justify-center transition-all duration-300 ${removed ? 'scale-75 opacity-30' : ''}`}>
        <AssetIcon path={assetPath} emoji={emoji} size={size} />
      </span>
      {badge !== undefined && !removed && (
        <span className="absolute -right-1 -top-1 flex h-7 min-w-7 animate-pop items-center justify-center rounded-full bg-oak px-1 text-base font-bold text-cream">
          {badge}
        </span>
      )}
      {removed && (
        <span className="absolute inset-0 flex items-center justify-center text-bark/70">
          <X size={36} strokeWidth={3} aria-hidden />
        </span>
      )}
    </>
  );
  const frame = `relative flex h-16 w-16 items-center justify-center rounded-2xl ${leaving ? 'border-4 border-dashed border-oak/70' : ''}`;

  if (onClick)
    return (
      <button type="button" onClick={onClick} aria-label={label} className={`${frame} bg-cream/70 shadow-pop-sm transition-transform active:scale-90`}>
        {body}
      </button>
    );
  return (
    <span className={frame} aria-hidden="true">
      {body}
    </span>
  );
}
