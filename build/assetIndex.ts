import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import type { Plugin } from 'vite';

// ===== 그림 파일 목록 =====
// public/assets/ 안에 실제로 있는 그림 파일 목록을 빌드할 때 만들어 'virtual:asset-index' 로 넘긴다.
// 앱은 목록에 없는 그림을 아예 내려받으려 하지 않는다 (없는 그림마다 생기던 404 요청이 사라진다).
// 그림을 새로 넣으면 개발 서버를 다시 켜거나 다시 빌드하면 된다.
export const ASSET_DIR = join(process.cwd(), 'public', 'assets');
const IMAGE = /\.(png|webp|svg|jpe?g)$/i;

export function listAssets(dir = ASSET_DIR): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (IMAGE.test(name)) out.push(relative(dir, p).split(sep).join('/'));
    }
  };
  walk(dir);
  return out.sort();
}

const ID = 'virtual:asset-index';

export function assetIndex(): Plugin {
  return {
    name: 'math-town-asset-index',
    resolveId: (id) => (id === ID ? '\0' + ID : null),
    load: (id) => (id === '\0' + ID ? `export default ${JSON.stringify(listAssets())};` : null),
  };
}
