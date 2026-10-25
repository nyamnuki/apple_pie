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
const LINE = { stroke: SHADE, strokeOpacity: 0.35, strokeWidth: 2, strokeLinejoin: 'round' as const };

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

const PAINTERS: Record<PlaceholderShape, Painter> = {
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
  // 기본 상자 (모양을 아직 정하지 않은 가구)
  box: (a) => <Box area={a} h={40} color="#D5E4C8" />,
};

export default function FurniturePlaceholder({ def, area }: { def: FurnitureDef; area: Area }) {
  const c = footprintCorners(area.gx, area.gy, area.w, area.d);
  return (
    <g>
      {/* 바닥 그림자 */}
      {def.placeholder.shape !== 'rug' && <polygon points={toPoints([c.top, c.right, c.bottom, c.left])} fill={SHADE} fillOpacity="0.12" />}
      {PAINTERS[def.placeholder.shape](area)}
    </g>
  );
}
