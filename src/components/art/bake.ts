// ===== 수채화 그림을 한 번만 그려 두기 =====
// 수채화 효과(SVG 필터: 물감 번짐·알갱이)는 아름답지만 아주 무겁다. 브라우저는 그 그림이 있는 곳을
// 다시 그릴 때마다(옆에서 무언가 움직이기만 해도) 필터를 처음부터 다시 계산한다. 휴대폰에서는 이것이 '렉'이 된다.
// 그래서 그림을 처음 한 번만 필터까지 캔버스에 그려 작은 PNG 로 만들어 두고, 화면에는 그 사진을 놓는다.
// 사진은 다시 그려도 거의 일이 없고, 같은 그림이 여러 개여도 사진 하나를 함께 쓴다. 모양은 똑같다.
// - 큰 그림(방 바닥·벽, 타이틀 풍경)은 굽지 않는다: 처음 굽는 일이 커서 첫 화면에서 누르는 것이 늦어진다.
//   대신 따로 한 층(will-change)에 그려 다른 것이 움직여도 다시 그리지 않게 한다
//
// - 같은 그림(같은 key·같은 크기)은 앱 전체에서 한 번만 굽는다
// - 굽기 전이나 구울 수 없는 브라우저에서는 원래 SVG 를 그대로 보여 준다 (앱은 그대로 동작)
// - 바깥 파일을 부르는 그림(<image>)이나 글자(<text>)가 든 그림은 굽지 않는다
//   (사진으로 만들 때는 바깥 파일·글꼴을 쓸 수 없다)

const SVG_NS = 'http://www.w3.org/2000/svg';
const MAX_SIDE = 2400; // 사진 한 변의 최대 픽셀 (메모리)
const MAX_ENTRIES = 160; // 기억해 두는 사진 수 (오래 안 쓴 것부터 지운다)

// 구워 둔 그림 하나: 캔버스와 픽셀 크기, 다시 (더 크게) 구울 때 쓸 원래 그림 글과 영역
// url: 사진 파일 주소 (처음 쓸 때 한 번 만든다)
export interface Baked {
  canvas: HTMLCanvasElement;
  url?: Promise<string | null>;
  w: number;
  h: number;
  inner: string;
  viewBox: string;
  used: number;
}
const done = new Map<string, Baked>();
const pending = new Map<string, Promise<Baked | null>>();
let clock = 0;
let broken = false; // 이 브라우저에서 굽기가 안 되면 다시 시도하지 않는다

// 이미 구워 둔 사진 (없으면 null). 화면을 처음 그릴 때 바로 쓸 수 있게 동기로 돌려준다
export function bakedEntry(key: string): Baked | null {
  const e = done.get(key);
  if (!e) return null;
  e.used = ++clock;
  return e;
}

export const canBake = () => !broken && typeof document !== 'undefined' && typeof URL !== 'undefined' && 'createObjectURL' in URL;

// 그림이 부르는 바깥 정의(필터·그러데이션·무늬: url(#id), href="#id")를 문서에서 찾아 함께 넣는다
function collectDefs(markup: string): string {
  const seen = new Set<string>();
  const out: string[] = [];
  const scan = (text: string) => {
    for (const m of text.matchAll(/url\(#([\w-]+)\)|href="#([\w-]+)"/g)) {
      const id = m[1] ?? m[2];
      if (seen.has(id) || markup.includes(`id="${id}"`)) continue;
      seen.add(id);
      const el = document.getElementById(id);
      if (!el) continue;
      const html = el.outerHTML;
      out.push(html);
      scan(html);
    }
  };
  scan(markup);
  return out.length ? `<defs>${out.join('')}</defs>` : '';
}

// 사진으로 만들 수 없는 그림인지 (바깥 그림 파일, 글자)
function unbakeable(markup: string) {
  return /<text[\s>]|<foreignObject/.test(markup) || /<image[^>]+href="(?!data:)[^"]+"/.test(markup);
}

async function rasterize(svgText: string, w: number, h: number): Promise<HTMLCanvasElement> {
  const src = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no canvas');
    ctx.drawImage(img, 0, 0, w, h);
    return canvas;
  } finally {
    URL.revokeObjectURL(src);
  }
}

function remember(key: string, entry: Baked) {
  done.set(key, entry);
  if (done.size <= MAX_ENTRIES) return;
  // 오래 안 쓴 것부터 목록에서 뺀다. 파일 주소는 지우지 않는다 (아직 화면에 있는 그림이 쓰고 있을 수 있다)
  const old = [...done.entries()].sort((a, b) => a[1].used - b[1].used).slice(0, done.size - MAX_ENTRIES);
  for (const [k] of old) done.delete(k);
}

// 픽셀 크기 정하기: 화면에 보이는 크기 × 화면 밀도 (너무 크면 줄인다)
export function pixelSize(cssW: number, cssH: number): [number, number] {
  // 언제나 2배로 굽는다: 1배 화면에서도 또렷하고, 3배 화면에서도 수채화 그림은 차이가 거의 안 보인다
  // (3배로 구우면 처음 한 번 그리는 일이 2.25배 많아진다)
  const dpr = 2;
  let w = Math.max(1, Math.round(cssW * dpr));
  let h = Math.max(1, Math.round(cssH * dpr));
  const s = Math.min(1, MAX_SIDE / Math.max(w, h));
  w = Math.max(1, Math.round(w * s));
  h = Math.max(1, Math.round(h * s));
  return [w, h];
}

// 이 크기로 쓰기에 사진이 충분히 큰지 (조금 작은 것은 그대로 쓴다: 차이가 안 보인다)
export const bigEnough = (e: Baked, w: number, h: number) => e.w >= w * 0.85 && e.h >= h * 0.85;

// 그림 굽기. inner: <svg> 안에 들어갈 글, viewBox: 구울 영역, w·h: 사진 픽셀 크기
// 이미 충분히 큰 사진이 있으면 그것을 쓴다. 구울 수 없으면 null
export function bake(key: string, inner: string, viewBox: string, w: number, h: number): Promise<Baked | null> {
  const ready = bakedEntry(key);
  if (ready && bigEnough(ready, w, h)) return Promise.resolve(ready);
  const running = pending.get(key);
  if (running) return running;
  if (!canBake() || unbakeable(inner)) return Promise.resolve(null);
  const svgText = `<svg xmlns="${SVG_NS}" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${viewBox}" width="${w}" height="${h}" preserveAspectRatio="none">${collectDefs(inner)}${inner}</svg>`;
  const job = rasterize(svgText, w, h)
    .then((canvas) => {
      const entry: Baked = { canvas, w, h, inner, viewBox, used: ++clock };
      remember(key, entry);
      return entry;
    })
    .catch(() => {
      broken = true; // 이 브라우저는 굽기가 안 된다: 원래 SVG 를 계속 쓴다
      return null;
    })
    .finally(() => pending.delete(key));
  pending.set(key, job);
  return job;
}

// 사진 파일 주소. 한 번만 만든다
export function fileUrl(e: Baked): Promise<string | null> {
  e.url ??= new Promise<Blob | null>((r) => e.canvas.toBlob(r, 'image/png')).then((b) => (b ? URL.createObjectURL(b) : null)).catch(() => null);
  return e.url;
}

// 급하지 않은 일은 브라우저가 한가할 때 (첫 화면을 먼저 보여 준다)
export function whenIdle(fn: () => void): () => void {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(fn, { timeout: 2000 });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, 200);
  return () => window.clearTimeout(id);
}
