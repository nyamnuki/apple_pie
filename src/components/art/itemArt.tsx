import type { ReactElement } from 'react';

// ===== 수학 물건·재료 그림 (수채화 동화책 스타일, 64×64) =====
// 규칙 (docs/ART_BIBLE.md): 빛은 왼쪽 위 → 왼쪽 위에 밝은 물감 자국, 아래에 옅은 그림자.
// 선은 진한 갈색 색연필(#6B5444), 검은 선은 쓰지 않는다. 수채화 효과는 그리는 쪽에서 #wc-small 로 입힌다.
// 키는 그림 파일 경로 (public/assets/ 에 같은 이름의 그림을 넣으면 그 그림이 우선한다).

const L = { stroke: '#6B5444', strokeWidth: 1.6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
const Shadow = ({ rx = 18 }: { rx?: number }) => <ellipse cx="32" cy="58" rx={rx} ry="3.5" fill="#59483C" opacity="0.14" />;
// 왼쪽 위 빛 자국
const Shine = ({ cx, cy, rx = 5, ry = 3, rot = -30 }: { cx: number; cy: number; rx?: number; ry?: number; rot?: number }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#FFFFFF" opacity="0.5" transform={`rotate(${rot} ${cx} ${cy})`} />
);

const Apple = () => (
  <g>
    <Shadow />
    <path d="M32 20 C22 12 9 18 10 33 C11 47 21 57 32 52 C43 57 53 47 54 33 C55 18 42 12 32 20 Z" fill="#E0796B" {...L} />
    <path d="M32 21 C27 30 27 45 32 52" fill="none" stroke="#C96456" strokeWidth="1.2" opacity="0.6" />
    <Shine cx={20} cy={28} rx={6} ry={3.5} />
    <path d="M32 21 C32 15 34 11 37 8" fill="none" {...L} strokeWidth={2.2} stroke="#7A5A3E" />
    <path d="M35 13 C40 6 49 8 50 11 C45 16 38 16 35 13 Z" fill="#A8C3A0" {...L} />
  </g>
);

const Pear = () => (
  <g>
    <Shadow rx={15} />
    <path d="M32 12 C26 12 25 20 24 26 C16 31 12 40 15 48 C18 56 46 56 49 48 C52 40 48 31 40 26 C39 20 38 12 32 12 Z" fill="#CFDB8E" {...L} />
    <Shine cx={22} cy={36} rx={5} ry={3} />
    <circle cx="40" cy="44" r="1" fill="#9BA85C" />
    <circle cx="27" cy="47" r="0.9" fill="#9BA85C" />
    <path d="M32 13 C32 9 33 6 35 4" fill="none" {...L} strokeWidth={2} stroke="#7A5A3E" />
    <path d="M34 9 C38 4 45 6 46 8 C42 12 36 12 34 9 Z" fill="#A8C3A0" {...L} />
  </g>
);

const Mushroom = () => (
  <g>
    <Shadow rx={16} />
    <path d="M24 34 C24 44 22 52 26 55 C30 57 34 57 38 55 C42 52 40 44 40 34 Z" fill="#FBF1DF" {...L} />
    <path d="M8 34 C8 18 22 9 32 9 C42 9 56 18 56 34 C48 37 16 37 8 34 Z" fill="#E0796B" {...L} />
    <Shine cx={20} cy={20} rx={6} ry={3} />
    <circle cx="25" cy="25" r="3.2" fill="#FFF5DF" />
    <circle cx="40" cy="20" r="2.6" fill="#FFF5DF" />
    <circle cx="44" cy="29" r="2.2" fill="#FFF5DF" />
    <circle cx="33" cy="30" r="1.8" fill="#FFF5DF" />
  </g>
);

const AcornShape = ({ nut, cap, sparkle }: { nut: string; cap: string; sparkle?: boolean }) => (
  <g>
    <Shadow rx={14} />
    <path d="M18 28 C18 44 25 55 32 57 C39 55 46 44 46 28 Z" fill={nut} {...L} />
    <Shine cx={24} cy={36} rx={3.5} ry={6} rot={10} />
    <path d="M14 29 C13 19 22 13 32 13 C42 13 51 19 50 29 C42 32 22 32 14 29 Z" fill={cap} {...L} />
    <path d="M19 20 L27 29 M26 16 L35 29 M34 14 L43 28 M43 17 L47 23" stroke="#6B4A2E" strokeWidth="1" opacity="0.55" />
    <path d="M32 13 C32 9 34 6 36 5" fill="none" {...L} strokeWidth={2.2} stroke="#6B4A2E" />
    {sparkle && <path d="M50 8 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 z" fill="#FFF0B8" {...L} strokeWidth={1} />}
  </g>
);
const Acorn = () => <AcornShape nut="#C79461" cap="#8F613C" />;
const GoldenAcorn = () => <AcornShape nut="#EBC35A" cap="#B98A3A" sparkle />;

const Leaf = () => (
  <g>
    <Shadow rx={15} />
    <path d="M10 50 C10 26 26 10 54 10 C54 36 38 52 10 50 Z" fill="#A8C3A0" {...L} />
    <Shine cx={26} cy={26} rx={7} ry={3} rot={-40} />
    <path d="M12 49 C24 38 36 26 50 13" fill="none" stroke="#6F9468" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M24 38 L22 28 M32 30 L31 20 M40 22 L39 15 M24 38 L34 39 M32 30 L42 31" fill="none" stroke="#6F9468" strokeWidth="1.1" opacity="0.8" />
  </g>
);

const Flower = () => (
  <g>
    <Shadow rx={14} />
    <path d="M32 40 C31 48 33 52 32 56" fill="none" stroke="#7FA077" strokeWidth="2.5" strokeLinecap="round" />
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx="32" cy="15" rx="8" ry="11" fill="#F3C6D2" {...L} transform={`rotate(${a} 32 27)`} />
    ))}
    <circle cx="32" cy="27" r="7" fill="#F5D0AD" {...L} />
    <circle cx="30" cy="25" r="2" fill="#FFFFFF" opacity="0.6" />
  </g>
);

const Butterfly = () => (
  <g>
    <Shadow rx={14} />
    <path d="M31 30 C24 14 8 10 7 20 C6 30 18 34 30 33 Z" fill="#D9D0EC" {...L} />
    <path d="M33 30 C40 14 56 10 57 20 C58 30 46 34 34 33 Z" fill="#D9D0EC" {...L} />
    <path d="M30 34 C20 36 12 44 18 50 C24 54 30 44 31 37 Z" fill="#F3C6D2" {...L} />
    <path d="M34 34 C44 36 52 44 46 50 C40 54 34 44 33 37 Z" fill="#F3C6D2" {...L} />
    <circle cx="17" cy="21" r="3" fill="#F5D0AD" />
    <circle cx="47" cy="21" r="3" fill="#F5D0AD" />
    <ellipse cx="32" cy="34" rx="2.6" ry="12" fill="#8C6B52" {...L} />
    <path d="M31 22 C29 16 26 13 24 12 M33 22 C35 16 38 13 40 12" fill="none" {...L} />
  </g>
);

const Ladybug = () => (
  <g>
    <Shadow rx={17} />
    <circle cx="32" cy="17" r="8" fill="#6B5444" {...L} />
    <path d="M28 11 C24 6 21 6 19 7 M36 11 C40 6 43 6 45 7" fill="none" {...L} />
    <ellipse cx="32" cy="36" rx="19" ry="18" fill="#E0796B" {...L} />
    <path d="M32 19 L32 54" stroke="#6B5444" strokeWidth="1.6" />
    <Shine cx={22} cy={28} rx={5} ry={3} />
    {[[23, 36, 3.5], [41, 36, 3.5], [26, 46, 2.8], [38, 46, 2.8], [39, 27, 2.4]].map(([x, y, r]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#6B5444" />
    ))}
  </g>
);

const Frog = () => (
  <g>
    <Shadow rx={19} />
    <ellipse cx="32" cy="40" rx="21" ry="15" fill="#9DBF86" {...L} />
    <circle cx="21" cy="22" r="8" fill="#9DBF86" {...L} />
    <circle cx="43" cy="22" r="8" fill="#9DBF86" {...L} />
    <circle cx="21" cy="22" r="4.5" fill="#FFF5DF" />
    <circle cx="43" cy="22" r="4.5" fill="#FFF5DF" />
    <circle cx="22" cy="22" r="2.4" fill="#59483C" />
    <circle cx="44" cy="22" r="2.4" fill="#59483C" />
    <path d="M22 40 Q32 47 42 40" fill="none" {...L} />
    <ellipse cx="18" cy="38" rx="3.5" ry="2" fill="#F3C6D2" />
    <ellipse cx="46" cy="38" rx="3.5" ry="2" fill="#F3C6D2" />
    <ellipse cx="32" cy="47" rx="10" ry="5" fill="#D5E4C8" opacity="0.8" />
    <Shine cx={18} cy={32} rx={4} ry={2.5} />
  </g>
);

const Blueberry = () => (
  <g>
    <Shadow rx={17} />
    <circle cx="32" cy="36" r="20" fill="#7D8BC0" {...L} />
    <Shine cx={22} cy={27} rx={6} ry={3.5} />
    <path d="M25 22 L29 25 L32 20 L35 25 L39 22 L37 28 L27 28 Z" fill="#59608A" {...L} strokeWidth={1.2} />
  </g>
);

const Cookie = () => (
  <g>
    <Shadow rx={19} />
    <path d="M32 12 C44 11 53 21 52 33 C51 46 42 54 31 53 C19 53 11 44 12 32 C13 20 21 12 32 12 Z" fill="#DDAF77" {...L} />
    <Shine cx={22} cy={22} rx={6} ry={3} />
    {[[24, 28], [38, 22], [40, 38], [27, 42], [33, 33], [45, 30]].map(([x, y]) => (
      <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="2.6" ry="2.1" fill="#7A5236" />
    ))}
  </g>
);

const Moon = () => (
  <g>
    <Shadow rx={13} />
    <path d="M40 8 C24 9 14 21 14 34 C14 47 25 57 39 56 C30 50 25 42 25 32 C25 21 31 12 40 8 Z" fill="#F4D98C" {...L} />
    <Shine cx={21} cy={26} rx={3} ry={6} rot={15} />
    <circle cx="20" cy="40" r="1.8" fill="#E3C26B" />
    <path d="M47 18 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2 z" fill="#FFF0B8" {...L} strokeWidth={0.9} />
  </g>
);

const Star = () => (
  <g>
    <Shadow rx={16} />
    <path d="M32 7 C34 16 37 20 45 21 C52 22 55 24 49 30 C44 35 44 39 46 47 C48 55 45 55 38 51 C33 48 31 48 26 51 C19 55 16 55 18 47 C20 39 20 35 15 30 C9 24 12 22 19 21 C27 20 30 16 32 7 Z" fill="#F2CF5B" {...L} />
    <Shine cx={25} cy={26} rx={4} ry={2.5} />
  </g>
);

const Owl = () => (
  <g>
    <Shadow rx={15} />
    <path d="M14 22 L18 10 L25 17 C29 15 35 15 39 17 L46 10 L50 22 C54 32 52 50 32 56 C12 50 10 32 14 22 Z" fill="#B48A64" {...L} />
    <ellipse cx="32" cy="42" rx="11" ry="11" fill="#F1DCC0" />
    <path d="M26 40 q3 2 6 0 q3 2 6 0 M27 46 q2.5 2 5 0 q2.5 2 5 0" fill="none" stroke="#B48A64" strokeWidth="1.1" />
    <circle cx="24" cy="26" r="7" fill="#FFF5DF" {...L} />
    <circle cx="40" cy="26" r="7" fill="#FFF5DF" {...L} />
    <circle cx="25" cy="26" r="3.3" fill="#59483C" />
    <circle cx="41" cy="26" r="3.3" fill="#59483C" />
    <circle cx="26" cy="24.8" r="1" fill="#fff" />
    <circle cx="42" cy="24.8" r="1" fill="#fff" />
    <path d="M30 31 L32 35 L34 31 Z" fill="#F5D0AD" {...L} strokeWidth={1.1} />
  </g>
);

const Gem = () => (
  <g>
    <Shadow rx={16} />
    <path d="M18 14 L46 14 L56 26 L32 56 L8 26 Z" fill="#C8DFE8" {...L} />
    <path d="M8 26 L56 26 M18 14 L24 26 L32 56 M46 14 L40 26 L32 56 M24 26 L32 14 L40 26" fill="none" stroke="#6B5444" strokeWidth="1.1" opacity="0.7" />
    <path d="M18 14 L24 26 L8 26 Z" fill="#E4F1F6" opacity="0.9" />
    <path d="M40 26 L56 26 L32 56 Z" fill="#A9C6D6" opacity="0.8" />
    <path d="M24 26 L40 26 L32 56 Z" fill="#D9D0EC" opacity="0.55" />
  </g>
);

const Pebble = () => (
  <g>
    <Shadow rx={20} />
    <path d="M10 42 C8 30 18 20 32 20 C46 20 56 28 55 40 C54 52 42 55 31 55 C19 55 11 52 10 42 Z" fill="#B7B1A8" {...L} />
    <path d="M14 38 C16 28 25 24 34 24 C26 26 20 30 18 38 Z" fill="#D6D1C9" />
    <ellipse cx="40" cy="44" rx="2" ry="1.2" fill="#9A938A" />
    <ellipse cx="28" cy="48" rx="1.4" ry="1" fill="#9A938A" />
  </g>
);

const Bat = () => (
  <g>
    <Shadow rx={16} />
    <path d="M30 30 C22 18 12 18 4 24 C9 26 10 30 9 34 C14 32 17 34 19 38 C22 34 26 33 30 36 Z" fill="#A59BBE" {...L} />
    <path d="M34 30 C42 18 52 18 60 24 C55 26 54 30 55 34 C50 32 47 34 45 38 C42 34 38 33 34 36 Z" fill="#A59BBE" {...L} />
    <ellipse cx="32" cy="34" rx="8" ry="10" fill="#8C82A8" {...L} />
    <path d="M26 26 L25 19 L30 24 M38 26 L39 19 L34 24" fill="#8C82A8" {...L} />
    <circle cx="29" cy="31" r="1.7" fill="#FFF5DF" />
    <circle cx="35" cy="31" r="1.7" fill="#FFF5DF" />
    <ellipse cx="27" cy="36" rx="2" ry="1.2" fill="#F3C6D2" />
    <ellipse cx="37" cy="36" rx="2" ry="1.2" fill="#F3C6D2" />
  </g>
);

const Candle = () => (
  <g>
    <Shadow rx={14} />
    <circle cx="32" cy="14" r="10" fill="#FFF0B8" opacity="0.55" />
    <path d="M32 6 C37 12 37 18 32 21 C27 18 27 12 32 6 Z" fill="#F5C77E" {...L} strokeWidth={1.2} />
    <path d="M32 12 C34 15 34 18 32 19 C30 18 30 15 32 12 Z" fill="#FFF5DF" />
    <path d="M32 21 L32 25" stroke="#6B5444" strokeWidth="1.6" />
    <path d="M23 25 L41 25 L41 52 C41 55 23 55 23 52 Z" fill="#FBF1DF" {...L} />
    <path d="M27 25 C27 30 29 31 29 34" fill="none" stroke="#E8D9BF" strokeWidth="2.2" strokeLinecap="round" />
    <ellipse cx="32" cy="54" rx="14" ry="3.5" fill="#B9855A" {...L} />
  </g>
);

const GlowBranch = () => (
  <g>
    <Shadow rx={18} />
    <circle cx="40" cy="20" r="14" fill="#FFF0B8" opacity="0.45" />
    <path d="M10 54 C20 44 28 36 46 14" fill="none" stroke="#8C6B52" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M10 54 C20 44 28 36 46 14" fill="none" stroke="#6B5444" strokeWidth="1" opacity="0.6" />
    <path d="M26 40 C20 34 22 26 28 26 C30 32 30 36 26 40 Z" fill="#A8C3A0" {...L} />
    <path d="M36 28 C40 22 48 24 48 28 C44 31 40 31 36 28 Z" fill="#A8C3A0" {...L} />
    {[[46, 12], [52, 20], [38, 14], [22, 30]].map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill="#FFF0B8" {...L} strokeWidth={0.9} />
    ))}
  </g>
);

const MoonDew = () => (
  <g>
    <Shadow rx={13} />
    <path d="M32 8 C38 20 48 30 48 40 C48 50 41 56 32 56 C23 56 16 50 16 40 C16 30 26 20 32 8 Z" fill="#C8DFE8" {...L} />
    <path d="M24 38 C24 32 27 28 30 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
    <path d="M38 38 C33 38 30 42 30 46 C30 50 33 52 37 52 C34 50 33 47 34 44 C35 41 36 39 38 38 Z" fill="#F4D98C" />
  </g>
);

const Crystal = () => (
  <g>
    <Shadow rx={19} />
    <path d="M14 54 L12 34 L18 24 L24 34 L24 54 Z" fill="#D9D0EC" {...L} />
    <path d="M40 54 L40 30 L47 20 L54 30 L52 54 Z" fill="#C8DFE8" {...L} />
    <path d="M22 55 L22 22 L32 8 L42 22 L42 55 Z" fill="#E4F1F6" {...L} />
    <path d="M32 8 L32 55" stroke="#6B5444" strokeWidth="1" opacity="0.5" />
    <path d="M32 9 L42 22 L42 55 L32 55 Z" fill="#A9C6D6" opacity="0.55" />
    <path d="M26 24 L26 40" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
  </g>
);

const Mithril = () => (
  <g>
    <Shadow rx={20} />
    {/* 은빛 잎 모양 덩어리 */}
    <path d="M8 40 L18 26 L46 26 L56 40 L46 50 L18 50 Z" fill="#C9CCD6" {...L} />
    <path d="M18 26 L46 26 L40 34 L24 34 Z" fill="#E6E8EF" />
    <path d="M24 34 L40 34 L46 50 L18 50 Z" fill="#B2B6C4" opacity="0.6" />
    <path d="M26 30 L36 30" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M47 12 l1.4 3.6 l3.6 1.4 l-3.6 1.4 l-1.4 3.6 l-1.4 -3.6 l-3.6 -1.4 l3.6 -1.4 z" fill="#FFFFFF" {...L} strokeWidth={0.9} />
  </g>
);

export const ITEM_ART: Record<string, () => ReactElement> = {
  'items/apple.png': Apple,
  'items/pear.png': Pear,
  'items/mushroom.png': Mushroom,
  'items/acorn.png': Acorn,
  'items/leaf.png': Leaf,
  'items/flower.png': Flower,
  'items/butterfly.png': Butterfly,
  'items/ladybug.png': Ladybug,
  'items/frog.png': Frog,
  'items/blueberry.png': Blueberry,
  'items/cookie.png': Cookie,
  'items/moon.png': Moon,
  'items/star.png': Star,
  'items/owl.png': Owl,
  'items/gem.png': Gem,
  'items/pebble.png': Pebble,
  'items/bat.png': Bat,
  'items/candle.png': Candle,
  // 재료
  'items/res-acorn.png': Acorn,
  'items/res-apple.png': Apple,
  'items/res-golden-acorn.png': GoldenAcorn,
  'items/res-glow-branch.png': GlowBranch,
  'items/res-moon-dew.png': MoonDew,
  'items/res-crystal.png': Crystal,
  'items/res-mithril.png': Mithril,
};

// 그림 하나를 size px 로 (수채화 효과 포함)
export function ItemArt({ path, size }: { path: string; size: number }) {
  const Art = ITEM_ART[path];
  if (!Art) return null;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className="overflow-visible">
      <g filter="url(#wc-small)">
        <Art />
      </g>
    </svg>
  );
}
