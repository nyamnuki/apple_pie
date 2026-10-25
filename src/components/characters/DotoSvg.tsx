import Face from './Face';
import type { Expression } from '../../data/characters/characters';

// 도토: 동그란 고슴도치. 공방 주인이라 생각이 깊다 → 동그란 안경, 도토리 가방이 상징.
const C = {
  line: '#6B5444',
  spines: '#9C7353',
  spinesLight: '#B98E68',
  face: '#F6E6CD',
  body: '#EAD2AE',
  acorn: '#C79461',
  cap: '#8F613C',
  strap: '#A8C3A0',
  pink: '#F3C6D2',
  glass: '#8C6B52',
};

export default function DotoSvg({ expression }: { expression: Expression }) {
  // 가시: 두 겹 (뒤는 진하게, 앞은 밝게) — 붓으로 콕콕 찍은 느낌
  const ring = (r1: number, r2: number, n: number, offset: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = Math.PI * (0.92 + (i / (n - 1)) * 1.16) + offset;
      const a2 = a + Math.PI / (n * 2);
      return `${60 + Math.cos(a) * r1},${70 + Math.sin(a) * r1} ${60 + Math.cos(a2) * r2},${70 + Math.sin(a2) * r2}`;
    }).join(' ');
  return (
    <svg viewBox="0 0 120 150" className="h-full w-full overflow-visible" aria-hidden="true">
      <g filter="url(#wc-small)">
        <g stroke={C.line} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
          {/* 도토리 가방 (몸 뒤 오른쪽) */}
          <ellipse cx="91" cy="118" rx="16" ry="19" fill={C.acorn} />
          <ellipse cx="91" cy="118" rx="16" ry="19" fill="url(#wc-ball)" stroke="none" />
          <path d="M74 108 Q91 92 108 108 Q91 114 74 108 Z" fill={C.cap} />
          <path d="M80 103 L86 109 M88 99 L94 108 M97 101 L101 106" stroke="#6B4A2E" strokeWidth="1" opacity="0.6" />
          <path d="M91 96 l2 -7" />
          {/* 가시 두 겹 */}
          <polygon points={`20,94 ${ring(32, 50, 12, 0)} 100,94`} fill={C.spines} />
          <polygon points={`26,90 ${ring(30, 42, 11, 0.12)} 94,90`} fill={C.spinesLight} stroke="none" opacity="0.8" />
          {/* 몸 */}
          <ellipse cx="58" cy="122" rx="25" ry="22" fill={C.body} />
          <ellipse cx="58" cy="122" rx="25" ry="22" fill="url(#wc-ball)" stroke="none" />
          {/* 가방 끈 */}
          <path d="M42 102 L78 138" stroke={C.strap} strokeWidth="6" />
          <path d="M42 102 L78 138" stroke={C.line} strokeWidth="1" opacity="0.4" strokeDasharray="3 4" />
          {/* 얼굴 */}
          <ellipse cx="60" cy="74" rx="31" ry="29" fill={C.face} />
          <ellipse cx="60" cy="74" rx="31" ry="29" fill="url(#wc-ball)" stroke="none" />
          <circle cx="35" cy="51" r="6" fill={C.face} />
          <circle cx="85" cy="51" r="6" fill={C.face} />
          <circle cx="35" cy="51" r="2.8" fill={C.pink} stroke="none" />
          <circle cx="85" cy="51" r="2.8" fill={C.pink} stroke="none" />
          {expression === 'cheer' ? (
            <>
              <ellipse cx="92" cy="96" rx="7" ry="8" fill={C.face} />
              <path d="M102 80 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 z" fill="#FFF0B8" strokeWidth="1.3" />
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
          <ellipse cx="47" cy="143" rx="9" ry="4.5" fill={C.spines} />
          <ellipse cx="70" cy="143" rx="9" ry="4.5" fill={C.spines} />
        </g>
        <ellipse cx="37" cy="83" rx="6.5" ry="4" fill={C.pink} opacity="0.85" />
        <ellipse cx="83" cy="83" rx="6.5" ry="4" fill={C.pink} opacity="0.85" />
        <circle cx="60" cy="78" r="4" fill="#6B5444" />
        <circle cx="58.8" cy="76.8" r="1.2" fill="#fff" opacity="0.8" />
        <Face expression={expression} />
        {/* 동그란 안경 (도토의 상징) */}
        <g fill="none" stroke={C.glass} strokeWidth="1.8">
          <circle cx="47" cy="67" r="9.5" />
          <circle cx="73" cy="67" r="9.5" />
          <path d="M56.5 66 Q60 63.5 63.5 66 M37.5 66 L31 62 M82.5 66 L89 62" />
        </g>
        <path d="M41 61 l4 -2" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        {expression === 'thinking' && (
          <g fill={C.face} stroke={C.line} strokeWidth="1.6">
            <circle cx="100" cy="50" r="3" />
            <circle cx="106" cy="40" r="4.5" />
            <circle cx="112" cy="27" r="6.5" />
          </g>
        )}
      </g>
    </svg>
  );
}
