import type { KeyboardEvent } from 'react';
import { footprintCorners, lift, toPoints } from './iso';
import FurniturePlaceholder from './placeholders/FurniturePlaceholder';
import { footprintSize } from './placement';
import { assetUrl } from '../../data/assets/assetRegistry';
import { useAssetStatus } from '../../services/assets/useAssetStatus';
import type { FurnitureDef, PlacedFurniture } from '../../types/furniture';

type Spot = Pick<PlacedFurniture, 'gx' | 'gy' | 'rotation'>;

// 가구 그림만 (그림 파일이 있으면 그림, 없으면 코드로 그린 모양)
function FurnitureArt({ def, spot }: { def: FurnitureDef; spot: Spot }) {
  const [w, d] = footprintSize(def, spot.rotation);
  const c = footprintCorners(spot.gx, spot.gy, w, d);
  const url = assetUrl(def.assetPath);
  const status = useAssetStatus(url);
  return status === 'ok' ? (
    // 그림의 아래 가운데를 바닥 영역의 아래 꼭짓점에 맞춘다. 돌린 방향이면 좌우를 뒤집는다.
    <image
      href={url}
      x={c.bottom.x - def.width / 2}
      y={c.bottom.y - def.height}
      width={def.width}
      height={def.height}
      transform={spot.rotation === 1 ? `translate(${2 * c.bottom.x} 0) scale(-1 1)` : undefined}
    />
  ) : (
    <FurniturePlaceholder def={def} area={{ gx: spot.gx, gy: spot.gy, w, d }} />
  );
}

interface Props {
  item: PlacedFurniture;
  def: FurnitureDef;
  label: string; // 화면 읽기용 이름
  selected?: boolean;
  shake?: number; // 값이 바뀔 때마다 살짝 흔든다 (돌릴 자리가 없을 때)
  celebrate?: number; // 값이 바뀔 때마다 바닥에서 둥근 빛이 퍼진다 (방금 놓았을 때)
  onClick?: () => void; // 없으면 누를 수 없는 가구 (보기 전용, 또는 바닥을 고르는 중)
}

// 방에 놓인 가구 하나
export default function FurnitureSprite({ item, def, label, selected, shake = 0, celebrate = 0, onClick }: Props) {
  const [w, d] = footprintSize(def, item.rotation);
  const c = footprintCorners(item.gx, item.gy, w, d);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const interactive = Boolean(onClick);
  const floor = toPoints([c.top, c.right, c.bottom, c.left]);
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
      {/* 방금 놓은 가구: 바닥에서 둥근 빛이 한 번 퍼진다 */}
      {celebrate > 0 && <polygon key={`ring-${celebrate}`} points={floor} fill="#FFF5DF" stroke="#946539" strokeWidth="4" className="animate-ring" />}
      {/* 선택된 가구: 바닥에 점선 테두리 */}
      {selected && <polygon points={floor} fill="#FFF5DF" fillOpacity="0.6" stroke="#946539" strokeWidth="5" strokeDasharray="12 8" />}

      {/* 놓을 때·돌릴 때마다 새로 그려져 톡 내려앉는다. 돌릴 자리가 없으면 좌우로 흔든다 */}
      <g key={`${item.rotation}-${shake}`} className={shake ? 'animate-shake animate-settle' : 'animate-settle'}>
        <FurnitureArt def={def} spot={item} />
      </g>

      {/* 선택된 가구: 위에 화살표 (색만으로 알리지 않도록 모양으로도 표시) */}
      {selected && (
        <polygon
          points={toPoints([lift(c.top, def.placeholder.height + 50), { x: c.top.x - 14, y: c.top.y - def.placeholder.height - 74 }, { x: c.top.x + 14, y: c.top.y - def.placeholder.height - 74 }])}
          fill="#946539"
          className="animate-bob"
        />
      )}
    </g>
  );
}

// 놓기 전 미리 보기: 반투명한 가구와 바닥 테두리. suggested 면 '여기는 어때요?' 하고 천천히 빛난다.
export function FurnitureGhost({ def, spot, suggested }: { def: FurnitureDef; spot: Spot; suggested: boolean }) {
  const [w, d] = footprintSize(def, spot.rotation);
  const c = footprintCorners(spot.gx, spot.gy, w, d);
  return (
    <g pointerEvents="none" aria-hidden="true" data-ghost={suggested ? 'suggested' : 'preview'}>
      <polygon
        points={toPoints([c.top, c.right, c.bottom, c.left])}
        fill={suggested ? '#F5D0AD' : '#FFF5DF'}
        fillOpacity="0.9"
        stroke="#946539"
        strokeWidth={suggested ? 7 : 5}
        strokeDasharray="10 7"
        className={suggested ? 'animate-pulse' : undefined}
      />
      <g opacity="0.7">
        <FurnitureArt def={def} spot={spot} />
      </g>
    </g>
  );
}
