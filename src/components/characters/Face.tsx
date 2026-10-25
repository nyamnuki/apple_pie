import type { Expression } from '../../data/characters/characters';

const LINE = '#59483C';

// 눈과 입 — 루루·도토·모모가 같이 쓴다 (머리 가운데가 (60, 72) 근처인 그림 기준)
export default function Face({ expression }: { expression: Expression }) {
  const line = { stroke: LINE, strokeWidth: 3, strokeLinecap: 'round' as const, fill: 'none' };
  switch (expression) {
    case 'happy':
    case 'cheer':
      return (
        <g>
          {/* 웃는 눈 ^^ */}
          <path d="M42 68 Q47 61 52 68" {...line} />
          <path d="M68 68 Q73 61 78 68" {...line} />
          {/* 활짝 웃는 입 */}
          <path d="M52 84 Q60 94 68 84 Z" fill="#E79BB0" stroke={LINE} strokeWidth="2.5" strokeLinejoin="round" />
        </g>
      );
    case 'thinking':
      return (
        <g>
          {/* 위를 바라보는 눈 */}
          <circle cx="49" cy="64" r="5" fill={LINE} />
          <circle cx="73" cy="64" r="5" fill={LINE} />
          <circle cx="50.5" cy="62" r="1.6" fill="#fff" />
          <circle cx="74.5" cy="62" r="1.6" fill="#fff" />
          <path d="M55 86 Q60 84 65 86" {...line} strokeWidth={2.5} />
        </g>
      );
    case 'surprised':
      return (
        <g>
          {/* 동그랗게 커진 눈 + 올라간 눈썹 + 오 하는 입 */}
          <path d="M40 54 Q47 50 53 54" {...line} strokeWidth={2.5} />
          <path d="M67 54 Q73 50 80 54" {...line} strokeWidth={2.5} />
          <circle cx="47" cy="66" r="6.5" fill={LINE} />
          <circle cx="73" cy="66" r="6.5" fill={LINE} />
          <circle cx="49" cy="63.5" r="2.2" fill="#fff" />
          <circle cx="75" cy="63.5" r="2.2" fill="#fff" />
          <ellipse cx="60" cy="88" rx="4.5" ry="5.5" fill="#E79BB0" stroke={LINE} strokeWidth="2.5" />
        </g>
      );
    default:
      return (
        <g>
          {/* 둥근 눈 + 토끼 입 */}
          <circle cx="47" cy="68" r="5" fill={LINE} />
          <circle cx="73" cy="68" r="5" fill={LINE} />
          <circle cx="48.5" cy="66" r="1.6" fill="#fff" />
          <circle cx="74.5" cy="66" r="1.6" fill="#fff" />
          <path d="M54 83 Q57 86 60 83 Q63 86 66 83" {...line} strokeWidth={2.5} />
        </g>
      );
  }
}
