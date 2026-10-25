import { GRID } from './iso';
import { getFurniture } from '../../data/furniture/furniture';
import type { FurnitureDef, PlacedFurniture, WallItem, WallSide } from '../../types/furniture';

// ===== 가구 배치 규칙 =====
// - 가구는 바닥 6 × 6 칸 안에만 놓을 수 있다.
// - 러그는 바닥에 깔리므로 다른 가구가 위에 올라갈 수 있다. (러그끼리는 겹치지 않음)
// - 그 밖의 가구끼리는 같은 칸을 쓸 수 없다.

// 바닥에 깔리는 가구인지 (겹침 순서와 겹침 허용 판단에 쓴다)
export const isFloorLayer = (def: FurnitureDef) => def.category === 'rug';

// 돌린 방향을 반영한 실제 차지 칸 수 [가로, 세로]
export function footprintSize(def: FurnitureDef, rotation: 0 | 1): [number, number] {
  return rotation === 0 ? [def.gridWidth, def.gridHeight] : [def.gridHeight, def.gridWidth];
}

// 두 사각형 영역이 겹치는지
function overlaps(ax: number, ay: number, aw: number, ad: number, bx: number, by: number, bw: number, bd: number) {
  return ax < bx + bw && bx < ax + aw && ay < by + bd && by < ay + ad;
}

// 가구를 (gx, gy) 에 놓을 수 있는지. ignoreUid 는 '옮기는 중인 자기 자신'을 빼고 검사할 때 쓴다.
export function canPlace(
  placed: PlacedFurniture[],
  furnitureId: string,
  rotation: 0 | 1,
  gx: number,
  gy: number,
  ignoreUid?: string,
): boolean {
  const def = getFurniture(furnitureId);
  if (!def || def.category === 'wallpaper' || def.category === 'wall') return false;
  const [w, d] = footprintSize(def, rotation);
  if (gx < 0 || gy < 0 || gx + w > GRID || gy + d > GRID) return false;

  return placed.every((item) => {
    if (item.uid === ignoreUid) return true;
    const other = getFurniture(item.furnitureId);
    if (!other || isFloorLayer(other) !== isFloorLayer(def)) return true; // 러그와 일반 가구는 겹쳐도 된다
    const [ow, od] = footprintSize(other, item.rotation);
    return !overlaps(gx, gy, w, d, item.gx, item.gy, ow, od);
  });
}

// ===== 벽 장식 배치 규칙 =====
// - 벽마다 GRID 칸. 같은 벽·같은 높이 띠에서 겹치지 않는다.
// - 오른쪽 벽 창문(2~3번 칸)의 가운데 높이에는 걸 수 없다 (위쪽 가랜드는 가능).
const WINDOW_SLOTS = [2, 3];

export const isWallItem = (def: FurnitureDef | undefined) => def?.category === 'wall';

export function canPlaceWall(wallItems: WallItem[], furnitureId: string, wall: WallSide, slot: number, ignoreUid?: string): boolean {
  const def = getFurniture(furnitureId);
  if (!def || !isWallItem(def)) return false;
  const w = def.gridWidth;
  const band = def.wallBand ?? 'middle';
  if (slot < 0 || slot + w > GRID) return false;
  if (wall === 'right' && band === 'middle' && WINDOW_SLOTS.some((s) => s >= slot && s < slot + w)) return false;
  return wallItems.every((item) => {
    if (item.uid === ignoreUid || item.wall !== wall) return true;
    const other = getFurniture(item.furnitureId);
    if (!other || (other.wallBand ?? 'middle') !== band) return true;
    return slot + w <= item.slot || item.slot + other.gridWidth <= slot;
  });
}

// 그리는 순서(겹침 순서): 러그 먼저, 그다음 뒤쪽(화면 위쪽) 가구부터 앞쪽 가구 순서로.
export function sortForDrawing(placed: PlacedFurniture[]): PlacedFurniture[] {
  const depth = (item: PlacedFurniture) => {
    const def = getFurniture(item.furnitureId);
    if (!def) return 0;
    const [w, d] = footprintSize(def, item.rotation);
    return (isFloorLayer(def) ? -1000 : 0) + (item.gx + w) + (item.gy + d);
  };
  return [...placed].sort((a, b) => depth(a) - depth(b) || a.gx - b.gx);
}
