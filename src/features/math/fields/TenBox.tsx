import AssetIcon from '../../../components/AssetIcon';
import { MATH_ITEMS } from '../../../data/math/items';
import type { MathItemId } from '../../../types/math';

// 10 상자: 물건 10개를 한 상자에 (5개씩 두 줄). 큰 수(어려움의 도전 단계)에서 물건을 모두 늘어놓으면
// 화면에 다 들어가지 않으므로, 꽉 찬 10 묶음은 상자 하나로 그린다. 10씩 묶어 세기 놀이와 같은 생각.
// badge: 오른쪽 위 숫자 (상자까지 센 수: 10, 20, 30…)
export default function TenBox({ item, badge }: { item: MathItemId; badge?: string }) {
  const { emoji, assetPath } = MATH_ITEMS[item];
  return (
    <span className="relative grid h-12 grid-cols-5 place-items-center gap-0.5 rounded-xl border-2 border-oak/50 bg-cream/80 px-1" aria-hidden="true" data-ten-box="">
      {Array.from({ length: 10 }, (_, i) => (
        <AssetIcon key={i} path={assetPath} emoji={emoji} size={16} />
      ))}
      {badge !== undefined && (
        <span className="absolute -right-2 -top-2 flex h-7 min-w-7 animate-pop items-center justify-center rounded-full bg-wood px-1 text-base font-bold text-cream">{badge}</span>
      )}
    </span>
  );
}

// 처음 묶음을 10 상자로 묶을지: 20 을 넘으면 (그보다 작으면 하나씩 세는 것이 배우는 점이다)
export const BOX_FROM = 21;
