import type { KeyboardEvent } from 'react';
import { footprintCorners, lift, toPoints } from './iso';
import FurniturePlaceholder from './placeholders/FurniturePlaceholder';
import { footprintSize } from './placement';
import { assetUrl } from '../../data/assets/assetRegistry';
import { useAssetStatus } from '../../services/assets/useAssetStatus';
import type { FurnitureDef, PlacedFurniture } from '../../types/furniture';

interface Props {
  item: PlacedFurniture;
  def: FurnitureDef;
  label: string; // 화면 읽기용 이름
  selected?: boolean;
  onClick?: () => void; // 없으면 누를 수 없는 가구 (보기 전용, 또는 바닥을 고르는 중)
}

// 방에 놓인 가구 하나. 그림 파일이 있으면 그림을, 없으면 코드로 그린 가구 모양을 보여준다.
export default function FurnitureSprite({ item, def, label, selected, onClick }: Props) {
  const [w, d] = footprintSize(def, item.rotation);
  const c = footprintCorners(item.gx, item.gy, w, d);
  const url = assetUrl(def.assetPath);
  const status = useAssetStatus(url);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const interactive = Boolean(onClick);
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
      {/* 선택된 가구: 바닥에 점선 테두리 */}
      {selected && <polygon points={toPoints([c.top, c.right, c.bottom, c.left])} fill="#FFF5DF" fillOpacity="0.6" stroke="#B9855A" strokeWidth="5" strokeDasharray="12 8" />}

      {status === 'ok' ? (
        // 그림의 아래 가운데를 바닥 영역의 아래 꼭짓점에 맞춘다. 돌린 방향이면 좌우를 뒤집는다.
        <image
          href={url}
          x={c.bottom.x - def.width / 2}
          y={c.bottom.y - def.height}
          width={def.width}
          height={def.height}
          transform={item.rotation === 1 ? `translate(${2 * c.bottom.x} 0) scale(-1 1)` : undefined}
        />
      ) : (
        <FurniturePlaceholder def={def} area={{ gx: item.gx, gy: item.gy, w, d }} />
      )}

      {/* 선택된 가구: 위에 화살표 (색만으로 알리지 않도록 모양으로도 표시) */}
      {selected && (
        <polygon
          points={toPoints([lift(c.top, def.placeholder.height + 50), { x: c.top.x - 14, y: c.top.y - def.placeholder.height - 74 }, { x: c.top.x + 14, y: c.top.y - def.placeholder.height - 74 }])}
          fill="#B9855A"
        />
      )}
    </g>
  );
}
