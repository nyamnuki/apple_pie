import type { Plugin } from 'vite';
import { listAssets } from './assetIndex';

// ===== 인터넷 없이 실행 (서비스 워커) =====
// 빌드할 때 dist/sw.js 를 만든다. 그 안에 이번 빌드의 모든 파일 목록을 넣어 두면,
// 처음 한 번 열 때 휴대폰에 전부 내려받아 두고 다음부터는 인터넷이 없어도 열린다.
// 파일 목록이 바뀌면 sw.js 내용도 바뀌므로, 새로 배포하면 휴대폰이 알아서 새 버전으로 바꾼다.
export function offline(): Plugin {
  return {
    name: 'math-town-offline',
    apply: 'build',
    generateBundle(_options, bundle) {
      const built = Object.keys(bundle).filter((f) => !f.endsWith('.map'));
      // public/assets/ 의 그림도 함께 저장해 둔다 (그림을 바꾸면 목록이 바뀌어 새 버전이 된다)
      const pictures = listAssets().map((f) => `./assets/${f}`);
      const files = ['./', ...built.map((f) => `./${f}`), ...pictures, './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
      const version = [...built.filter((f) => f.startsWith('assets/')).sort(), ...pictures].join('|');
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: serviceWorker(files, version) });
    },
  };
}

function serviceWorker(files: string[], version: string): string {
  return `// 자동으로 만든 파일 (build/offline.ts). 직접 고치지 마세요.
const CACHE = 'math-town-' + ${JSON.stringify(hash(version))};
const FILES = ${JSON.stringify([...new Set(files)])};
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// 설치: 이번 버전의 파일을 모두 내려받아 둔다
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

// 새 버전이 켜지면 옛 버전 파일은 지운다
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('math-town-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 첫 화면(index.html): 인터넷이 되면 새로 받고, 안 되면 저장해 둔 것
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./', copy));
          return res;
        })
        .catch(() => caches.match('./')),
    );
    return;
  }

  // 글꼴: 한 번 받은 것은 저장해 두고 쓴다
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })),
    );
    return;
  }

  // 같은 사이트의 파일: 저장해 둔 것이 있으면 바로, 없으면 받아서 저장
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })),
    );
  }
});
`;
}

// 짧은 버전 이름 (파일 목록이 같으면 같은 값)
function hash(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
