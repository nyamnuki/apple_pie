import type { RegionId } from '../../types/resources';

// 지도에 그리는 마을 풍경 (160×110, 수채화). 잠긴 마을은 안개로 덮는다.
const L = { stroke: '#6B5444', strokeOpacity: 0.55, strokeWidth: 1.8, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function AcornVillage() {
  return (
    <g>
      <path d="M0 92 C30 70 70 74 92 82 C118 70 146 74 160 86 L160 110 L0 110 Z" fill="#C3D8B6" />
      {/* 큰 참나무 */}
      <path d="M118 88 L116 54 L126 54 L124 88 Z" fill="#B9855A" {...L} />
      <path d="M121 10 C142 10 152 28 146 42 C156 50 148 66 132 64 L110 64 C94 66 88 50 98 42 C92 26 102 10 121 10 Z" fill="#A8C3A0" {...L} />
      <path d="M104 30 C108 20 116 16 124 16" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" />
      {/* 도토리 지붕 집 */}
      <path d="M22 94 L22 70 L52 70 L52 94 Z" fill="#FBF1DF" {...L} />
      <path d="M16 72 C16 52 30 44 37 44 C44 44 58 52 58 72 Z" fill="#8F613C" {...L} />
      <path d="M22 60 L52 60 M26 52 L48 52" stroke="#6B4A2E" strokeOpacity="0.5" strokeWidth="1.2" />
      <path d="M32 94 L32 82 C32 77 42 77 42 82 L42 94 Z" fill="#B9855A" {...L} />
      {/* 버섯 집 */}
      <path d="M68 96 L68 78 L86 78 L86 96 Z" fill="#FBF1DF" {...L} />
      <path d="M60 80 C62 64 92 64 94 80 Z" fill="#E0796B" {...L} />
      <circle cx="70" cy="72" r="3" fill="#FFF5DF" />
      <circle cx="84" cy="70" r="2.4" fill="#FFF5DF" />
      <circle cx="77" cy="88" r="3.5" fill="#C8DFE8" {...L} strokeWidth={1.2} />
      {[[12, 100, '#F3C6D2'], [100, 100, '#FFF5DF'], [146, 98, '#F5D0AD']].map(([x, y, c]) => (
        <circle key={`${x}`} cx={x as number} cy={y as number} r="3" fill={c as string} {...L} strokeWidth={1} />
      ))}
    </g>
  );
}

function MoonlightForest() {
  return (
    <g>
      <path d="M0 0 H160 V110 H0 Z" fill="#B9B4D9" opacity="0.55" />
      <circle cx="122" cy="26" r="15" fill="#F4D98C" {...L} />
      <circle cx="129" cy="21" r="13" fill="#C9C3E3" />
      {[[30, 14], [70, 22], [96, 10], [148, 52]].map(([x, y]) => (
        <path key={`${x}`} d={`M${x} ${y - 4} l1.4 3 l3 1.4 l-3 1.4 l-1.4 3 l-1.4 -3 l-3 -1.4 l3 -1.4 z`} fill="#FFF0B8" />
      ))}
      <path d="M0 96 C40 82 110 84 160 94 L160 110 L0 110 Z" fill="#8FAE8A" />
      {/* 밤의 전나무 */}
      {[[26, 96, 1], [58, 100, 1.25], [96, 98, 0.9], [136, 100, 1.1]].map(([x, y, s]) => (
        <g key={`${x}`} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M-3 0 L-3 -10 L3 -10 L3 0 Z" fill="#8C6B52" {...L} strokeWidth={1.2} />
          <path d="M0 -62 L18 -10 L-18 -10 Z" fill="#6F9468" {...L} />
          <path d="M0 -62 L10 -34 L-10 -34 Z" fill="#7FA077" />
        </g>
      ))}
      {[[44, 60], [80, 50], [116, 66]].map(([x, y]) => (
        <circle key={`${x}`} cx={x} cy={y} r="2.6" fill="#FFF0B8" />
      ))}
    </g>
  );
}

function CrystalCave() {
  return (
    <g>
      <path d="M0 98 C40 90 120 90 160 98 L160 110 L0 110 Z" fill="#C3D8B6" />
      {/* 바위 언덕과 동굴 입구 */}
      <path d="M14 100 C14 60 44 22 80 22 C118 22 148 60 148 100 Z" fill="#B7B1A8" {...L} />
      <path d="M30 70 C40 44 60 32 80 30" fill="none" stroke="#D6D1C9" strokeWidth="6" strokeLinecap="round" />
      <path d="M58 100 C58 74 68 62 80 62 C92 62 102 74 102 100 Z" fill="#5E566B" {...L} />
      <path d="M70 100 L72 86 L76 94 L80 80 L84 94 L88 86 L90 100 Z" fill="#C8DFE8" opacity="0.8" />
      {/* 수정 */}
      {[[30, 100, 0.9, '#D9D0EC'], [128, 100, 1.1, '#C8DFE8'], [112, 102, 0.7, '#E4F1F6'], [44, 102, 0.6, '#C8DFE8']].map(([x, y, s, c]) => (
        <g key={`${x}`} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M-7 0 L-7 -20 L0 -32 L7 -20 L7 0 Z" fill={c as string} {...L} />
          <path d="M0 -32 L7 -20 L7 0 L0 0 Z" fill="#A9C6D6" opacity="0.5" />
        </g>
      ))}
    </g>
  );
}

function SunnyMeadow() {
  return (
    <g>
      <path d="M0 0 H160 V110 H0 Z" fill="#FBEFD0" />
      <circle cx="128" cy="24" r="14" fill="#F7DA7A" {...L} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path key={a} d="M128 4 L128 0" stroke="#F2CF5B" strokeWidth="3" strokeLinecap="round" transform={`rotate(${a} 128 24)`} />
      ))}
      <path d="M0 80 C40 66 110 70 160 78 L160 110 L0 110 Z" fill="#C3D8B6" />
      <path d="M0 94 C50 86 110 88 160 96 L160 110 L0 110 Z" fill="#A8C3A0" />
      {/* 해바라기 */}
      {[[26, 92, 1], [52, 88, 1.2], [80, 94, 0.9]].map(([x, y, s]) => (
        <g key={`${x}`} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M0 0 L0 -26" stroke="#7FA077" strokeWidth="2.4" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <ellipse key={a} cx="0" cy="-36" rx="3" ry="6" fill="#F2CF5B" {...L} strokeWidth={1} transform={`rotate(${a} 0 -30)`} />
          ))}
          <circle cx="0" cy="-30" r="5" fill="#8C6B52" {...L} strokeWidth={1} />
        </g>
      ))}
      {/* 벌통 */}
      <g transform="translate(122 98)">
        <path d="M-14 0 C-16 -10 -12 -26 0 -28 C12 -26 16 -10 14 0 Z" fill="#F2B84B" {...L} />
        <path d="M-13 -8 H13 M-12 -16 H12 M-8 -23 H8" stroke="#B98A3A" strokeWidth="1.4" />
        <circle cx="0" cy="-6" r="2.6" fill="#6B5444" />
      </g>
      <path d="M100 60 q4 -4 8 0 q4 -4 8 0" fill="none" stroke="#6B5444" strokeWidth="1.2" strokeOpacity="0.6" />
    </g>
  );
}

function WindyHill() {
  return (
    <g>
      <path d="M0 0 H160 V110 H0 Z" fill="#E4F1F6" />
      <path d="M10 30 C30 22 46 30 60 26 M90 18 C104 12 118 20 132 14" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
      <path d="M0 110 L0 80 C40 40 100 44 160 76 L160 110 Z" fill="#B9D1AD" />
      <path d="M0 110 L0 96 C50 80 110 84 160 96 L160 110 Z" fill="#A8C3A0" />
      {/* 언덕 위 바람개비 */}
      <g transform="translate(76 50)">
        <path d="M-4 0 L-3 -26 L3 -26 L4 0 Z" fill="#FBF1DF" {...L} />
        {[0, 90, 180, 270].map((a) => (
          <path key={a} d="M0 -28 L2 -44 L9 -42 Z" fill={a % 180 ? '#C8DFE8' : '#F5D0AD'} {...L} strokeWidth={1.2} transform={`rotate(${a + 20} 0 -28)`} />
        ))}
        <circle cx="0" cy="-28" r="2.4" fill="#B9855A" />
      </g>
      {/* 연 */}
      <g transform="translate(126 26) rotate(12)">
        <path d="M0 -14 L11 0 L0 14 L-11 0 Z" fill="#F3C6D2" {...L} strokeWidth={1.3} />
        <path d="M0 14 C-4 26 8 30 2 44" fill="none" stroke="#6B5444" strokeOpacity="0.6" strokeWidth="1.2" />
      </g>
      {[[20, 94], [40, 98], [130, 98]].map(([x, y]) => (
        <circle key={`${x}`} cx={x} cy={y} r="3" fill="#FFFFFF" {...L} strokeWidth={1} />
      ))}
    </g>
  );
}

function RainbowLake() {
  return (
    <g>
      <path d="M0 0 H160 V110 H0 Z" fill="#EAF3F4" />
      {/* 무지개 */}
      {['#F3C6D2', '#F5D0AD', '#FFF0B8', '#C9E0BE', '#C8DFE8', '#D9D0EC'].map((c, i) => (
        <path key={c} d={`M${18 + i * 6} 62 A${62 - i * 6} ${46 - i * 5} 0 0 1 ${142 - i * 6} 62`} fill="none" stroke={c} strokeWidth="6" />
      ))}
      <path d="M0 110 L0 70 C30 64 50 70 80 68 C110 66 130 62 160 68 L160 110 Z" fill="#B9D1AD" />
      {/* 호수 */}
      <ellipse cx="80" cy="88" rx="62" ry="16" fill="#C8DFE8" {...L} />
      <path d="M40 86 C50 84 58 88 68 86 M92 92 C102 90 110 94 120 92" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      {/* 연잎과 연꽃 */}
      <ellipse cx="54" cy="92" rx="10" ry="4" fill="#A8C3A0" {...L} strokeWidth={1.2} />
      <g transform="translate(56 88)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-3" rx="2.2" ry="3.6" fill="#F3C6D2" stroke="#6B5444" strokeWidth="0.8" transform={`rotate(${a})`} />
        ))}
      </g>
      {/* 오리 (물에 비친 모습은 흐리게 거꾸로) */}
      <g transform="translate(100 84)">
        <path d="M-9 0 C-9 -6 -3 -8 2 -6 C3 -11 9 -11 9 -6 C9 -3 7 -2 5 -2 C8 0 6 4 0 4 C-6 4 -9 3 -9 0 Z" fill="#FFF0B8" {...L} strokeWidth={1.2} />
        <path d="M9 -7 L13 -6 L9 -5 Z" fill="#E9A05A" />
        <g transform="scale(1 -1) translate(0 -9)" opacity="0.35">
          <path d="M-9 0 C-9 -6 -3 -8 2 -6 C3 -11 9 -11 9 -6 C9 -3 7 -2 5 -2 C8 0 6 4 0 4 C-6 4 -9 3 -9 0 Z" fill="#FFF0B8" />
        </g>
      </g>
    </g>
  );
}

const SCENES: Record<RegionId, () => JSX.Element> = { acornVillage: AcornVillage, moonlightForest: MoonlightForest, crystalCave: CrystalCave, sunnyMeadow: SunnyMeadow, windyHill: WindyHill, rainbowLake: RainbowLake };

export default function RegionLandmark({ id, locked }: { id: RegionId; locked: boolean }) {
  const Scene = SCENES[id];
  return (
    <svg viewBox="0 0 160 110" aria-hidden="true" className="h-full w-full">
      <defs>
        <clipPath id={`lm-${id}`}>
          <rect width="160" height="110" rx="22" />
        </clipPath>
      </defs>
      <g clipPath={`url(#lm-${id})`}>
        <rect width="160" height="110" fill="#FFF5DF" />
        <g filter="url(#wc-furniture)">
          <Scene />
        </g>
        {/* 잠긴 마을: 안개 (모양으로 구분, 색만으로 알리지 않음) */}
        {locked && (
          <g fill="#FFFFFF">
            <rect width="160" height="110" opacity="0.35" />
            <ellipse cx="40" cy="70" rx="56" ry="20" opacity="0.75" />
            <ellipse cx="118" cy="52" rx="60" ry="22" opacity="0.7" />
            <ellipse cx="80" cy="96" rx="90" ry="18" opacity="0.8" />
          </g>
        )}
      </g>
    </svg>
  );
}
