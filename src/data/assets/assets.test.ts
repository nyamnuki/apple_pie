import { describe, expect, it } from 'vitest';
import { BACKGROUNDS, availableAssets } from './assetRegistry';
import { FURNITURE } from '../furniture/furniture';
import { RESOURCES } from '../resources/resources';
import { MATH_ITEMS } from '../math/items';
import { CHARACTERS, EXPRESSIONS, characterAssetPath, type CharacterId } from '../characters/characters';

// 그림 경로 점검: 코드가 찾는 그림 이름이 규칙에 맞는지, public/assets/ 에 넣은 그림을 코드가 실제로 쓰는지
// (이름을 잘못 지어 넣은 그림은 '쓰이지 않는 그림'으로 잡힌다)

const wanted: { group: string; path: string }[] = [
  ...Object.values(BACKGROUNDS).map((path) => ({ group: 'background', path })),
  ...(Object.keys(CHARACTERS) as CharacterId[]).flatMap((id) => EXPRESSIONS.map((e) => ({ group: 'character', path: characterAssetPath(id, e) }))),
  ...FURNITURE.map((f) => ({ group: 'furniture', path: f.assetPath })),
  ...Object.values(MATH_ITEMS).map((m) => ({ group: 'mathItem', path: m.assetPath })),
  ...RESOURCES.map((r) => ({ group: 'resource', path: r.assetPath })),
];
const FOLDER: Record<string, string> = { background: 'backgrounds/', character: 'characters/', furniture: 'furniture/', mathItem: 'items/', resource: 'items/res-' };

describe('그림 경로', () => {
  it('모든 그림 이름은 정해진 폴더·소문자·.png 이고 서로 겹치지 않는다', () => {
    for (const { group, path } of wanted) {
      expect(path.startsWith(FOLDER[group]), path).toBe(true);
      expect(path, path).toMatch(/^[a-z]+\/[a-z0-9-]+\.png$/);
    }
    const paths = wanted.map((w) => w.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('public/assets/ 에 넣은 그림은 모두 코드가 쓰는 이름이다 (이름 오타 찾기)', () => {
    const known = new Set(wanted.map((w) => w.path));
    expect(availableAssets().filter((f) => !known.has(f))).toEqual([]);
  });

  it('그림 현황 (있는 것 / 임시 그래픽으로 보이는 것)', () => {
    const have = new Set(availableAssets());
    const summary = Object.fromEntries(
      Object.keys(FOLDER).map((g) => {
        const list = wanted.filter((w) => w.group === g);
        return [g, `${list.filter((w) => have.has(w.path)).length}/${list.length}`];
      }),
    );
    console.info('그림 현황 (있음/전체):', summary);
    expect(Object.keys(summary)).toHaveLength(5);
  });
});
