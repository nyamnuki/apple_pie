import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type MutableRefObject, type ReactNode, type RefObject } from 'react';
import { bake, bakedEntry, bigEnough, canBake, fileUrl, pixelSize, whenIdle, type Baked } from './bake';

// ===== 한 번 구워 두는 수채화 그림 (자세한 이유는 bake.ts) =====
// 처음에는 원래 SVG 를 그리고, 브라우저가 한가할 때 사진으로 구워 바꿔 놓는다.
// 같은 bakeKey 는 앱 전체에서 한 번만 굽는다. bakeKey 는 그림 모양을 정하는 값을 모두 담아야 한다.

type Fit = 'xMidYMid meet' | 'xMidYMax slice' | 'none';
const vb = (viewBox: string) => viewBox.split(/[\s,]+/).map(Number) as [number, number, number, number];

// 그림 가장자리의 물감 번짐은 그림 칸 밖으로 조금 나간다: pad 만큼 넓게 굽는다 (칸 크기의 비율)
function padded(viewBox: string, pad: number) {
  const [x, y, w, h] = vb(viewBox);
  return `${x - w * pad} ${y - h * pad} ${w * (1 + 2 * pad)} ${h * (1 + 2 * pad)}`;
}

// 화면에 보이는 칸 크기에서, 이 그림에 필요한 사진 픽셀 크기
function needFor(rect: { width: number; height: number }, viewBox: string, fit: Fit, pad: number): [number, number] {
  const [, , w, h] = vb(viewBox);
  const sx = rect.width / w;
  const sy = rect.height / h;
  const s = fit === 'xMidYMax slice' ? Math.max(sx, sy) : Math.min(sx, sy);
  return fit === 'none' ? pixelSize(rect.width * (1 + 2 * pad), rect.height * (1 + 2 * pad)) : pixelSize(w * s * (1 + 2 * pad), h * s * (1 + 2 * pad));
}

// 굽지 않는 곳 (움직이지 않는 작은 미리 보기: 가구 고르기 칸 등). 구울 일이 오히려 더 크다
const BakeOff = createContext(false);
export function NoBake({ children }: { children: ReactNode }) {
  return <BakeOff.Provider value={true}>{children}</BakeOff.Provider>;
}
const useBakeOn = () => !useContext(BakeOff) && canBake();

// 크기가 바뀌면(방 크게 보기 등) 다시 재 본다. 처음 지켜보기 시작할 때의 알림은 건너뛴다 (그때는 이미 쟀다)
function useResize(ref: RefObject<Element | null>, onResize: () => void, active: boolean, dep: unknown) {
  const cb = useRef(onResize);
  cb.current = onResize;
  useEffect(() => {
    const el = ref.current;
    if (!active || !el || typeof ResizeObserver === 'undefined') return;
    let first = true;
    const ro = new ResizeObserver(() => {
      if (first) first = false;
      else cb.current();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, active, dep]);
}

interface SvgProps {
  bakeKey: string;
  viewBox: string;
  className?: string;
  style?: CSSProperties;
  preserveAspectRatio?: Fit;
  pad?: number;
  width?: number;
  height?: number;
  children: ReactNode;
}

// 혼자 있는 SVG 그림 (물건, 캐릭터, 방 배경, 타이틀 풍경)
export function BakedSvg({ bakeKey, viewBox, className = '', style, preserveAspectRatio = 'xMidYMid meet', pad = 0, width, height, children }: SvgProps) {
  const live = useRef<SVGSVGElement>(null);
  const shown = useRef<HTMLElement | null>(null);
  const [, redraw] = useState(0);
  const on = useBakeOn();
  const entry = on ? bakedEntry(bakeKey) : null;
  // 파일 주소가 준비된 것만 (아직이면 원래 그림을 그대로 둔다)
  const url = entry ? urls.get(entry) : undefined;

  const check = () => {
    const box = (url ? shown.current : live.current)?.getBoundingClientRect();
    if (!box || box.width === 0 || box.height === 0) return;
    const [w, h] = needFor(box, viewBox, preserveAspectRatio, pad);
    if (entry && bigEnough(entry, w, h)) {
      if (!url) withUrl(entry, redraw);
      return;
    }
    const inner = entry?.inner ?? live.current?.innerHTML;
    if (!inner) return;
    void bake(bakeKey, inner, entry?.viewBox ?? padded(viewBox, pad), w, h).then((e) => withUrl(e, redraw));
  };

  useEffect(() => {
    if (!on) return;
    return whenIdle(check);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bakeKey, url, on]);
  // 크기를 정해 준 그림(물건)은 크기가 바뀌지 않으므로 지켜보지 않는다
  useResize(url ? shown : live, check, on && width === undefined, url);

  if (!entry || !url)
    return (
      <svg ref={live} viewBox={viewBox} width={width} height={height} preserveAspectRatio={preserveAspectRatio} className={`${className} ${pad ? 'overflow-visible' : ''}`} style={style} aria-hidden="true">
        {children}
      </svg>
    );
  return <BakedImage boxRef={shown} url={url} className={className} style={style} fit={preserveAspectRatio} pad={pad} width={width} height={height} />;
}

// 구운 그림의 파일 주소를 만들고 (그림마다 한 번) 다시 그린다
function withUrl(e: Baked | null, redraw: (f: (n: number) => number) => void) {
  if (!e) return;
  const ready = urls.get(e);
  if (ready) return redraw((n) => n + 1);
  void fileUrl(e).then((u) => {
    if (!u) return;
    urls.set(e, u);
    redraw((n) => n + 1);
  });
}

const FIT_CLASS: Record<Fit, string> = { 'xMidYMid meet': 'object-contain', 'xMidYMax slice': 'object-cover object-bottom', none: 'object-fill' };

// 구운 그림. 같은 그림은 화면에 여러 개 있어도 파일 하나를 함께 쓴다.
// 번짐 여백(pad)이 있으면 칸보다 조금 크게, 칸 가운데에 놓는다 (원래 SVG 의 overflow-visible 과 같은 모양)
function BakedImage({ boxRef, url, className, style, fit, pad, width, height }: { boxRef: MutableRefObject<HTMLElement | null>; url: string; className: string; style?: CSSProperties; fit: Fit; pad: number; width?: number; height?: number }) {
  if (!pad)
    return <img ref={boxRef as MutableRefObject<HTMLImageElement | null>} src={url} alt="" aria-hidden="true" draggable={false} width={width} height={height} className={`${className} ${FIT_CLASS[fit]}`} style={style} data-baked="" />;
  const box: CSSProperties = width !== undefined ? { width, height, ...style } : { ...style };
  return (
    <span ref={boxRef as MutableRefObject<HTMLSpanElement | null>} aria-hidden="true" className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} ${width !== undefined ? 'inline-block' : 'block'} ${className}`} style={box} data-baked="">
      <img
        src={url}
        alt=""
        draggable={false}
        className={`pointer-events-none absolute max-w-none ${FIT_CLASS[fit]}`}
        style={{ left: `${-pad * 100}%`, top: `${-pad * 100}%`, width: `${(1 + 2 * pad) * 100}%`, height: `${(1 + 2 * pad) * 100}%` }}
      />
    </span>
  );
}

// 큰 SVG 안의 그림 한 덩이 (방 안의 가구). 구운 사진을 같은 자리에 <image> 로 놓는다
export function BakedG({ bakeKey, children }: { bakeKey: string; children: ReactNode }) {
  const live = useRef<SVGGElement>(null);
  const shown = useRef<SVGImageElement>(null);
  const [, redraw] = useState(0);
  const on = useBakeOn();
  const entry = on ? bakedEntry(bakeKey) : null;
  // 파일 주소가 준비된 것만 (아직이면 원래 그림을 그대로 둔다)
  const url = entry ? urls.get(entry) : undefined;

  const check = () => {
    const el = url ? shown.current : live.current;
    const ctm = el?.getScreenCTM();
    if (!el || !ctm) return;
    let viewBox = entry?.viewBox;
    let inner = entry?.inner;
    if (!entry) {
      const g = live.current;
      if (!g) return;
      const b = g.getBBox();
      if (b.width === 0 || b.height === 0) return;
      const m = Math.max(6, Math.max(b.width, b.height) * 0.08); // 물감 번짐 여백
      viewBox = `${b.x - m} ${b.y - m} ${b.width + 2 * m} ${b.height + 2 * m}`;
      inner = g.outerHTML;
    }
    const [, , w, h] = vb(viewBox!);
    const scale = Math.hypot(ctm.a, ctm.b);
    const [pw, ph] = pixelSize(w * scale, h * scale);
    if (entry && bigEnough(entry, pw, ph)) {
      if (!url) withUrl(entry, redraw);
      return;
    }
    void bake(bakeKey, inner!, viewBox!, pw, ph).then((e) => withUrl(e, redraw));
  };

  useEffect(() => {
    if (!on) return;
    return whenIdle(check);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bakeKey, url, on]);
  // 방 크기가 바뀌면 (크게 보기) 그 SVG 를 지켜본다
  const host = useRef<Element | null>(null);
  useEffect(() => {
    host.current = (url ? shown.current : live.current)?.ownerSVGElement ?? null;
  });
  useResize(host, check, on, url);

  if (!entry || !url) return <g ref={live}>{children}</g>;
  const [x, y, w, h] = vb(entry.viewBox);
  return <image ref={shown} href={url} x={x} y={y} width={w} height={h} preserveAspectRatio="none" data-baked="" />;
}

// 구운 그림의 파일 주소 (그림마다 한 번)
const urls = new WeakMap<Baked, string>();
