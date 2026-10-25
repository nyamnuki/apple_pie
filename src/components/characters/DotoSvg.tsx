import Face from './Face';
import type { Expression } from '../../data/characters/characters';

// 도토: 도토리 가방을 멘 고슴도치. 공방 주인.
const C = { line: '#59483C', spines: '#9C7353', face: '#F5E3C8', body: '#E8CFA8', acorn: '#B9855A', cap: '#8F613C', strap: '#A8C3A0', pink: '#F3C6D2' };

export default function DotoSvg({ expression }: { expression: Expression }) {
  // 등 가시: 머리 뒤를 둘러싼 뾰족한 테두리
  const spikes = Array.from({ length: 11 }, (_, i) => {
    const a = Math.PI * (0.95 + (i / 10) * 1.1); // 왼쪽 아래 → 위 → 오른쪽 아래
    const r1 = 34;
    const r2 = 47;
    const a2 = a + Math.PI / 22;
    return `${60 + Math.cos(a) * r1},${72 + Math.sin(a) * r1} ${60 + Math.cos(a2) * r2},${72 + Math.sin(a2) * r2}`;
  }).join(' ');
  return (
    <svg viewBox="0 0 120 150" className="h-full w-full overflow-visible" aria-hidden="true">
      <g stroke={C.line} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* 도토리 가방 (몸 뒤 오른쪽) */}
        <ellipse cx="90" cy="118" rx="16" ry="19" fill={C.acorn} />
        <path d="M73 108 Q90 92 107 108 Q90 114 73 108 Z" fill={C.cap} />
        <path d="M90 96 l2 -7" />
        {/* 가시 */}
        <polygon points={`22,92 ${spikes} 98,92`} fill={C.spines} />
        {/* 몸 */}
        <ellipse cx="58" cy="122" rx="25" ry="22" fill={C.body} />
        {/* 가방 끈 */}
        <path d="M44 104 L76 136" stroke={C.strap} strokeWidth="6" />
        {/* 얼굴 */}
        <ellipse cx="60" cy="74" rx="31" ry="29" fill={C.face} />
        {/* 작은 귀 */}
        <circle cx="35" cy="52" r="6" fill={C.face} />
        <circle cx="85" cy="52" r="6" fill={C.face} />
        {expression === 'cheer' ? (
          <>
            <ellipse cx="92" cy="96" rx="7" ry="8" fill={C.face} />
            <path d="M102 80 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 z" fill="#F5D0AD" strokeWidth="1.5" />
            <ellipse cx="37" cy="118" rx="6" ry="5" fill={C.face} />
          </>
        ) : expression === 'thinking' ? (
          <ellipse cx="72" cy="100" rx="7" ry="6" fill={C.face} />
        ) : (
          <>
            <ellipse cx="37" cy="118" rx="6" ry="5" fill={C.face} />
            <ellipse cx="79" cy="120" rx="6" ry="5" fill={C.face} />
          </>
        )}
      </g>
      <ellipse cx="38" cy="82" rx="6.5" ry="4" fill={C.pink} />
      <ellipse cx="82" cy="82" rx="6.5" ry="4" fill={C.pink} />
      {/* 동그란 코 */}
      <circle cx="60" cy="78" r="4" fill={C.line} />
      <Face expression={expression} />
      {expression === 'thinking' && (
        <g fill={C.face} stroke={C.line} strokeWidth="2">
          <circle cx="100" cy="52" r="3" />
          <circle cx="106" cy="42" r="4.5" />
          <circle cx="112" cy="29" r="6.5" />
        </g>
      )}
    </svg>
  );
}
