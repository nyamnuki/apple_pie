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
