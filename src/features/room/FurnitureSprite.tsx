import type { KeyboardEvent } from 'react';
import { footprintCorners, lift, toPoints } from './iso';
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

// 방에 놓인 가구 하나. 그림 파일이 있으면 그림을, 없으면 크기에 맞는 입체 상자를 그린다.
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
        <PlaceholderBox corners={c} def={def} />
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

// 임시 그래픽: 바닥 영역 크기의 입체 상자 + 위에 그림 문자
function PlaceholderBox({ corners: c, def }: { corners: ReturnType<typeof footprintCorners>; def: FurnitureDef }) {
  const h = def.placeholder.height;
  const topFace = [lift(c.top, h), lift(c.right, h), lift(c.bottom, h), lift(c.left, h)];
  const center = { x: (c.left.x + c.right.x) / 2, y: (c.top.y + c.bottom.y) / 2 - h };
  const emojiSize = Math.min(64, 26 + Math.min(c.right.x - c.left.x, 240) / 6);

  return (
    <g>
      {/* 바닥 그림자 */}
      <polygon points={toPoints([c.top, c.right, c.bottom, c.left])} fill="#59483C" fillOpacity="0.12" />
      {/* 왼쪽 면 (빛을 받아 덜 어둡다) */}
      <polygon points={toPoints([c.left, c.bottom, lift(c.bottom, h), lift(c.left, h)])} fill={def.placeholder.color} />
      <polygon points={toPoints([c.left, c.bottom, lift(c.bottom, h), lift(c.left, h)])} fill="#59483C" fillOpacity="0.12" />
      {/* 오른쪽 면 (그늘) */}
      <polygon points={toPoints([c.bottom, c.right, lift(c.right, h), lift(c.bottom, h)])} fill={def.placeholder.color} />
      <polygon points={toPoints([c.bottom, c.right, lift(c.right, h), lift(c.bottom, h)])} fill="#59483C" fillOpacity="0.25" />
      {/* 윗면 */}
      <polygon points={toPoints(topFace)} fill={def.placeholder.color} stroke="#FFF5DF" strokeOpacity="0.6" strokeWidth="2" />
      <text x={center.x} y={center.y} fontSize={emojiSize} textAnchor="middle" dominantBaseline="central">
        {def.placeholder.emoji}
      </text>
    </g>
  );
}
