import type { KeyboardEvent } from 'react';
import RoomBackground from './RoomBackground';
import FurnitureSprite from './FurnitureSprite';
import { GRID, VIEW_W, VIEW_H, TILE_H, footprintCorners, toPoints } from './iso';
import { sortForDrawing } from './placement';
import { getFurniture } from '../../data/furniture/furniture';
import { useI18n } from '../../i18n';
import type { RoomLayout } from '../../types/furniture';

interface Props {
  layout: RoomLayout;
  // 아래는 꾸미기 화면에서만 쓴다 (없으면 보기 전용)
  selectedUid?: string | null;
  validSpots?: Set<string> | null; // 지금 놓을 수 있는 칸 ('gx,gy') — 있으면 '바닥 고르는 중'
  onTileClick?: (gx: number, gy: number) => void;
  onFurnitureClick?: (uid: string) => void;
}

export const spotKey = (gx: number, gy: number) => `${gx},${gy}`;

// 아이소메트릭 방 전체 그림: 배경 → 바닥 칸(누르기용) → 가구 → '+' 표시 순서로 겹쳐 그린다.
export default function RoomView({ layout, selectedUid, validSpots, onTileClick, onFurnitureClick }: Props) {
  const { t, tKey } = useI18n();
  const picking = Boolean(validSpots);
  const items = sortForDrawing(layout.placed);
  const names = items.map((i) => getFurniture(i.furnitureId)).filter(Boolean).map((d) => tKey(d!.nameKey));

  const tiles = onTileClick
    ? Array.from({ length: GRID * GRID }, (_, i) => ({ gx: i % GRID, gy: Math.floor(i / GRID) }))
    : [];

  const tileKeyDown = (e: KeyboardEvent, gx: number, gy: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTileClick?.(gx, gy);
    }
  };

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      role={onTileClick ? 'group' : 'img'}
      aria-label={`${t('room.viewLabel')}: ${names.join(', ')}`}
    >
      <RoomBackground wallpaperId={layout.wallpaperId} />

      {/* 바닥 칸: 꾸미기 화면에서 누를 수 있다 */}
      {tiles.map(({ gx, gy }) => {
        const c = footprintCorners(gx, gy, 1, 1);
        // 바닥을 고를 때만 키보드로 칸에 갈 수 있게 한다 (평소에는 가구만)
        return (
          <polygon
            key={spotKey(gx, gy)}
            points={toPoints([c.top, c.right, c.bottom, c.left])}
            fill="transparent"
            role={picking ? 'button' : undefined}
            tabIndex={picking ? 0 : -1}
            aria-label={picking ? t('a11y.floorSpot', { row: gy + 1, col: gx + 1 }) : undefined}
            onClick={() => onTileClick?.(gx, gy)}
            onKeyDown={(e) => tileKeyDown(e, gx, gy)}
          />
        );
      })}

      {items.map((item) => {
        const def = getFurniture(item.furnitureId);
        if (!def) return null;
        return (
          <FurnitureSprite
            key={item.uid}
            item={item}
            def={def}
            label={t(item.uid === selectedUid ? 'a11y.furnitureSelected' : 'a11y.furnitureInRoom', { name: tKey(def.nameKey) })}
            selected={item.uid === selectedUid}
            // 바닥을 고르는 중에는 가구를 눌러도 바닥 칸이 눌리도록 가구 누르기를 끈다
            onClick={onFurnitureClick && !picking ? () => onFurnitureClick(item.uid) : undefined}
          />
        );
      })}

      {/* 놓을 수 있는 칸에 '+' 표시 (가구에 가려지지 않게 맨 위에, 누르기는 아래 칸이 받는다) */}
      {validSpots && (
        <g pointerEvents="none" aria-hidden="true">
          {[...validSpots].map((key) => {
            const [gx, gy] = key.split(',').map(Number);
            const c = footprintCorners(gx, gy, 1, 1);
            const cy = c.top.y + TILE_H / 2;
            return (
              <g key={key}>
                <circle cx={c.top.x} cy={cy} r="17" fill="#FFF5DF" stroke="#B9855A" strokeWidth="4" />
                <path d={`M${c.top.x - 8} ${cy}h16M${c.top.x} ${cy - 8}v16`} stroke="#B9855A" strokeWidth="5" strokeLinecap="round" />
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
