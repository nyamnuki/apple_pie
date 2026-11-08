import { describe, expect, it } from 'vitest';
import {
  BACKGROUNDS,
  SKY_TIMES,
  WOODS_SEASONS,
  availableAssets,
  hasAsset,
  indexAssets,
  kebab,
  landmarkPath,
  outfitPath,
  petPath,
  windowSkyPath,
  windowWoodsPath,
} from './assetRegistry';
import { FURNITURE } from '../furniture/furniture';
import { RESOURCES } from '../resources/resources';
import { MATH_ITEMS } from '../math/items';
import { REGIONS } from '../regions/regions';
import { STICKERS, stickerEmoji } from '../stickers/stickers';
import { CHARACTERS, EXPRESSIONS, characterAssetPath, type CharacterId } from '../characters/characters';
import { OUTFITS } from '../../features/outfits/outfits';
import { PETS } from '../../features/pets/pets';
import { ITEM_ART } from '../../components/art/itemArt';

// 그림 경로 점검: 코드가 찾는 그림 이름이 규칙에 맞는지, public/assets/ 에 넣은 그림을 코드가 실제로 쓰는지
// (이름을 잘못 지어 넣은 그림은 '쓰이지 않는 그림'으로 잡힌다)

const wanted: { group: string; path: string }[] = [
  ...Object.values(BACKGROUNDS).map((path) => ({ group: 'background', path })),
  ...SKY_TIMES.map((t) => ({ group: 'windowSky', path: windowSkyPath(t) })),
  ...WOODS_SEASONS.map((s) => ({ group: 'windowWoods', path: windowWoodsPath(s) })),
  ...(Object.keys(CHARACTERS) as CharacterId[]).flatMap((id) => EXPRESSIONS.map((e) => ({ group: 'character', path: characterAssetPath(id, e) }))),
  ...FURNITURE.map((f) => ({ group: 'furniture', path: f.assetPath })),
  ...Object.values(MATH_ITEMS).map((m) => ({ group: 'mathItem', path: m.assetPath })),
  ...RESOURCES.map((r) => ({ group: 'resource', path: r.assetPath })),
  ...REGIONS.map((r) => ({ group: 'landmark', path: landmarkPath(r.id) })),
  ...PETS.map((p) => ({ group: 'pet', path: petPath(p.id) })),
  ...OUTFITS.map((o) => ({ group: 'outfit', path: outfitPath(o.id) })),
];
const FOLDER: Record<string, string> = {
  background: 'backgrounds/',
  windowSky: 'backgrounds/window-sky-',
  windowWoods: 'backgrounds/window-woods-',
  character: 'characters/',
  furniture: 'furniture/',
  mathItem: 'items/',
  resource: 'items/res-',
  landmark: 'landmarks/',
  pet: 'pets/',
  outfit: 'outfits/',
};
// 그림을 넣을 수 있는 형식 (경로는 늘 .png 로 적고, 같은 이름의 .webp 를 넣으면 그 파일을 쓴다)
const ALLOWED = /\.(png|webp)$/;

describe('그림 경로', () => {
  it('모든 그림 이름은 정해진 폴더·소문자·.png 이고 서로 겹치지 않는다', () => {
    for (const { group, path } of wanted) {
      expect(path.startsWith(FOLDER[group]), path).toBe(true);
      expect(path, path).toMatch(/^[a-z]+\/[a-z0-9-]+\.png$/);
    }
    const paths = wanted.map((w) => w.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('id 를 파일 이름으로 바꾸는 규칙 (foxKit → fox-kit)', () => {
    expect(kebab('foxKit')).toBe('fox-kit');
    expect(kebab('acornVillage')).toBe('acorn-village');
    expect(kebab('turtle')).toBe('turtle');
    expect(petPath('foxKit')).toBe('pets/fox-kit.png');
    expect(landmarkPath('moonlightForest')).toBe('landmarks/moonlight-forest.png');
    expect(outfitPath('rainbowScarf')).toBe('outfits/rainbow-scarf.png');
  });

  it('같은 이름의 .webp 가 있으면 .png 로 적은 경로가 그 파일을 가리킨다', () => {
    const both = indexAssets(['items/apple.png', 'items/apple.webp', 'items/pear.png']);
    expect(both.get('items/apple')).toBe('items/apple.webp');
    expect(both.get('items/pear')).toBe('items/pear.png');
    expect(indexAssets(['furniture/leaf-bed.webp']).get('furniture/leaf-bed')).toBe('furniture/leaf-bed.webp');
  });

  it('public/assets/ 에 넣은 그림은 모두 코드가 쓰는 이름이다 (이름 오타 찾기)', () => {
    const known = new Set(wanted.map((w) => w.path.replace(/\.png$/, '')));
    const unused = availableAssets().filter((f) => !known.has(f.replace(ALLOWED, '')));
    expect(unused).toEqual([]);
  });

  it('넣은 그림은 모두 .png 또는 .webp 이다', () => {
    expect(availableAssets().filter((f) => !ALLOWED.test(f))).toEqual([]);
  });

  it('스티커는 물건·재료 그림을 그대로 쓴다 (AssetIcon 경로 통일)', () => {
    const itemPaths = new Set(wanted.filter((w) => w.group === 'mathItem' || w.group === 'resource').map((w) => w.path));
    const emoji: Record<string, string> = {
      ...Object.fromEntries(Object.values(MATH_ITEMS).map((m) => [m.assetPath, m.emoji])),
      ...Object.fromEntries(RESOURCES.map((r) => [r.assetPath, r.placeholder.emoji])),
    };
    for (const s of STICKERS) {
      expect(itemPaths.has(s.art), s.art).toBe(true); // 그림 파일을 넣으면 스티커도 함께 바뀐다
      expect(ITEM_ART[s.art], s.art).toBeDefined(); // 파일이 없을 때 그릴 수채화 그림
      expect(stickerEmoji(s.art), s.art).toBe(emoji[s.art]); // 마지막 대비책: 물건·재료와 같은 그림 문자
    }
  });

  it('그림 현황 (있는 것 / 임시 그래픽으로 보이는 것)', () => {
    const summary = Object.fromEntries(
      Object.keys(FOLDER).map((g) => {
        const list = wanted.filter((w) => w.group === g);
        return [g, `${list.filter((w) => hasAsset(w.path)).length}/${list.length}`];
      }),
    );
    console.info('그림 현황 (있음/전체):', summary);
    expect(Object.keys(summary)).toHaveLength(Object.keys(FOLDER).length);
  });
});
