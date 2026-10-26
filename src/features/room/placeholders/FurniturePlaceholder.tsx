import { footprintCorners, lift, toPoints, type Point } from '../iso';
import type { FurnitureDef, PlaceholderShape } from '../../../types/furniture';

// ===== 그림 파일이 없을 때 그리는 가구 모양 =====
// 모든 가구가 같은 각도(2:1 아이소메트릭)와 같은 조명(왼쪽 위에서 빛)으로 보이도록
// 상자(Box)를 쌓아 만든다: 윗면은 원래 색, 왼쪽 면은 조금 어둡게, 오른쪽 면은 더 어둡게.

interface Area {
  gx: number;
  gy: number;
  w: number; // 차지 칸 (가로)
  d: number; // 차지 칸 (세로)
}

const SHADE = '#59483C';
// 색연필 선: 진한 갈색, 반투명 (검은 선은 쓰지 않는다)
const LINE = { stroke: '#6B5444', strokeOpacity: 0.55, strokeWidth: 2, strokeLinejoin: 'round' as const };
// 나무 색이면 면에 나뭇결을 그린다
const WOOD = new Set(['#B9855A', '#A8744A', '#C99A6E', '#D9A66B', '#8F613C']);

// 바닥 영역(a)을 가운데 기준으로 s 배 줄인 영역
const inset = (a: Area, s: number): Area => ({ gx: a.gx + (a.w * (1 - s)) / 2, gy: a.gy + (a.d * (1 - s)) / 2, w: a.w * s, d: a.d * s });
const lerp = (p: Point, q: Point, t: number): Point => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });

// 바닥 영역 위 z 높이에서 시작하는 높이 h 의 상자
function Box({ area, z = 0, h, color }: { area: Area; z?: number; h: number; color: string }) {
  const c = footprintCorners(area.gx, area.gy, area.w, area.d);
  const [top, right, bottom, left] = [lift(c.top, z), lift(c.right, z), lift(c.bottom, z), lift(c.left, z)];
  const leftFace = [left, bottom, lift(bottom, h), lift(left, h)];
  const rightFace = [bottom, right, lift(right, h), lift(bottom, h)];
  return (
    <g {...LINE}>
      <polygon points={toPoints(leftFace)} fill={color} />
      <polygon points={toPoints(leftFace)} fill={SHADE} fillOpacity="0.12" stroke="none" />
      <polygon points={toPoints(rightFace)} fill={color} />
      <polygon points={toPoints(rightFace)} fill={SHADE} fillOpacity="0.26" stroke="none" />
      <polygon points={toPoints([lift(top, h), lift(right, h), lift(bottom, h), lift(left, h)])} fill={color} />
      {/* 윗면 왼쪽 위의 빛 */}
      <polygon points={toPoints([lift(top, h), lift(lerp(top, right, 0.5), h), lift(lerp(left, bottom, 0.5), h), lift(left, h)])} fill="#FFFFFF" fillOpacity="0.12" stroke="none" />
      {WOOD.has(color) && h >= 12 && (
        // 나뭇결: 옆면을 따라 가늘게 흔들리는 선 두세 줄
        <g stroke="#6B4A2E" strokeOpacity="0.22" strokeWidth="1.3" fill="none">
          {[0.3, 0.62, 0.85].filter((t) => h * t > 6).map((t) => (
            <g key={t}>
              <path d={`M${lerp(left, bottom, 0.05).x} ${lift(lerp(left, bottom, 0.05), h * t).y} Q${lerp(left, bottom, 0.5).x} ${lift(lerp(left, bottom, 0.5), h * t + 3).y} ${lerp(left, bottom, 0.95).x} ${lift(lerp(left, bottom, 0.95), h * t - 1).y}`} />
              <path d={`M${lerp(bottom, right, 0.05).x} ${lift(lerp(bottom, right, 0.05), h * t - 1).y} Q${lerp(bottom, right, 0.5).x} ${lift(lerp(bottom, right, 0.5), h * t + 3).y} ${lerp(bottom, right, 0.95).x} ${lift(lerp(bottom, right, 0.95), h * t).y}`} />
            </g>
          ))}
        </g>
      )}
    </g>
  );
}

// 바닥 영역 안에 꼭 맞는 납작한 타원 (러그·의자 머리 등) — z 높이에 그린다
function flatEllipse(area: Area, z: number, scale = 1) {
  const c = footprintCorners(area.gx, area.gy, area.w, area.d);
  return { cx: (c.left.x + c.right.x) / 2, cy: (c.top.y + c.bottom.y) / 2 - z, rx: ((c.right.x - c.left.x) / 2) * scale, ry: ((c.bottom.y - c.top.y) / 2) * scale };
}

// 버섯 갓처럼 둥근 지붕: 타원 + 위로 볼록한 반원
function Dome({ area, z, height, color }: { area: Area; z: number; height: number; color: string }) {
  const e = flatEllipse(area, z);
  const d = `M${e.cx - e.rx} ${e.cy} A${e.rx} ${height} 0 0 1 ${e.cx + e.rx} ${e.cy} A${e.rx} ${e.ry} 0 0 1 ${e.cx - e.rx} ${e.cy} Z`;
  return (
    <g {...LINE}>
      <path d={d} fill={color} />
      <path d={`M${e.cx - e.rx} ${e.cy} A${e.rx} ${e.ry} 0 0 0 ${e.cx + e.rx} ${e.cy}`} fill={SHADE} fillOpacity="0.15" />
      {/* 갓 위 점무늬 */}
      <circle cx={e.cx - e.rx * 0.4} cy={e.cy - height * 0.45} r={e.rx * 0.13} fill="#FFF5DF" stroke="none" />
      <circle cx={e.cx + e.rx * 0.3} cy={e.cy - height * 0.6} r={e.rx * 0.1} fill="#FFF5DF" stroke="none" />
      <circle cx={e.cx + e.rx * 0.05} cy={e.cy - height * 0.25} r={e.rx * 0.08} fill="#FFF5DF" stroke="none" />
    </g>
  );
}

// 가구의 '앞면'(긴 쪽)에 점을 찍는 도우미: t = 0~1 (옆으로), z = 높이
function frontFace(area: Area) {
  const c = footprintCorners(area.gx, area.gy, area.w, area.d);
  const [a, b] = area.w >= area.d ? [c.left, c.bottom] : [c.bottom, c.right];
  return (t: number, z: number) => lift(lerp(a, b, t), z);
}

type Painter = (area: Area) => JSX.Element;

// 바닥 가구 모양 (벽 장식 모양은 WallPlaceholder 가 그린다)
const PAINTERS: Partial<Record<PlaceholderShape, Painter>> = {
  // 나뭇잎 침대: 나무 틀 + 매트리스 + 베개 + 나뭇잎 이불
  bed: (a) => {
    const long = a.d >= a.w; // 침대 머리는 긴 쪽의 뒤
    const pillow = long ? { gx: a.gx + 0.25, gy: a.gy + 0.15, w: a.w - 0.5, d: 0.55 } : { gx: a.gx + 0.15, gy: a.gy + 0.25, w: 0.55, d: a.d - 0.5 };
    const blanket = long ? { gx: a.gx + 0.08, gy: a.gy + 0.9, w: a.w - 0.16, d: a.d - 0.98 } : { gx: a.gx + 0.9, gy: a.gy + 0.08, w: a.w - 0.98, d: a.d - 0.16 };
    const e = flatEllipse(blanket, 38, 0.6);
    return (
      <g>
        <Box area={a} h={20} color="#B9855A" />
        <Box area={inset(a, 0.94)} z={20} h={12} color="#FFF5DF" />
        <Box area={pillow} z={32} h={8} color="#F3C6D2" />
        <Box area={blanket} z={32} h={5} color="#A8C3A0" />
        {/* 잎맥 */}
        <path d={`M${e.cx - e.rx} ${e.cy} Q${e.cx} ${e.cy - e.ry * 0.6} ${e.cx + e.rx} ${e.cy}`} stroke="#7FA077" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    );
  },
  // 꽃잎 러그: 동그란 러그 + 둘레 꽃잎
  rug: (a) => {
    const e = flatEllipse(a, 2, 0.82);
    const petals = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2);
    return (
      <g>
        {petals.map((ang) => (
          <ellipse key={ang} cx={e.cx + Math.cos(ang) * e.rx} cy={e.cy + Math.sin(ang) * e.ry} rx={e.rx * 0.22} ry={e.ry * 0.3} fill="#F3C6D2" {...LINE} />
        ))}
        <ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} fill="#F7D6DF" {...LINE} />
        <ellipse cx={e.cx} cy={e.cy} rx={e.rx * 0.45} ry={e.ry * 0.45} fill="#F5D0AD" stroke="none" />
      </g>
    );
  },
  // 버섯 조명: 받침 + 기둥 + 빛나는 갓
  lamp: (a) => {
    const e = flatEllipse(a, 72);
    return (
      <g>
        <ellipse cx={e.cx} cy={e.cy - 10} rx={e.rx * 1.1} ry={e.rx * 0.9} fill="#F5D0AD" opacity="0.35" />
        <Box area={inset(a, 0.5)} h={6} color="#B9855A" />
        <Box area={inset(a, 0.22)} z={6} h={66} color="#FFF5DF" />
        <Dome area={inset(a, 0.85)} z={68} height={34} color="#E9A08C" />
      </g>
    );
  },
  // 숲속 책장: 나무 상자 + 선반 + 책
  shelf: (a) => {
    const f = frontFace(a);
    const books = ['#A8C3A0', '#F3C6D2', '#C8DFE8', '#D9D0EC', '#F5D0AD', '#A8C3A0', '#F3C6D2'];
    const row = (z0: number, offset: number) =>
      books.slice(offset, offset + 5).map((color, i) => {
        const t0 = 0.08 + i * 0.17;
        const t1 = t0 + 0.12;
        const h = 34 + ((i + offset) % 3) * 6;
        return <polygon key={`${z0}-${i}`} points={toPoints([f(t0, z0), f(t1, z0), f(t1, z0 + h), f(t0, z0 + h)])} fill={color} {...LINE} />;
      });
    return (
      <g>
        <Box area={a} h={150} color="#B9855A" />
        {[50, 100].map((z) => (
          <line key={z} x1={f(0, z).x} y1={f(0, z).y} x2={f(1, z).x} y2={f(1, z).y} stroke={SHADE} strokeOpacity="0.4" strokeWidth="3" />
        ))}
        {row(6, 0)}
        {row(56, 2)}
        {row(104, 1)}
      </g>
    );
  },
  // 나무 책상: 상판 + 다리 4개 + 연필꽂이
  desk: (a) => {
    const leg = 0.14;
    const legs = [
      { gx: a.gx + 0.06, gy: a.gy + 0.06 },
      { gx: a.gx + a.w - 0.06 - leg, gy: a.gy + 0.06 },
      { gx: a.gx + 0.06, gy: a.gy + a.d - 0.06 - leg },
      { gx: a.gx + a.w - 0.06 - leg, gy: a.gy + a.d - 0.06 - leg },
    ];
    return (
      <g>
        {legs.map((l, i) => (
          <Box key={i} area={{ ...l, w: leg, d: leg }} h={58} color="#B9855A" />
        ))}
        <Box area={a} z={58} h={9} color="#C99A6E" />
        <Box area={{ gx: a.gx + 0.2, gy: a.gy + 0.25, w: 0.7, d: 0.5 }} z={67} h={1} color="#FFF5DF" />
        <Box area={{ gx: a.gx + a.w - 0.45, gy: a.gy + 0.3, w: 0.22, d: 0.22 }} z={67} h={20} color="#C8DFE8" />
      </g>
    );
  },
  // 꽃 화분: 화분 + 잎 + 꽃
  pot: (a) => {
    const e = flatEllipse(inset(a, 0.5), 30);
    const flowers = [
      { x: -14, y: -30, c: '#F3C6D2' },
      { x: 12, y: -36, c: '#D9D0EC' },
      { x: 0, y: -48, c: '#F3C6D2' },
    ];
    return (
      <g>
        <Box area={inset(a, 0.5)} h={30} color="#D9D0EC" />
        <ellipse cx={e.cx - 12} cy={e.cy - 10} rx="12" ry="6" fill="#A8C3A0" transform={`rotate(-30 ${e.cx - 12} ${e.cy - 10})`} {...LINE} />
        <ellipse cx={e.cx + 12} cy={e.cy - 12} rx="12" ry="6" fill="#A8C3A0" transform={`rotate(30 ${e.cx + 12} ${e.cy - 12})`} {...LINE} />
        {flowers.map((fl, i) => (
          <g key={i}>
            <line x1={e.cx} y1={e.cy} x2={e.cx + fl.x} y2={e.cy + fl.y} stroke="#7FA077" strokeWidth="3" />
            <circle cx={e.cx + fl.x} cy={e.cy + fl.y} r="9" fill={fl.c} {...LINE} />
            <circle cx={e.cx + fl.x} cy={e.cy + fl.y} r="3.5" fill="#F5D0AD" />
          </g>
        ))}
      </g>
    );
  },
  // 장난감 상자: 나무 상자 + 뚜껑 띠 + 잠금쇠
  chest: (a) => {
    const body = inset(a, 0.82);
    const f = frontFace(body);
    const lock = [f(0.43, 30), f(0.57, 30), f(0.57, 44), f(0.43, 44)];
    return (
      <g>
        <Box area={body} h={40} color="#A8744A" />
        <Box area={inset(a, 0.86)} z={40} h={12} color="#B9855A" />
        <polygon points={toPoints(lock)} fill="#F5D0AD" {...LINE} />
      </g>
    );
  },
  // 버섯 의자: 짧은 기둥 + 둥근 갓
  stool: (a) => (
    <g>
      <Box area={inset(a, 0.32)} h={26} color="#FFF5DF" />
      <Dome area={inset(a, 0.72)} z={26} height={20} color="#F3C6D2" />
    </g>
  ),
  // 사과 바구니: 바구니 + 사과 세 알
  basket: (a) => {
    const e = flatEllipse(inset(a, 0.6), 26);
    return (
      <g>
        <Box area={inset(a, 0.6)} h={24} color="#D9A66B" />
        {[-12, 10, -1].map((dx, i) => (
          <g key={i}>
            <circle cx={e.cx + dx} cy={e.cy - (i === 2 ? 12 : 2)} r="10" fill="#E07A6B" {...LINE} />
            <path d={`M${e.cx + dx} ${e.cy - (i === 2 ? 22 : 12)} l3 -6`} stroke="#7FA077" strokeWidth="3" strokeLinecap="round" />
          </g>
        ))}
      </g>
    );
  },
  // 달빛 등불: 기둥 + 빛나는 등
  lantern: (a) => {
    const e = flatEllipse(inset(a, 0.42), 104);
    return (
      <g>
        <Box area={inset(a, 0.42)} h={6} color="#B9855A" />
        <Box area={inset(a, 0.1)} z={6} h={86} color="#B9855A" />
        <circle cx={e.cx} cy={e.cy} r="24" fill="#C8DFE8" opacity="0.5" />
        <Box area={inset(a, 0.4)} z={92} h={26} color="#C8DFE8" />
        <Box area={inset(a, 0.48)} z={118} h={6} color="#B9855A" />
      </g>
    );
  },
  // 수정 등불: 돌 받침 + 빛나는 수정 세 개 (뾰족한 육각 기둥을 옆에서 본 모양)
  crystal: (a) => {
    const e = flatEllipse(inset(a, 0.5), 22);
    const spikes: [number, number, number, string][] = [
      // 가운데로부터 x 거리, 너비, 높이, 색
      [-14, 13, 46, '#D9D0EC'],
      [12, 12, 40, '#C8DFE8'],
      [0, 16, 70, '#E4F1F6'],
    ];
    return (
      <g>
        <circle cx={e.cx} cy={e.cy - 36} r="34" fill="#C8DFE8" opacity="0.45" />
        <Box area={inset(a, 0.55)} h={20} color="#9A9AA6" />
        {spikes.map(([dx, w, h, color], i) => {
          const x = e.cx + dx;
          const y = e.cy + 2;
          return (
            <g key={i} {...LINE}>
              <polygon points={`${x - w / 2},${y} ${x - w / 2},${y - h * 0.7} ${x},${y - h} ${x + w / 2},${y - h * 0.7} ${x + w / 2},${y}`} fill={color} />
              <polygon points={`${x},${y} ${x},${y - h} ${x + w / 2},${y - h * 0.7} ${x + w / 2},${y}`} fill={SHADE} fillOpacity="0.14" stroke="none" />
            </g>
          );
        })}
      </g>
    );
  },
  // 버섯 침대: 낮은 나무 틀 + 매트리스 + 분홍 이불 + 머리 쪽에 점박이 버섯 갓 머리판
  mushroomBed: (a) => {
    const long = a.d >= a.w;
    const head = long ? { gx: a.gx + 0.05, gy: a.gy + 0.02, w: a.w - 0.1, d: 0.28 } : { gx: a.gx + 0.02, gy: a.gy + 0.05, w: 0.28, d: a.d - 0.1 };
    const cap = long ? { gx: a.gx - 0.12, gy: a.gy - 0.25, w: a.w + 0.24, d: 0.8 } : { gx: a.gx - 0.25, gy: a.gy - 0.12, w: 0.8, d: a.d + 0.24 };
    const blanket = long ? { gx: a.gx + 0.08, gy: a.gy + 1.0, w: a.w - 0.16, d: a.d - 1.08 } : { gx: a.gx + 1.0, gy: a.gy + 0.08, w: a.w - 1.08, d: a.d - 0.16 };
    const pillow = long ? { gx: a.gx + 0.3, gy: a.gy + 0.35, w: a.w - 0.6, d: 0.5 } : { gx: a.gx + 0.35, gy: a.gy + 0.3, w: 0.5, d: a.d - 0.6 };
    return (
      <g>
        <Box area={head} h={58} color="#FBF1DF" />
        <Dome area={cap} z={56} height={46} color="#E0796B" />
        <Box area={a} h={16} color="#B9855A" />
        <Box area={inset(a, 0.94)} z={16} h={12} color="#FFF5DF" />
        <Box area={pillow} z={28} h={8} color="#FBF1DF" />
        <Box area={blanket} z={28} h={6} color="#F3C6D2" />
      </g>
    );
  },
  // 클로버 방석: 동그랗고 폭신한 방석 + 위에 클로버 잎 세 장
  cushion: (a) => {
    const e = flatEllipse(inset(a, 0.5), 16);
    return (
      <g>
        <Dome area={inset(a, 0.78)} z={0} height={16} color="#A8C3A0" />
        {[-90, 30, 150].map((deg) => {
          const r = (deg * Math.PI) / 180;
          return <circle key={deg} cx={e.cx + Math.cos(r) * 7} cy={e.cy - 4 + Math.sin(r) * 4} r="6" fill="#D5E4C8" {...LINE} strokeWidth={1.4} />;
        })}
        <path d={`M${e.cx} ${e.cy - 2} l4 7`} stroke="#6F9468" strokeWidth="2" strokeLinecap="round" />
      </g>
    );
  },
  // 만들기 작업대: 다리 넷 + 두꺼운 판 + 나무 조각, 못 병, 작은 망치
  bench: (a) => {
    const leg = 0.14;
    const legs = [
      { gx: a.gx + 0.06, gy: a.gy + 0.06 },
      { gx: a.gx + a.w - 0.06 - leg, gy: a.gy + 0.06 },
      { gx: a.gx + 0.06, gy: a.gy + a.d - 0.06 - leg },
      { gx: a.gx + a.w - 0.06 - leg, gy: a.gy + a.d - 0.06 - leg },
    ];
    const f = frontFace(a);
    const hammerA = f(0.62, 76);
    return (
      <g>
        {legs.map((l, i) => (
          <Box key={i} area={{ ...l, w: leg, d: leg }} h={50} color="#A8744A" />
        ))}
        <Box area={{ gx: a.gx + 0.1, gy: a.gy + 0.1, w: a.w - 0.2, d: a.d - 0.2 }} z={14} h={5} color="#C99A6E" />
        <Box area={a} z={50} h={12} color="#B9855A" />
        <Box area={{ gx: a.gx + 0.15, gy: a.gy + 0.3, w: 0.8, d: 0.25 }} z={62} h={6} color="#F5D0AD" />
        <Box area={{ gx: a.gx + a.w - 0.4, gy: a.gy + 0.25, w: 0.22, d: 0.22 }} z={62} h={18} color="#C8DFE8" />
        <path d={`M${hammerA.x - 14} ${hammerA.y + 4} L${hammerA.x + 10} ${hammerA.y - 6}`} stroke="#B9855A" strokeWidth="4" strokeLinecap="round" />
        <rect x={hammerA.x + 6} y={hammerA.y - 13} width="8" height="12" rx="2" fill="#9A9AA6" {...LINE} transform={`rotate(-20 ${hammerA.x + 10} ${hammerA.y - 7})`} />
      </g>
    );
  },
  // 해바라기 화분: 테라코타 화분 + 키 큰 줄기 + 해바라기 두 송이
  sunflowerPot: (a) => {
    const e = flatEllipse(inset(a, 0.5), 30);
    const heads = [
      { dx: -10, h: 100, r: 15 },
      { dx: 12, h: 78, r: 12 },
    ];
    return (
      <g>
        <Box area={inset(a, 0.5)} h={30} color="#D9A66B" />
        {heads.map(({ dx, h, r }) => (
          <g key={dx}>
            <path d={`M${e.cx + dx * 0.4} ${e.cy} C${e.cx + dx * 0.6} ${e.cy - h * 0.5} ${e.cx + dx} ${e.cy - h * 0.7} ${e.cx + dx} ${e.cy - h}`} stroke="#7FA077" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d={`M${e.cx + dx * 0.5} ${e.cy - h * 0.5} c-12 -6 -16 0 -16 2 c6 4 12 2 16 -2 z`} fill="#A8C3A0" {...LINE} strokeWidth={1.4} />
            {Array.from({ length: 10 }, (_, i) => i * 36).map((ang) => (
              <ellipse key={ang} cx={e.cx + dx} cy={e.cy - h - r * 0.9} rx={r * 0.32} ry={r * 0.62} fill="#F2CF5B" {...LINE} strokeWidth={1.2} transform={`rotate(${ang} ${e.cx + dx} ${e.cy - h})`} />
            ))}
            <circle cx={e.cx + dx} cy={e.cy - h} r={r * 0.55} fill="#8C6B52" {...LINE} strokeWidth={1.2} />
          </g>
        ))}
      </g>
    );
  },
  // 꿀 등불: 나무 받침 + 기둥 + 꿀빛 육각형 등
  honeyLamp: (a) => {
    const e = flatEllipse(inset(a, 0.42), 96);
    const hex = (rx: number, ry: number) =>
      Array.from({ length: 6 }, (_, i) => `${e.cx + Math.cos((Math.PI / 3) * i) * rx},${e.cy + Math.sin((Math.PI / 3) * i) * ry}`).join(' ');
    return (
      <g>
        <Box area={inset(a, 0.45)} h={8} color="#B9855A" />
        <Box area={inset(a, 0.1)} z={8} h={66} color="#B9855A" />
        <circle cx={e.cx} cy={e.cy} r="30" fill="#FFE9B0" opacity="0.5" />
        <polygon points={hex(20, 22)} fill="#F2B84B" {...LINE} />
        <polygon points={hex(11, 12)} fill="#FFF0B8" opacity="0.55" />
      </g>
    );
  },
  // 연잎 러그: 둥근 초록 연잎 (한쪽이 갈라진 모양) 위에 분홍 연꽃 하나
  lilyRug: (a) => {
    const e = flatEllipse(a, 2, 0.82);
    const notch = `M${e.cx} ${e.cy} L${e.cx + e.rx * 0.95} ${e.cy - e.ry * 0.25} L${e.cx + e.rx * 0.95} ${e.cy + e.ry * 0.2} Z`;
    return (
      <g>
        <ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} fill="#A8C3A0" {...LINE} />
        <path d={notch} fill="#E8DCC4" stroke="none" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const ang = Math.PI * (0.15 + i * 0.3);
          return <path key={i} d={`M${e.cx} ${e.cy} L${e.cx + Math.cos(ang) * e.rx * 0.85} ${e.cy + Math.sin(ang) * e.ry * 0.85}`} stroke="#7FA077" strokeWidth="2" opacity="0.6" />;
        })}
        <ellipse cx={e.cx} cy={e.cy} rx={e.rx * 0.62} ry={e.ry * 0.62} fill="none" stroke="#C8DFE8" strokeWidth="4" opacity="0.6" />
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx={e.cx - e.rx * 0.35} cy={e.cy - e.ry * 0.15 - 8} rx="7" ry="13" fill="#F3C6D2" {...LINE} transform={`rotate(${r} ${e.cx - e.rx * 0.35} ${e.cy - e.ry * 0.15})`} />
        ))}
        <circle cx={e.cx - e.rx * 0.35} cy={e.cy - e.ry * 0.15} r="6" fill="#F5D0AD" {...LINE} />
      </g>
    );
  },
  // 조개 등불: 나무 받침 위 부채꼴 조개, 안에 빛나는 진주
  shellLamp: (a) => {
    const e = flatEllipse(inset(a, 0.42), 84);
    const ribs = [-60, -35, -12, 12, 35, 60];
    return (
      <g>
        <Box area={inset(a, 0.45)} h={8} color="#B9855A" />
        <Box area={inset(a, 0.1)} z={8} h={56} color="#B9855A" />
        <circle cx={e.cx} cy={e.cy - 6} r="34" fill="#FFE9B0" opacity="0.45" />
        <path d={`M${e.cx - 30} ${e.cy + 8} Q${e.cx} ${e.cy - 52} ${e.cx + 30} ${e.cy + 8} Q${e.cx} ${e.cy + 16} ${e.cx - 30} ${e.cy + 8} Z`} fill="#F7D6DF" {...LINE} />
        {ribs.map((r) => (
          <path key={r} d={`M${e.cx} ${e.cy + 10} L${e.cx + Math.sin((r * Math.PI) / 180) * 30} ${e.cy + 8 - Math.cos((r * Math.PI) / 180) * 34}`} stroke="#E79BB0" strokeWidth="1.6" opacity="0.8" />
        ))}
        <circle cx={e.cx} cy={e.cy + 4} r="7" fill="#FFFDF7" {...LINE} />
      </g>
    );
  },
  // 구름 빈백: 폭신한 구름 모양 의자
  beanbag: (a) => {
    const e = flatEllipse(inset(a, 0.8), 0);
    return (
      <g {...LINE}>
        <ellipse cx={e.cx} cy={e.cy - 10} rx={e.rx} ry={e.ry + 10} fill="#F1E9F7" />
        <circle cx={e.cx - e.rx * 0.45} cy={e.cy - 26} r={e.rx * 0.42} fill="#FFFFFF" />
        <circle cx={e.cx + e.rx * 0.35} cy={e.cy - 28} r={e.rx * 0.48} fill="#FFFFFF" />
        <circle cx={e.cx} cy={e.cy - 34} r={e.rx * 0.4} fill="#FFFFFF" />
        <path d={`M${e.cx - e.rx * 0.6} ${e.cy - 30} q6 -8 14 -6`} fill="none" stroke="#D9D0EC" strokeWidth="3" />
      </g>
    );
  },
  // 기본 상자 (모양을 아직 정하지 않은 가구)
  box: (a) => <Box area={a} h={40} color="#D5E4C8" />,
};

export default function FurniturePlaceholder({ def, area }: { def: FurnitureDef; area: Area }) {
  const c = footprintCorners(area.gx, area.gy, area.w, area.d);
  return (
    <g>
      {/* 바닥 그림자 */}
      {def.placeholder.shape !== 'rug' && <polygon points={toPoints([c.top, c.right, c.bottom, c.left])} fill={SHADE} fillOpacity="0.12" />}
      {/* 수채화 효과 (src/components/art/WatercolorDefs.tsx) */}
      <g filter="url(#wc-furniture)">{(PAINTERS[def.placeholder.shape] ?? PAINTERS.box!)(area)}</g>
    </g>
  );
}
