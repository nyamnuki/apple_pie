import type { WallSide } from '../../types/furniture';

// ===== 아이소메트릭(비스듬히 내려다본) 방의 좌표 계산 =====
// 방 그림 전체는 760 × 640 크기의 '방 좌표'로 그리고, 화면 크기에 맞게 자동으로 늘리거나 줄인다.

export const GRID = 6; // 바닥 칸 수 (6 × 6)
export const TILE_W = 120; // 바닥 한 칸의 화면 너비
export const TILE_H = 60; // 바닥 한 칸의 화면 높이 (너비의 절반 = 2:1 아이소메트릭)
export const WALL_H = 220; // 벽 높이
export const VIEW_W = 760;
export const VIEW_H = 640;
const ORIGIN_X = VIEW_W / 2; // 바닥 맨 위 꼭짓점 위치
const ORIGIN_Y = 240;

export interface Point {
  x: number;
  y: number;
}

// 바닥 칸 좌표(a, b) → 화면 좌표. a 는 오른쪽 아래로, b 는 왼쪽 아래로 늘어난다.
export function toScreen(a: number, b: number): Point {
  return { x: ORIGIN_X + ((a - b) * TILE_W) / 2, y: ORIGIN_Y + ((a + b) * TILE_H) / 2 };
}

// 점 목록 → SVG polygon 의 points 문자열
export function toPoints(points: Point[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(' ');
}

// 바닥 영역(gx, gy 에서 w × d 칸)의 네 꼭짓점
export function footprintCorners(gx: number, gy: number, w: number, d: number) {
  return {
    top: toScreen(gx, gy),
    right: toScreen(gx + w, gy),
    bottom: toScreen(gx + w, gy + d),
    left: toScreen(gx, gy + d),
  };
}

// 점을 위로 h 만큼 올린 점
export const lift = (p: Point, h: number): Point => ({ x: p.x, y: p.y - h });

// ===== 벽 =====
// 왼쪽 벽: 바닥 b 방향 모서리 위 / 오른쪽 벽: 바닥 a 방향 모서리 위. 벽마다 GRID 칸.

// 벽 장식을 거는 높이 띠 [아래, 위] (방 좌표 단위)
export const WALL_BANDS = { middle: [95, 175], high: [180, 212] } as const;

// 벽 위의 점: 모서리에서 t 칸, 높이 z
export function wallPoint(wall: WallSide, t: number, z: number): Point {
  return lift(wall === 'left' ? toScreen(0, t) : toScreen(t, 0), z);
}

// 벽 장식을 '정면 그림'처럼 그릴 수 있게 해 주는 변환.
// 장식 안쪽 좌표: x = 0 ~ 100×칸수 (보는 사람 기준 왼쪽 → 오른쪽), y = 0 ~ 띠 높이 (위 → 아래)
export function wallTransform(wall: WallSide, slot: number, width: number, zTop: number): string {
  // 왼쪽 벽은 보는 사람 기준으로 먼 쪽(칸 번호가 큰 쪽)이 왼쪽이다
  const origin = wall === 'left' ? wallPoint('left', slot + width, zTop) : wallPoint('right', slot, zTop);
  const ux = TILE_W / 2 / 100;
  const uy = (wall === 'left' ? -TILE_H / 2 : TILE_H / 2) / 100;
  return `matrix(${ux} ${uy} 0 1 ${origin.x} ${origin.y})`;
}
