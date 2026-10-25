import type { KeyboardEvent } from 'react';
import WallPlaceholder from './placeholders/WallPlaceholder';
import { WALL_BANDS, wallPoint, wallTransform, toPoints } from './iso';
import { assetUrl } from '../../data/assets/assetRegistry';
import { useAssetStatus } from '../../services/assets/useAssetStatus';
import type { FurnitureDef, WallItem } from '../../types/furniture';

interface Props {
  item: WallItem;
  def: FurnitureDef;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

// 벽에 건 장식 하나. 정면 그림을 벽 각도에 맞게 비스듬히 그린다.
// (그림 파일도 정면에서 본 모습으로 그리면 된다: 가로 100×칸수, 세로 = 띠 높이)
export default function WallItemSprite({ item, def, label, selected, onClick }: Props) {
  const [zBottom, zTop] = WALL_BANDS[def.wallBand ?? 'middle'];
  const w = def.gridWidth * 100;
  const h = zTop - zBottom;
  const url = assetUrl(def.assetPath);
  const status = useAssetStatus(url);
  const interactive = Boolean(onClick);

  // 선택 표시: 장식 둘레 점선
  const outline = [
    wallPoint(item.wall, item.slot, zTop + 4),
    wallPoint(item.wall, item.slot + def.gridWidth, zTop + 4),
    wallPoint(item.wall, item.slot + def.gridWidth, zBottom - 4),
    wallPoint(item.wall, item.slot, zBottom - 4),
  ];

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <g
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? label : undefined}
      aria-pressed={interactive ? Boolean(selected) : undefined}
      onClick={onClick}
      onKeyDown={interactive ? onKeyDown : undefined}
      style={{ cursor: interactive ? 'pointer' : undefined, pointerEvents: interactive ? 'auto' : 'none' }}
      className="animate-settle"
    >
      <g transform={wallTransform(item.wall, item.slot, def.gridWidth, zTop)}>
        {status === 'ok' ? <image href={url} width={w} height={h} preserveAspectRatio="none" /> : <WallPlaceholder def={def} w={w} h={h} />}
        {/* 누르기 쉽도록 장식 전체를 투명하게 덮는다 */}
        <rect width={w} height={h} fill="transparent" />
      </g>
      {selected && <polygon points={toPoints(outline)} fill="none" stroke="#946539" strokeWidth="5" strokeDasharray="12 8" />}
    </g>
  );
}
