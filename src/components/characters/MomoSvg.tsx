import Face from './Face';
import type { Expression } from '../../data/characters/characters';

// 모모: 모험을 좋아하는 다람쥐. 머리 위까지 말려 올라간 큰 꼬리, 세이지색 스카프, 도토리 모자가 상징.
const C = {
  line: '#6B5444',
  fur: '#D9A066',
  cream: '#FBEBD3',
  tail: '#C98E55',
  tailLight: '#E2B27E',
  scarf: '#A8C3A0',
  scarfDark: '#7FA077',
  pink: '#F3C6D2',
  cap: '#8F613C',
};

export default function MomoSvg({ expression }: { expression: Expression }) {
  return (
    <svg viewBox="0 0 120 150" className="h-full w-full overflow-visible" aria-hidden="true">
      <g filter="url(#wc-small)">
        <g stroke={C.line} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
          {/* 큰 꼬리: 몸 뒤에서 머리 위까지 S 자로 */}
          <path d="M74 140 C110 140 122 104 110 72 C102 50 108 30 96 18 C86 10 72 16 76 28 C84 30 90 38 88 50 C86 66 94 80 94 98 C94 116 86 124 72 126 Z" fill={C.tail} />
          <path d="M80 26 C90 30 96 40 94 54 C92 68 102 82 102 100 C102 116 94 128 82 132" fill="none" stroke={C.tailLight} strokeWidth="6" opacity="0.8" />
          {/* 몸 */}
          <ellipse cx="56" cy="122" rx="24" ry="22" fill={C.fur} />
          <ellipse cx="56" cy="122" rx="24" ry="22" fill="url(#wc-ball)" stroke="none" />
          <ellipse cx="56" cy="126" rx="13" ry="14" fill={C.cream} />
          {/* 뾰족한 귀 + 털 뭉치 */}
          <path d="M34 54 L30 24 L52 42 Z" fill={C.fur} />
          <path d="M86 54 L90 24 L68 42 Z" fill={C.fur} />
          <path d="M36 48 L34 32 L46 42 Z" fill={C.pink} stroke="none" opacity="0.8" />
          <path d="M84 48 L86 32 L74 42 Z" fill={C.pink} stroke="none" opacity="0.8" />
          <path d="M30 24 l-4 -6 M30 24 l1 -7 M90 24 l4 -6 M90 24 l-1 -7" />
          {/* 머리 */}
          <circle cx="60" cy="72" r="33" fill={C.fur} />
          <circle cx="60" cy="72" r="33" fill="url(#wc-ball)" stroke="none" />
          <ellipse cx="60" cy="83" rx="22" ry="16" fill={C.cream} />
          {/* 도토리 모자 (비스듬히) */}
          <g transform="rotate(-14 52 40)">
            <path d="M36 44 C36 32 46 28 54 28 C62 28 70 32 70 44 C60 47 46 47 36 44 Z" fill={C.cap} />
            <path d="M41 36 L47 44 M49 32 L55 44 M58 31 L63 43" stroke="#6B4A2E" strokeWidth="1" opacity="0.6" />
            <path d="M53 28 C53 24 55 22 57 21" fill="none" strokeWidth="2.4" />
          </g>
          {/* 세이지색 스카프 */}
          <path d="M31 100 Q60 113 89 100 L87 109 Q60 121 33 109 Z" fill={C.scarf} />
          <path d="M72 109 L82 130 L71 128 L66 111 Z" fill={C.scarfDark} />
          <path d="M40 106 l4 3 M52 109 l3 3 M66 108 l3 3" stroke={C.scarfDark} strokeWidth="1.4" />
          {expression === 'cheer' ? (
            <>
              <ellipse cx="92" cy="96" rx="7" ry="8" fill={C.fur} />
              <path d="M102 80 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 z" fill="#FFF0B8" strokeWidth="1.3" />
              <ellipse cx="36" cy="118" rx="6" ry="5" fill={C.fur} />
            </>
          ) : expression === 'thinking' ? (
            <ellipse cx="72" cy="98" rx="7" ry="6" fill={C.fur} />
          ) : (
            <>
              <ellipse cx="36" cy="118" rx="6" ry="5" fill={C.fur} />
              <ellipse cx="76" cy="118" rx="6" ry="5" fill={C.fur} />
            </>
          )}
          <ellipse cx="45" cy="143" rx="9" ry="4.5" fill={C.tail} />
          <ellipse cx="67" cy="143" rx="9" ry="4.5" fill={C.tail} />
        </g>
        <ellipse cx="38" cy="81" rx="6.5" ry="4" fill={C.pink} opacity="0.85" />
        <ellipse cx="82" cy="81" rx="6.5" ry="4" fill={C.pink} opacity="0.85" />
        <path d="M56.5 76 Q60 74 63.5 76 Q60 80.5 56.5 76 Z" fill="#B5766A" stroke={C.line} strokeWidth="1" />
        <Face expression={expression} />
        {expression === 'thinking' && (
          <g fill={C.cream} stroke={C.line} strokeWidth="1.6">
            <circle cx="22" cy="50" r="3" />
            <circle cx="15" cy="40" r="4.5" />
            <circle cx="9" cy="27" r="6.5" />
          </g>
        )}
      </g>
    </svg>
  );
}
