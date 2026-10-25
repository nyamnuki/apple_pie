import type { FurnitureDef } from '../../../types/furniture';

// ===== 그림 파일이 없을 때 그리는 벽 장식 =====
// 정면에서 본 그림처럼 그리면, 바깥에서 wallTransform 으로 벽 각도에 맞게 비스듬히 바뀐다.
// 좌표: x = 0 ~ w (가로), y = 0 ~ h (위 → 아래)

const LINE = { stroke: '#59483C', strokeOpacity: 0.45, strokeWidth: 2.5, strokeLinejoin: 'round' as const };

function LeafFrame({ w, h }: { w: number; h: number }) {
  return (
    <g>
      <rect x={w * 0.12} y={4} width={w * 0.76} height={h - 8} rx="4" fill="#B9855A" {...LINE} />
      <rect x={w * 0.2} y={12} width={w * 0.6} height={h - 24} rx="2" fill="#D5E4C8" />
      {/* 커다란 나뭇잎 */}
      <path d={`M${w / 2} ${h * 0.25} C${w * 0.72} ${h * 0.35} ${w * 0.68} ${h * 0.7} ${w / 2} ${h * 0.78} C${w * 0.32} ${h * 0.7} ${w * 0.28} ${h * 0.35} ${w / 2} ${h * 0.25} Z`} fill="#A8C3A0" {...LINE} />
      <path d={`M${w / 2} ${h * 0.28} L${w / 2} ${h * 0.76}`} stroke="#7FA077" strokeWidth="2.5" />
    </g>
  );
}

function StarryFrame({ w, h }: { w: number; h: number }) {
  const stars = [
    [0.32, 0.32],
    [0.6, 0.25],
    [0.45, 0.6],
    [0.7, 0.68],
  ];
  return (
    <g>
      <rect x={w * 0.12} y={4} width={w * 0.76} height={h - 8} rx="4" fill="#D9D0EC" {...LINE} />
      <rect x={w * 0.2} y={12} width={w * 0.6} height={h - 24} rx="2" fill="#5B6290" />
      {/* 초승달 */}
      <circle cx={w * 0.66} cy={h * 0.42} r={h * 0.13} fill="#F5D0AD" />
      <circle cx={w * 0.7} cy={h * 0.38} r={h * 0.12} fill="#5B6290" />
      {stars.map(([x, y], i) => (
        <circle key={i} cx={w * x} cy={h * y} r="2.5" fill="#FFF5DF" />
      ))}
    </g>
  );
}

function Garland({ w, h }: { w: number; h: number }) {
  const n = Math.round(w / 34);
  const sag = (x: number) => 4 + Math.sin((x / w) * Math.PI) * 8; // 줄이 살짝 처진다
  const colors = ['#F3C6D2', '#F5D0AD', '#A8C3A0'];
  return (
    <g>
      <path d={`M0 4 Q${w / 2} 20 ${w} 4`} fill="none" stroke="#B9855A" strokeWidth="2.5" />
      {Array.from({ length: n }, (_, i) => {
        const x = ((i + 0.5) / n) * w;
        const y = sag(x);
        return i % 2 === 0 ? (
          <polygon key={i} points={`${x - 9},${y} ${x + 9},${y} ${x},${y + h - 8}`} fill={colors[(i / 2) % 3]} {...LINE} />
        ) : (
          // 도토리
          <g key={i}>
            <ellipse cx={x} cy={y + 12} rx="6" ry="8" fill="#B9855A" {...LINE} />
            <path d={`M${x - 7} ${y + 7} Q${x} ${y} ${x + 7} ${y + 7} Z`} fill="#8F613C" />
          </g>
        );
      })}
    </g>
  );
}

export default function WallPlaceholder({ def, w, h }: { def: FurnitureDef; w: number; h: number }) {
  switch (def.placeholder.shape) {
    case 'garland':
      return <Garland w={w} h={h} />;
    case 'starFrame':
      return <StarryFrame w={w} h={h} />;
    default:
      return <LeafFrame w={w} h={h} />;
  }
}
