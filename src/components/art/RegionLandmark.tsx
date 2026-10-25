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

const SCENES: Record<RegionId, () => JSX.Element> = { acornVillage: AcornVillage, moonlightForest: MoonlightForest, crystalCave: CrystalCave };

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
