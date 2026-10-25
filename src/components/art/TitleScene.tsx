// 타이틀 화면 뒤의 숲속 마을 풍경 (수채화). 글자·버튼과 겹쳐도 읽기 쉽도록 색을 옅게, 아래쪽에만 그린다.
const L = { stroke: '#6B5444', strokeOpacity: 0.5, strokeWidth: 2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Tree({ x, y, s, color }: { x: number; y: number; s: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-5 0 L-4 -34 L4 -34 L5 0 Z" fill="#B9855A" {...L} />
      <path d="M0 -112 C26 -112 40 -88 36 -64 C48 -56 44 -30 22 -30 L-22 -30 C-44 -30 -48 -56 -36 -64 C-40 -88 -26 -112 0 -112 Z" fill={color} {...L} />
      <path d="M-20 -80 C-14 -94 -2 -100 8 -98" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

export default function TitleScene() {
  return (
    <svg aria-hidden="true" viewBox="0 0 800 420" preserveAspectRatio="xMidYMax slice" className="pointer-events-none fixed inset-x-0 bottom-0 h-[58%] w-full">
      <g filter="url(#wc-room)">
        {/* 먼 언덕 */}
        <path d="M-40 250 L0 250 C120 190 230 210 330 230 C450 180 600 190 800 240 L840 250 L840 440 L-40 440 Z" fill="#D5E4C8" />
        <path d="M-40 300 L0 300 C150 250 280 270 400 290 C520 250 660 260 800 300 L840 310 L840 440 L-40 440 Z" fill="#C3D8B6" />
        {/* 나무들 */}
        {/* 좁은 세로 화면에서는 가운데(약 250~550)만 보이므로 중요한 것은 가운데에 둔다 */}
        <Tree x={60} y={300} s={1.05} color="#A8C3A0" />
        <Tree x={150} y={315} s={0.8} color="#B9D1AD" />
        <Tree x={278} y={318} s={0.85} color="#A8C3A0" />
        <Tree x={545} y={322} s={0.9} color="#B9D1AD" />
        <Tree x={690} y={300} s={1.1} color="#A8C3A0" />
        <Tree x={760} y={320} s={0.75} color="#B9D1AD" />
        {/* 버섯 오두막 */}
        <g transform="translate(450 330) scale(0.8)">
          <path d="M-34 0 L-30 -56 L30 -56 L34 0 Z" fill="#FBF1DF" {...L} />
          <path d="M-12 0 L-12 -26 C-12 -36 12 -36 12 -26 L12 0 Z" fill="#B9855A" {...L} />
          <circle cx="7" cy="-13" r="1.8" fill="#6B5444" />
          <circle cx="-20" cy="-36" r="7" fill="#C8DFE8" {...L} />
          <path d="M-64 -52 C-60 -96 -20 -116 0 -116 C20 -116 60 -96 64 -52 C40 -44 -40 -44 -64 -52 Z" fill="#E0796B" {...L} />
          <circle cx="-30" cy="-80" r="8" fill="#FFF5DF" />
          <circle cx="12" cy="-96" r="6" fill="#FFF5DF" />
          <circle cx="36" cy="-70" r="7" fill="#FFF5DF" />
          <path d="M-40 -90 C-30 -104 -14 -110 0 -110" fill="none" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" />
        </g>
        {/* 오솔길 */}
        <path d="M452 332 C440 360 400 380 390 420 L330 420 C350 380 410 350 436 330 Z" fill="#F1DDBC" />
        {/* 앞쪽 풀밭과 꽃 */}
        <path d="M-40 362 L0 360 C140 340 260 350 380 370 C520 350 660 345 800 365 L840 366 L840 440 L-40 440 Z" fill="#A8C3A0" />
        {[[40, 372, '#F3C6D2'], [120, 380, '#FFF5DF'], [270, 384, '#F5D0AD'], [300, 396, '#F3C6D2'], [500, 388, '#D9D0EC'], [530, 380, '#FFF5DF'], [700, 378, '#FFF5DF'], [770, 388, '#D9D0EC']].map(([x, y, c]) => (
          <g key={`${x}`} transform={`translate(${x} ${y})`}>
            <path d="M0 0 L0 14" stroke="#7FA077" strokeWidth="2" />
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a as number} cx="0" cy="-4" rx="3" ry="4.5" fill={c as string} transform={`rotate(${a})`} {...L} strokeWidth={1} />
            ))}
            <circle r="2.2" fill="#F2CF5B" />
          </g>
        ))}
      </g>
      {/* 반딧불이 (반짝임은 움직임 줄이기 설정을 따른다) */}
      {[[260, 250], [520, 220], [180, 200], [640, 170]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#FFF0B8" className="animate-pulse" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
    </svg>
  );
}
