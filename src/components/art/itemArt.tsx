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

const Bee = () => (
  <g>
    <Shadow rx={14} />
    <ellipse cx="22" cy="22" rx="9" ry="12" fill="#E4F1F6" {...L} transform="rotate(-25 22 22)" opacity="0.9" />
    <ellipse cx="40" cy="20" rx="9" ry="12" fill="#E4F1F6" {...L} transform="rotate(25 40 20)" opacity="0.9" />
    <ellipse cx="32" cy="38" rx="17" ry="13" fill="#F2CF5B" {...L} />
    <path d="M26 26 C24 32 24 44 26 50 M35 25 C33 32 33 44 35 51" stroke="#6B5444" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    <circle cx="44" cy="35" r="2.2" fill="#59483C" />
    <path d="M49 38 l5 1" stroke="#6B5444" strokeWidth="1.6" strokeLinecap="round" />
    <Shine cx={22} cy={33} rx={4} ry={2.5} />
  </g>
);

const Sunflower = () => (
  <g>
    <Shadow rx={12} />
    <path d="M32 36 C31 44 33 50 32 56" fill="none" stroke="#7FA077" strokeWidth="3" strokeLinecap="round" />
    <path d="M32 48 C26 44 22 46 21 48 C25 51 29 51 32 48 Z" fill="#A8C3A0" {...L} strokeWidth={1.2} />
    {Array.from({ length: 12 }, (_, i) => i * 30).map((a) => (
      <ellipse key={a} cx="32" cy="12" rx="4.5" ry="9" fill="#F2CF5B" {...L} strokeWidth={1.1} transform={`rotate(${a} 32 25)`} />
    ))}
    <circle cx="32" cy="25" r="8.5" fill="#8C6B52" {...L} />
    <circle cx="30" cy="23" r="1.2" fill="#B9855A" />
    <circle cx="34" cy="27" r="1.2" fill="#B9855A" />
  </g>
);

const Snail = () => (
  <g>
    <Shadow rx={20} />
    <path d="M8 52 C8 46 14 44 22 44 L50 44 C56 44 58 48 56 52 Z" fill="#E8D9BF" {...L} />
    <path d="M50 44 C50 38 52 32 54 30 M54 44 C55 39 57 35 59 34" fill="none" {...L} />
    <circle cx="54" cy="29" r="2" fill="#6B5444" />
    <circle cx="59" cy="33" r="2" fill="#6B5444" />
    <circle cx="30" cy="34" r="15" fill="#F5D0AD" {...L} />
    <path d="M30 34 m-9 0 a9 9 0 1 1 9 9 a6 6 0 1 1 -6 -6 a3 3 0 1 1 3 3" fill="none" stroke="#B9855A" strokeWidth="2" />
    <Shine cx={22} cy={26} rx={4} ry={2.5} />
  </g>
);

const Cloud = () => (
  <g>
    <path d="M14 46 C6 46 6 34 14 33 C14 24 26 20 31 27 C35 18 50 20 50 31 C58 31 59 46 50 46 Z" fill="#FFFFFF" {...L} />
    <path d="M18 36 C20 31 25 29 29 31" fill="none" stroke="#E4F1F6" strokeWidth="3" strokeLinecap="round" />
    <circle cx="26" cy="40" r="1.6" fill="#59483C" />
    <circle cx="38" cy="40" r="1.6" fill="#59483C" />
    <path d="M30 43 q2 2 4 0" fill="none" stroke="#6B5444" strokeWidth="1.3" strokeLinecap="round" />
    <ellipse cx="22" cy="43" rx="2.4" ry="1.4" fill="#F3C6D2" />
    <ellipse cx="42" cy="43" rx="2.4" ry="1.4" fill="#F3C6D2" />
  </g>
);

const SunflowerSeed = () => (
  <g>
    <Shadow rx={16} />
    {[[-10, 0, -20], [10, 2, 20], [0, -6, 0]].map(([dx, dy, rot]) => (
      <g key={`${dx}`} transform={`translate(${32 + dx} ${34 + dy}) rotate(${rot})`}>
        <path d="M0 -15 C8 -10 8 10 0 15 C-8 10 -8 -10 0 -15 Z" fill="#6B5444" {...L} />
        <path d="M0 -12 L0 12 M-3 -8 L-3 8 M3 -8 L3 8" stroke="#E8D9BF" strokeWidth="1.2" opacity="0.8" />
      </g>
    ))}
  </g>
);

const Honey = () => (
  <g>
    <Shadow rx={16} />
    <path d="M18 24 C18 20 46 20 46 24 L48 48 C48 54 16 54 16 48 Z" fill="#F2B84B" {...L} />
    <path d="M16 22 C16 16 48 16 48 22 C48 26 16 26 16 22 Z" fill="#E8D9BF" {...L} />
    <path d="M24 26 C24 34 22 36 22 40 M24 26 C26 32 28 33 28 36" fill="none" stroke="#F7D58A" strokeWidth="3" strokeLinecap="round" />
    <Shine cx={22} cy={38} rx={3} ry={6} rot={0} />
    <path d="M30 34 l3 -5 l6 0 l3 5 l-3 5 l-6 0 z" fill="none" stroke="#B98A3A" strokeWidth="1.4" />
  </g>
);

const Kite = () => (
  <g>
    <path d="M32 6 L50 26 L32 44 L14 26 Z" fill="#F3C6D2" {...L} />
    <path d="M32 6 L32 44 M14 26 L50 26" stroke="#6B5444" strokeWidth="1.2" opacity="0.6" />
    <path d="M32 6 L50 26 L32 26 Z" fill="#D9D0EC" opacity="0.8" />
    <path d="M32 26 L32 44 L14 26 Z" fill="#C8DFE8" opacity="0.8" />
    <path d="M32 44 C30 50 36 52 32 58" fill="none" {...L} />
    <path d="M30 50 l-4 -2 l1 4 z M34 55 l4 -2 l-1 4 z" fill="#F5D0AD" {...L} strokeWidth={1} />
  </g>
);

const Windmill = () => (
  <g>
    <Shadow rx={14} />
    <path d="M26 58 L28 30 L36 30 L38 58 Z" fill="#FBF1DF" {...L} />
    <path d="M30 58 V50 C30 47 34 47 34 50 V58 Z" fill="#B9855A" {...L} strokeWidth={1.2} />
    {[0, 90, 180, 270].map((a) => (
      <path key={a} d="M32 26 L34 8 L42 10 Z" fill={a % 180 ? '#C8DFE8' : '#F5D0AD'} {...L} strokeWidth={1.3} transform={`rotate(${a} 32 26)`} />
    ))}
    <circle cx="32" cy="26" r="3" fill="#B9855A" {...L} strokeWidth={1.2} />
  </g>
);

const Dandelion = () => (
  <g>
    <Shadow rx={10} />
    <path d="M32 30 C33 40 31 48 32 57" fill="none" stroke="#7FA077" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M32 48 C26 46 22 48 21 50 C25 52 29 52 32 48 Z" fill="#A8C3A0" {...L} strokeWidth={1.1} />
    {Array.from({ length: 14 }, (_, i) => (i * 360) / 14).map((a) => (
      <g key={a} transform={`rotate(${a} 32 22)`}>
        <path d="M32 22 L32 9" stroke="#C9C3B6" strokeWidth="1" />
        <circle cx="32" cy="8" r="2.4" fill="#FFFFFF" stroke="#C9C3B6" strokeWidth="0.8" />
      </g>
    ))}
    <circle cx="32" cy="22" r="3" fill="#E8D9BF" {...L} strokeWidth={1} />
  </g>
);

const Bird = () => (
  <g>
    <Shadow rx={14} />
    <path d="M14 38 C14 26 24 18 34 20 C44 22 50 30 48 40 C46 50 34 54 24 52 C18 50 14 44 14 38 Z" fill="#C8DFE8" {...L} />
    <path d="M22 36 C28 32 36 34 40 42 C32 44 26 42 22 36 Z" fill="#A9C6D6" {...L} strokeWidth={1.2} />
    <path d="M46 30 L56 32 L47 36 Z" fill="#F5D0AD" {...L} strokeWidth={1.2} />
    <circle cx="40" cy="29" r="2.2" fill="#59483C" />
    <ellipse cx="38" cy="35" rx="2.6" ry="1.5" fill="#F3C6D2" />
    <path d="M14 38 L6 34 L8 42 Z" fill="#A9C6D6" {...L} strokeWidth={1.2} />
    <path d="M28 52 l-2 6 M34 52 l1 6" stroke="#E9A05A" strokeWidth="2" strokeLinecap="round" />
    <Shine cx={24} cy={28} rx={4} ry={2.5} />
  </g>
);

const Feather = () => (
  <g>
    <Shadow rx={14} />
    <path d="M14 54 C18 34 30 16 50 8 C50 26 38 46 18 52 Z" fill="#F3C6D2" {...L} />
    <path d="M14 56 C24 40 36 24 48 10" fill="none" stroke="#B5766A" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M24 42 L32 40 M28 36 L37 33 M33 29 L42 24 M22 46 L18 40 M27 38 L23 31 M33 31 L30 24" stroke="#E79BB0" strokeWidth="1.1" />
  </g>
);

const CloudCotton = () => (
  <g>
    <Shadow rx={18} />
    <path d="M14 48 C6 48 6 36 14 35 C14 26 26 22 31 29 C35 20 50 22 50 33 C58 33 59 48 50 48 Z" fill="#FFFFFF" {...L} />
    <path d="M18 38 C20 33 25 31 29 33" fill="none" stroke="#D9D0EC" strokeWidth="3" strokeLinecap="round" />
    <path d="M50 12 l1.4 3.4 l3.4 1.4 l-3.4 1.4 l-1.4 3.4 l-1.4 -3.4 l-3.4 -1.4 l3.4 -1.4 z" fill="#FFF0B8" {...L} strokeWidth={0.9} />
  </g>
);

const Fish = () => (
  <g>
    <Shadow rx={16} />
    <path d="M10 34 C16 22 34 20 44 32 C34 44 16 44 10 34 Z" fill="#F5D0AD" {...L} />
    <path d="M44 32 L56 22 L54 34 L56 46 Z" fill="#E9A08C" {...L} />
    <path d="M24 26 C28 22 32 22 34 24 L30 28 Z" fill="#E9A08C" {...L} strokeWidth={1.2} />
    <path d="M28 30 C30 34 30 38 28 40 M34 30 C36 34 36 38 34 40" fill="none" stroke="#E9A08C" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="18" cy="31" r="2.2" fill="#59483C" />
    <Shine cx={20} cy={27} rx={3} ry={2} />
  </g>
);

const Duck = () => (
  <g>
    <Shadow rx={18} />
    <path d="M10 42 C10 32 20 28 30 32 C30 20 38 14 46 18 C52 22 50 30 46 32 C54 36 52 50 36 52 C22 54 10 50 10 42 Z" fill="#FFF0B8" {...L} />
    <path d="M18 40 C24 36 32 38 36 44 C28 46 22 46 18 40 Z" fill="#F2DA8A" {...L} strokeWidth={1.2} />
    <path d="M49 22 L58 24 L49 27 Z" fill="#E9A05A" {...L} strokeWidth={1.2} />
    <circle cx="44" cy="22" r="2" fill="#59483C" />
    <ellipse cx="42" cy="28" rx="2.6" ry="1.6" fill="#F3C6D2" />
    <Shine cx={36} cy={20} rx={3.5} ry={2} />
  </g>
);

const Shell = () => (
  <g>
    <Shadow rx={16} />
    <path d="M10 46 C10 26 22 12 32 12 C42 12 54 26 54 46 C44 52 20 52 10 46 Z" fill="#F7D6DF" {...L} />
    {[-24, -12, 0, 12, 24].map((d) => (
      <path key={d} d={`M32 48 L${32 + d} 16`} stroke="#E79BB0" strokeWidth="1.6" opacity="0.85" />
    ))}
    <path d="M24 48 C26 54 38 54 40 48 Z" fill="#F3C6D2" {...L} strokeWidth={1.2} />
    <Shine cx={22} cy={26} rx={4} ry={2.4} />
  </g>
);

const Lily = () => (
  <g>
    <Shadow rx={20} />
    <ellipse cx="32" cy="50" rx="24" ry="7" fill="#A8C3A0" {...L} />
    <path d="M32 50 L52 46 L50 52 Z" fill="#E8DCC4" />
    {[-60, -30, 0, 30, 60].map((a) => (
      <ellipse key={a} cx="32" cy="30" rx="6" ry="14" fill="#F3C6D2" {...L} strokeWidth={1.3} transform={`rotate(${a} 32 44)`} />
    ))}
    <circle cx="32" cy="40" r="4" fill="#F5D0AD" {...L} strokeWidth={1.2} />
  </g>
);

const LilyPad = () => (
  <g>
    <Shadow rx={20} />
    <path d="M32 34 L56 28 C58 46 46 54 32 54 C16 54 6 46 8 34 C10 20 24 14 36 16 Z" fill="#A8C3A0" {...L} />
    {[200, 240, 280, 320, 160].map((a) => (
      <path key={a} d={`M32 34 L${32 + Math.cos((a * Math.PI) / 180) * 18} ${34 - Math.sin((a * Math.PI) / 180) * 16}`} stroke="#7FA077" strokeWidth="1.4" />
    ))}
    <circle cx="22" cy="26" r="2" fill="#FFFFFF" opacity="0.8" />
  </g>
);

const Pearl = () => (
  <g>
    <Shadow rx={14} />
    <circle cx="32" cy="34" r="16" fill="#F1E9F7" {...L} />
    <circle cx="32" cy="34" r="16" fill="url(#wc-ball)" />
    <Shine cx={26} cy={27} rx={5} ry={3.5} />
    <path d="M50 14 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2 z" fill="#FFF0B8" {...L} strokeWidth={0.9} />
  </g>
);

export const ITEM_ART: Record<string, () => ReactElement> = {
  'items/fish.png': Fish,
  'items/duck.png': Duck,
  'items/shell.png': Shell,
  'items/lily.png': Lily,
  'items/res-lily-pad.png': LilyPad,
  'items/res-pearl.png': Pearl,
  'items/kite.png': Kite,
  'items/windmill.png': Windmill,
  'items/dandelion.png': Dandelion,
  'items/bird.png': Bird,
  'items/res-feather.png': Feather,
  'items/res-cloud-cotton.png': CloudCotton,
  'items/bee.png': Bee,
  'items/sunflower.png': Sunflower,
  'items/snail.png': Snail,
  'items/cloud.png': Cloud,
  'items/res-sunflower-seed.png': SunflowerSeed,
  'items/res-honey.png': Honey,
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
