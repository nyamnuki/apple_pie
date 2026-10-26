import type { KeyboardEvent } from 'react';
import RoomBackground from './RoomBackground';
import FurnitureSprite, { FurnitureGhost } from './FurnitureSprite';
import WallItemSprite, { WallGhost } from './WallItemSprite';
import { GRID, VIEW_W, VIEW_H, TILE_H, WALL_BANDS, footprintCorners, toPoints, wallPoint } from './iso';
import { footprintSize, sortForDrawing } from './placement';
import { getFurniture } from '../../data/furniture/furniture';
import PetLayer from '../pets/PetLayer';
import type { PetDef } from '../pets/pets';
import { useI18n } from '../../i18n';
import type { FurnitureDef, RoomLayout, WallSide } from '../../types/furniture';

// 놓기 전 미리 보기 (suggested: 누른 칸 대신 '여기는 어때요?' 하고 고른 근처 자리)
export type FloorGhost = { def: FurnitureDef; gx: number; gy: number; rotation: 0 | 1; suggested: boolean };
export type WallGhostSpot = { def: FurnitureDef; wall: WallSide; slot: number; suggested: boolean };

interface Props {
  layout: RoomLayout;
  // 아래는 꾸미기 화면에서만 쓴다 (없으면 보기 전용)
  selectedUid?: string | null;
  validSpots?: Set<string> | null; // 지금 놓을 수 있는 칸 ('gx,gy') — 있으면 '바닥 고르는 중'
  onTileClick?: (gx: number, gy: number) => void;
  onFurnitureClick?: (uid: string) => void; // 바닥 가구·벽 장식 모두
  validWallSpots?: Set<string> | null; // 지금 걸 수 있는 벽 칸 ('left:2') — 있으면 '벽 칸 고르는 중'
  wallBand?: 'middle' | 'high'; // 고르는 중인 장식의 높이 띠
  onWallClick?: (wall: WallSide, slot: number) => void;
  onTileHover?: (spot: { gx: number; gy: number } | null) => void; // 마우스·키보드로 칸 위에 있을 때 (미리 보기용)
  ghost?: FloorGhost | null;
  wallGhost?: WallGhostSpot | null;
  shake?: { uid: string; n: number } | null; // 이 가구를 살짝 흔든다 (n 이 바뀔 때마다)
  celebrate?: { uid: string; n: number } | null; // 방금 놓은 가구 (n 이 바뀔 때마다 빛이 퍼진다)
  pets?: PetDef[]; // 방에서 돌아다니는 친구 (내 방 화면에서만)
  marks?: string[]; // 루루의 질문: 센 물건 uid 순서대로 1, 2, 3… 번호를 붙인다
}

export const spotKey = (gx: number, gy: number) => `${gx},${gy}`;
export const wallKey = (wall: WallSide, slot: number) => `${wall}:${slot}`;
const WALLS: WallSide[] = ['left', 'right'];

// 아이소메트릭 방 전체 그림: 배경 → 바닥 칸(누르기용) → 가구 → '+' 표시 순서로 겹쳐 그린다.
export default function RoomView({ layout, selectedUid, validSpots, onTileClick, onFurnitureClick, validWallSpots, wallBand = 'middle', onWallClick, onTileHover, ghost, wallGhost, shake, celebrate, pets, marks }: Props) {
  const { t, tKey } = useI18n();
  const picking = Boolean(validSpots) || Boolean(validWallSpots);
  const items = sortForDrawing(layout.placed);
  const names = [...layout.wallItems, ...items].map((i) => getFurniture(i.furnitureId)).filter(Boolean).map((d) => tKey(d!.nameKey));

  const tiles = onTileClick
    ? Array.from({ length: GRID * GRID }, (_, i) => ({ gx: i % GRID, gy: Math.floor(i / GRID) }))
    : [];

  // 미리 보기 가구가 차지하는 칸 (그 칸의 '+' 는 숨겨서 미리 보기가 잘 보이게)
  const ghostCells = new Set<string>();
  if (ghost) {
    const [w, d] = footprintSize(ghost.def, ghost.rotation);
    for (let y = 0; y < d; y++) for (let x = 0; x < w; x++) ghostCells.add(spotKey(ghost.gx + x, ghost.gy + y));
  }

  const tileKeyDown = (e: KeyboardEvent, gx: number, gy: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTileClick?.(gx, gy);
    }
  };

  return (
    // 바닥·벽은 뒤쪽 그림(SVG)에 따로 그린다: 수채화 효과가 무거워서, 가구를 고르거나 옮길 때마다
    // 배경까지 다시 그리지 않게 한다. 두 그림은 같은 좌표·같은 크기로 정확히 겹친다.
    <div className="relative h-full w-full">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <RoomBackground wallpaperId={layout.wallpaperId} />
      </svg>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        role={onTileClick ? 'group' : 'img'}
        onPointerLeave={() => onTileHover?.(null)}
        aria-label={`${t('room.viewLabel')}: ${names.join(', ')}`}
      >
        {/* 벽 장식 (바닥 가구보다 뒤) */}
        {layout.wallItems.map((item) => {
          const def = getFurniture(item.furnitureId);
          if (!def) return null;
          return (
            <WallItemSprite
              key={item.uid}
              item={item}
              def={def}
              label={t(item.uid === selectedUid ? 'a11y.furnitureSelected' : 'a11y.furnitureInRoom', { name: tKey(def.nameKey) })}
              selected={item.uid === selectedUid}
              onClick={onFurnitureClick && !picking ? () => onFurnitureClick(item.uid) : undefined}
            />
          );
        })}

        {/* 벽 칸 고르기: 벽마다 6칸을 누를 수 있고, 걸 수 있는 칸에는 '+' */}
        {validWallSpots &&
          WALLS.map((wall) =>
            Array.from({ length: GRID }, (_, slot) => {
              const [z0, z1] = WALL_BANDS[wallBand];
              const quad = [wallPoint(wall, slot, z1 + 10), wallPoint(wall, slot + 1, z1 + 10), wallPoint(wall, slot + 1, z0 - 10), wallPoint(wall, slot, z0 - 10)];
              const center = wallPoint(wall, slot + 0.5, (z0 + z1) / 2);
              const valid = validWallSpots.has(wallKey(wall, slot));
              return (
                <g key={wallKey(wall, slot)}>
                  <polygon
                    points={toPoints(quad)}
                    fill={valid ? '#A8C3A0' : 'transparent'}
                    fillOpacity={valid ? 0.45 : undefined}
                    role="button"
                    tabIndex={0}
                    aria-label={t(wall === 'left' ? 'a11y.leftWallSpot' : 'a11y.rightWallSpot', { n: slot + 1 })}
                    onClick={() => onWallClick?.(wall, slot)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onWallClick?.(wall, slot);
                      }
                    }}
                  />
                  {valid && (
                    <g pointerEvents="none" aria-hidden="true">
                      <circle cx={center.x} cy={center.y} r="17" fill="#FFF5DF" stroke="#946539" strokeWidth="4" />
                      <path d={`M${center.x - 8} ${center.y}h16M${center.x} ${center.y - 8}v16`} stroke="#946539" strokeWidth="5" strokeLinecap="round" />
                    </g>
                  )}
                </g>
              );
            }),
          )}

        {/* 바닥 칸: 꾸미기 화면에서 누를 수 있다 */}
        {!validWallSpots && tiles.map(({ gx, gy }) => {
          const c = footprintCorners(gx, gy, 1, 1);
          // 바닥을 고를 때만 키보드로 칸에 갈 수 있게 한다 (평소에는 가구만)
          return (
            <polygon
              key={spotKey(gx, gy)}
              points={toPoints([c.top, c.right, c.bottom, c.left])}
              // 놓을 수 있는 칸은 연한 초록으로 칠한다 (+ 표시도 함께 있어 색만으로 알리지 않는다)
              fill={validSpots?.has(spotKey(gx, gy)) ? '#A8C3A0' : 'transparent'}
              fillOpacity={validSpots?.has(spotKey(gx, gy)) ? 0.45 : undefined}
              stroke={validSpots?.has(spotKey(gx, gy)) ? '#FFF5DF' : undefined}
              strokeWidth={validSpots?.has(spotKey(gx, gy)) ? 3 : undefined}
              onPointerEnter={(e) => e.pointerType === 'mouse' && onTileHover?.({ gx, gy })}
              onFocus={() => onTileHover?.({ gx, gy })}
              role={validSpots ? 'button' : undefined}
              tabIndex={validSpots ? 0 : -1}
              aria-label={validSpots ? t('a11y.floorSpot', { row: gy + 1, col: gx + 1 }) : undefined}
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
              shake={shake?.uid === item.uid ? shake.n : 0}
              celebrate={celebrate?.uid === item.uid ? celebrate.n : 0}
              // 바닥을 고르는 중에는 가구를 눌러도 바닥 칸이 눌리도록 가구 누르기를 끈다
              onClick={onFurnitureClick && !picking ? () => onFurnitureClick(item.uid) : undefined}
            />
          );
        })}

        {/* 루루의 질문: 센 물건 위에 번호 (하나씩 차례로 나타난다) */}
        {marks && marks.length > 0 && (
          <g aria-hidden="true">
            {marks.map((uid, i) => {
              const item = layout.placed.find((p) => p.uid === uid);
              const wall = layout.wallItems.find((w) => w.uid === uid);
              const def = getFurniture((item ?? wall)?.furnitureId ?? '');
              if (!def) return null;
              let at;
              if (item) {
                const [w, d] = footprintSize(def, item.rotation);
                const c = footprintCorners(item.gx, item.gy, w, d);
                at = { x: (c.left.x + c.right.x) / 2, y: c.top.y - def.placeholder.height - 12 };
              } else {
                const [z0, z1] = WALL_BANDS[def.wallBand ?? 'middle'];
                at = wallPoint(wall!.wall, wall!.slot + def.gridWidth / 2, (z0 + z1) / 2 + 20);
              }
              return (
                <g key={uid} className="animate-pop" style={{ animationDelay: `${i * 450}ms`, transformBox: 'fill-box', transformOrigin: 'center' }}>
                  <circle cx={at.x} cy={at.y} r="32" fill="#946539" stroke="#FFF5DF" strokeWidth="5" />
                  <text x={at.x} y={at.y + 12} textAnchor="middle" fontSize="36" fontWeight="700" fill="#FFF5DF">
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* 반려 친구 (가구 위에 그린다) */}
        {pets && pets.length > 0 && <PetLayer pets={pets} layout={layout} />}

        {/* 미리 보기 (반투명 가구) */}
        {ghost && <FurnitureGhost def={ghost.def} spot={ghost} suggested={ghost.suggested} />}
        {wallGhost && <WallGhost def={wallGhost.def} wall={wallGhost.wall} slot={wallGhost.slot} suggested={wallGhost.suggested} />}

        {/* 놓을 수 있는 칸에 '+' 표시 (가구에 가려지지 않게 맨 위에, 누르기는 아래 칸이 받는다) */}
        {validSpots && (
          <g pointerEvents="none" aria-hidden="true">
            {[...validSpots].filter((key) => !ghostCells.has(key)).map((key) => {
              const [gx, gy] = key.split(',').map(Number);
              const c = footprintCorners(gx, gy, 1, 1);
              const cy = c.top.y + TILE_H / 2;
              return (
                <g key={key}>
                  <circle cx={c.top.x} cy={cy} r="19" fill="#FFF5DF" stroke="#946539" strokeWidth="4" />
                  <path d={`M${c.top.x - 9} ${cy}h18M${c.top.x} ${cy - 9}v18`} stroke="#946539" strokeWidth="5" strokeLinecap="round" />
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
