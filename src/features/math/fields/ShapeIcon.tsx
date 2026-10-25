import type { ShapeSpec } from '../../../types/math';

// 도형 그림 (동그라미·네모·세모). 크기·색·돌림이 달라도 같은 도형이다.
export default function ShapeIcon({ spec, box = 56 }: { spec: ShapeSpec; box?: number }) {
  const s = 40 * spec.size; // 도형 크기 (상자 100 기준)
  const line = { stroke: '#6B5444', strokeWidth: 4, strokeLinejoin: 'round' as const, fill: spec.color };
  const shape =
    spec.shape === 'circle' ? (
      <circle cx="50" cy="50" r={s} {...line} />
    ) : spec.shape === 'square' ? (
      <rect x={50 - s * 0.85} y={50 - s * 0.85} width={s * 1.7} height={s * 1.7} rx="4" {...line} />
    ) : (
      <polygon points={`50,${50 - s} ${50 + s * 0.95},${50 + s * 0.7} ${50 - s * 0.95},${50 + s * 0.7}`} {...line} />
    );
  return (
    <svg viewBox="0 0 100 100" width={box} height={box} aria-hidden="true">
      <g filter="url(#wc-small)" transform={spec.rotate ? `rotate(${spec.rotate} 50 50)` : undefined}>
        {shape}
      </g>
    </svg>
  );
}
