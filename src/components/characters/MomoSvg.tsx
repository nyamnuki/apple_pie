import Face from './Face';
import type { Expression } from '../../data/characters/characters';

// 모모: 세이지색 스카프를 두른 다람쥐. 달빛 숲 안내.
const C = { line: '#59483C', fur: '#D9A066', cream: '#FBEBD3', tail: '#C98E55', scarf: '#A8C3A0', scarfDark: '#7FA077', pink: '#F3C6D2' };

export default function MomoSvg({ expression }: { expression: Expression }) {
  return (
    <svg viewBox="0 0 120 150" className="h-full w-full overflow-visible" aria-hidden="true">
      <g stroke={C.line} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* 복슬복슬한 꼬리 (몸 뒤) */}
        <path d="M78 138 C112 136 120 100 104 78 C96 66 84 70 88 82 C100 92 98 116 76 122 Z" fill={C.tail} />
        <path d="M96 84 C104 96 104 112 92 122" fill="none" stroke={C.cream} strokeWidth="3" />
        {/* 몸 */}
        <ellipse cx="58" cy="122" rx="24" ry="22" fill={C.fur} />
        <ellipse cx="58" cy="126" rx="13" ry="14" fill={C.cream} />
        {/* 뾰족한 귀 + 털 */}
        <path d="M34 54 L32 26 L52 44 Z" fill={C.fur} />
        <path d="M86 54 L88 26 L68 44 Z" fill={C.fur} />
        <path d="M32 26 l-3 -6 M88 26 l3 -6" />
        {/* 머리 */}
        <circle cx="60" cy="72" r="33" fill={C.fur} />
        <ellipse cx="60" cy="82" rx="22" ry="17" fill={C.cream} />
        {/* 세이지색 스카프 */}
        <path d="M32 100 Q60 112 88 100 L86 108 Q60 120 34 108 Z" fill={C.scarf} />
        <path d="M74 108 L82 128 L72 126 L68 110 Z" fill={C.scarfDark} />
        {expression === 'cheer' ? (
          <>
            <ellipse cx="94" cy="96" rx="7" ry="8" fill={C.fur} />
            <path d="M104 80 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 z" fill="#F5D0AD" strokeWidth="1.5" />
            <ellipse cx="38" cy="118" rx="6" ry="5" fill={C.fur} />
          </>
        ) : expression === 'thinking' ? (
          <ellipse cx="72" cy="98" rx="7" ry="6" fill={C.fur} />
        ) : (
          <>
            <ellipse cx="38" cy="118" rx="6" ry="5" fill={C.fur} />
            <ellipse cx="78" cy="118" rx="6" ry="5" fill={C.fur} />
          </>
        )}
      </g>
      <ellipse cx="38" cy="80" rx="6.5" ry="4" fill={C.pink} />
      <ellipse cx="82" cy="80" rx="6.5" ry="4" fill={C.pink} />
      <ellipse cx="60" cy="77" rx="3.5" ry="2.5" fill="#B5766A" />
      <Face expression={expression} />
      {expression === 'thinking' && (
        <g fill={C.cream} stroke={C.line} strokeWidth="2">
          <circle cx="100" cy="52" r="3" />
          <circle cx="106" cy="42" r="4.5" />
          <circle cx="112" cy="29" r="6.5" />
        </g>
      )}
    </svg>
  );
}
