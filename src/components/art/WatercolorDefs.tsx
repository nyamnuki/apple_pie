import { TINT_HUE } from '../../features/room/tints';

// ===== 수채화 효과 (SVG 필터) =====
// 앱 전체에서 한 번만 그려 두고, 그림마다 filter="url(#wc-…)" 로 불러 쓴다.
// - 가장자리가 살짝 흔들림 (손으로 칠한 느낌)
// - 물감이 고이는 가장자리는 조금 진하게
// - 종이 위 물감 알갱이 (아주 옅게)
// 크기가 다른 그림에 맞게 세 가지: 작은 그림(아이템·캐릭터) / 가구 / 방 전체.
// (흔들림 정도는 그림 좌표 단위라서 그림 크기에 따라 다르게 정한다)

function Watercolor({ id, wobble, freq, edge, grain, grainAlpha }: { id: string; wobble: number; freq: number; edge: number; grain: number; grainAlpha: number }) {
  return (
    <filter id={id} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
      {/* 가장자리 흔들림 */}
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="2" seed="7" result="warp" />
      <feDisplacementMap in="SourceGraphic" in2="warp" scale={wobble} xChannelSelector="R" yChannelSelector="G" result="paint" />
      {/* 물감이 고인 가장자리: 안쪽을 깎아 낸 테두리만 조금 어둡게 */}
      <feMorphology in="paint" operator="erode" radius={edge} result="inner" />
      <feComposite in="paint" in2="inner" operator="out" result="rim" />
      <feColorMatrix in="rim" type="matrix" values="0.78 0 0 0 0  0 0.74 0 0 0  0 0 0.7 0 0  0 0 0 0.5 0" result="rimDark" />
      {/* 물감 알갱이 */}
      <feTurbulence type="fractalNoise" baseFrequency={grain} numOctaves="2" seed="3" result="noise" />
      <feColorMatrix in="noise" type="matrix" values={`0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.22  0 0 0 ${grainAlpha} ${-grainAlpha / 2.4}`} result="speckle" />
      <feComposite in="speckle" in2="paint" operator="in" result="grainIn" />
      <feMerge>
        <feMergeNode in="paint" />
        <feMergeNode in="grainIn" />
        <feMergeNode in="rimDark" />
      </feMerge>
    </filter>
  );
}

export default function WatercolorDefs() {
  return (
    // display:none 이면 필터가 동작하지 않는 브라우저가 있어 크기 0 으로 숨긴다
    <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        {/* 둥근 몸·머리 위에 덧칠하는 빛과 그늘: 왼쪽 위는 밝게, 오른쪽 아래 가장자리는 옅은 그늘 */}
        <radialGradient id="wc-ball" cx="0.32" cy="0.28" r="0.85">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.8" stopColor="#59483C" stopOpacity="0.08" />
          <stop offset="1" stopColor="#59483C" stopOpacity="0.2" />
        </radialGradient>
        <Watercolor id="wc-small" wobble={2.2} freq={0.06} edge={0.9} grain={0.7} grainAlpha={0.22} />
        <Watercolor id="wc-furniture" wobble={3} freq={0.035} edge={1.4} grain={0.6} grainAlpha={0.3} />
        {/* 가구 색 바꾸기 (src/features/room/tints.ts 와 같은 각도) */}
        {([1, 2] as const).map((t) => (
          <filter key={t} id={`tint-${t}`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="hueRotate" values={String(TINT_HUE[t])} />
          </filter>
        ))}
        <Watercolor id="wc-room" wobble={4} freq={0.02} edge={2} grain={0.45} grainAlpha={0.3} />
      </defs>
    </svg>
  );
}
