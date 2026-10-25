import type { Expression } from '../../data/characters/characters';

// 루루: 크림색 토끼, 잎사귀 망토, 귀에 작은 꽃, 둥근 눈과 분홍 볼.
// 그림 파일이 없을 때 쓰는 그림. 표정에 따라 눈·입·손이 바뀐다.
const C = {
  fur: '#FFF6E6',
  line: '#59483C',
  pink: '#F3C6D2',
  leaf: '#A8C3A0',
  vein: '#7FA077',
  petal: '#F3C6D2',
  center: '#F5D0AD',
};

export default function LuluSvg({ expression }: { expression: Expression }) {
  return (
    <svg viewBox="0 0 120 150" className="h-full w-full overflow-visible" aria-hidden="true">
      <g stroke={C.line} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* 잎사귀 망토 (몸 뒤) */}
        <path d="M60 92 C30 96 22 124 28 142 C44 134 52 140 60 146 C68 140 76 134 92 142 C98 124 90 96 60 92 Z" fill={C.leaf} />
        <path d="M60 98 L60 140 M60 112 L44 124 M60 112 L76 124" fill="none" stroke={C.vein} strokeWidth="2" />
        {/* 귀 */}
        <g>
          <ellipse cx="44" cy="30" rx="10" ry="26" fill={C.fur} transform="rotate(-10 44 30)" />
          <ellipse cx="44" cy="32" rx="5" ry="18" fill={C.pink} stroke="none" transform="rotate(-10 44 32)" />
          <ellipse cx="78" cy="32" rx="10" ry="26" fill={C.fur} transform="rotate(14 78 32)" />
          <ellipse cx="78" cy="34" rx="5" ry="18" fill={C.pink} stroke="none" transform="rotate(14 78 34)" />
        </g>
        {/* 몸 */}
        <ellipse cx="60" cy="122" rx="24" ry="22" fill={C.fur} />
        {/* 머리 */}
        <circle cx="60" cy="72" r="34" fill={C.fur} />
        {/* 망토 깃 (목 앞 잎사귀 두 장) */}
        <path d="M60 104 C52 100 44 102 40 108 C48 112 56 110 60 104 Z" fill={C.leaf} />
        <path d="M60 104 C68 100 76 102 80 108 C72 112 64 110 60 104 Z" fill={C.leaf} />
        {/* 귀에 꽃 */}
        <g transform="translate(84 14)">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-6" rx="4.5" ry="6" fill={C.petal} strokeWidth="1.5" transform={`rotate(${a})`} />
          ))}
          <circle r="3.5" fill={C.center} strokeWidth="1.5" />
        </g>
        {/* 손 */}
        {expression === 'cheer' ? (
          <>
            {/* 응원: 한 손을 번쩍 들고 반짝 */}
            <ellipse cx="94" cy="98" rx="7" ry="8" fill={C.fur} />
            <path d="M104 82 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 z" fill={C.center} strokeWidth="1.5" />
            <ellipse cx="39" cy="118" rx="6" ry="5" fill={C.fur} />
          </>
        ) : expression === 'thinking' ? (
          // 생각 중: 한 손을 턱에
          <ellipse cx="72" cy="100" rx="7" ry="6" fill={C.fur} />
        ) : (
          <>
            {/* 몸 양옆에 작은 앞발 */}
            <ellipse cx="39" cy="118" rx="6" ry="5" fill={C.fur} />
            <ellipse cx="81" cy="118" rx="6" ry="5" fill={C.fur} />
          </>
        )}
      </g>

      {/* 볼 */}
      <ellipse cx="38" cy="82" rx="7" ry="4.5" fill={C.pink} />
      <ellipse cx="82" cy="82" rx="7" ry="4.5" fill={C.pink} />
      {/* 코 */}
      <ellipse cx="60" cy="78" rx="3.5" ry="2.5" fill="#E79BB0" />

      <Face expression={expression} />

      {/* 생각 중: 머리 위 생각 방울 */}
      {expression === 'thinking' && (
        <g fill={C.fur} stroke={C.line} strokeWidth="2">
          <circle cx="100" cy="52" r="3" />
          <circle cx="106" cy="42" r="4.5" />
          <circle cx="112" cy="29" r="6.5" />
        </g>
      )}
    </svg>
  );
}

// 눈과 입
function Face({ expression }: { expression: Expression }) {
  const line = { stroke: C.line, strokeWidth: 3, strokeLinecap: 'round' as const, fill: 'none' };
  switch (expression) {
    case 'happy':
    case 'cheer':
      return (
        <g>
          {/* 웃는 눈 ^^ */}
          <path d="M42 68 Q47 61 52 68" {...line} />
          <path d="M68 68 Q73 61 78 68" {...line} />
          {/* 활짝 웃는 입 */}
          <path d="M52 84 Q60 94 68 84 Z" fill="#E79BB0" stroke={C.line} strokeWidth="2.5" strokeLinejoin="round" />
        </g>
      );
    case 'thinking':
      return (
        <g>
          {/* 위를 바라보는 눈 */}
          <circle cx="49" cy="64" r="5" fill={C.line} />
          <circle cx="73" cy="64" r="5" fill={C.line} />
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
          <circle cx="47" cy="66" r="6.5" fill={C.line} />
          <circle cx="73" cy="66" r="6.5" fill={C.line} />
          <circle cx="49" cy="63.5" r="2.2" fill="#fff" />
          <circle cx="75" cy="63.5" r="2.2" fill="#fff" />
          <ellipse cx="60" cy="88" rx="4.5" ry="5.5" fill="#E79BB0" stroke={C.line} strokeWidth="2.5" />
        </g>
      );
    default:
      return (
        <g>
          {/* 둥근 눈 + 토끼 입 */}
          <circle cx="47" cy="68" r="5" fill={C.line} />
          <circle cx="73" cy="68" r="5" fill={C.line} />
          <circle cx="48.5" cy="66" r="1.6" fill="#fff" />
          <circle cx="74.5" cy="66" r="1.6" fill="#fff" />
          <path d="M54 83 Q57 86 60 83 Q63 86 66 83" {...line} strokeWidth={2.5} />
        </g>
      );
  }
}
