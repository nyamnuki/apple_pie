// ===== 가구 색 바꾸기 =====
// 바닥 가구는 색 3가지 중에서 고를 수 있다: 0 = 원래 색, 1·2 = 색상환을 돌린 색.
// 방(SVG)에서는 WatercolorDefs 의 #tint-1, #tint-2 필터를, 목록 그림(HTML)에서는 같은 계산인
// CSS hue-rotate 를 쓴다. 저장에는 1·2 만 남기고, 원래 색이면 아예 적지 않는다 (예전 저장과 호환).

export type Tint = 0 | 1 | 2;
export const TINTS: readonly Tint[] = [0, 1, 2];
export const TINT_HUE: Record<Tint, number> = { 0: 0, 1: 150, 2: 250 };

export const isTint = (v: unknown): v is 1 | 2 => v === 1 || v === 2;
export const tintFilter = (t: Tint | undefined) => (t ? `url(#tint-${t})` : undefined);
export const tintCss = (t: Tint) => (t ? `hue-rotate(${TINT_HUE[t]}deg)` : undefined);
