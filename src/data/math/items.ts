import type { MathItemId } from '../../types/math';

// 수학 놀이 물건의 그림. public/assets/items/ 에 같은 이름의 그림을 넣으면 그림으로 바뀐다.
// counter: 세는 말의 종류 (한국어 '개·마리·송이'. 언어 파일 counters.<종류>)
export type ItemCounter = 'thing' | 'animal' | 'bloom';
export const MATH_ITEMS: Record<MathItemId, { emoji: string; assetPath: string; counter: ItemCounter }> = {
  apple: { emoji: '🍎', assetPath: 'items/apple.png', counter: 'thing' },
  pear: { emoji: '🍐', assetPath: 'items/pear.png', counter: 'thing' },
  mushroom: { emoji: '🍄', assetPath: 'items/mushroom.png', counter: 'thing' },
  acorn: { emoji: '🌰', assetPath: 'items/acorn.png', counter: 'thing' },
  leaf: { emoji: '🍃', assetPath: 'items/leaf.png', counter: 'thing' },
  flower: { emoji: '🌼', assetPath: 'items/flower.png', counter: 'bloom' },
  butterfly: { emoji: '🦋', assetPath: 'items/butterfly.png', counter: 'animal' },
  ladybug: { emoji: '🐞', assetPath: 'items/ladybug.png', counter: 'animal' },
  frog: { emoji: '🐸', assetPath: 'items/frog.png', counter: 'animal' },
  blueberry: { emoji: '🫐', assetPath: 'items/blueberry.png', counter: 'thing' },
  cookie: { emoji: '🍪', assetPath: 'items/cookie.png', counter: 'thing' },
  moon: { emoji: '🌙', assetPath: 'items/moon.png', counter: 'thing' },
  star: { emoji: '⭐', assetPath: 'items/star.png', counter: 'thing' },
  owl: { emoji: '🦉', assetPath: 'items/owl.png', counter: 'animal' },
  gem: { emoji: '💎', assetPath: 'items/gem.png', counter: 'thing' },
  pebble: { emoji: '🪨', assetPath: 'items/pebble.png', counter: 'thing' },
  bat: { emoji: '🦇', assetPath: 'items/bat.png', counter: 'animal' },
  candle: { emoji: '🕯️', assetPath: 'items/candle.png', counter: 'thing' },
  bee: { emoji: '🐝', assetPath: 'items/bee.png', counter: 'animal' },
  sunflower: { emoji: '🌻', assetPath: 'items/sunflower.png', counter: 'bloom' },
  snail: { emoji: '🐌', assetPath: 'items/snail.png', counter: 'animal' },
  cloud: { emoji: '☁️', assetPath: 'items/cloud.png', counter: 'thing' },
  kite: { emoji: '🪁', assetPath: 'items/kite.png', counter: 'thing' },
  windmill: { emoji: '🌬️', assetPath: 'items/windmill.png', counter: 'thing' },
  dandelion: { emoji: '🌼', assetPath: 'items/dandelion.png', counter: 'bloom' },
  bird: { emoji: '🐦', assetPath: 'items/bird.png', counter: 'animal' },
  fish: { emoji: '🐟', assetPath: 'items/fish.png', counter: 'animal' },
  duck: { emoji: '🦆', assetPath: 'items/duck.png', counter: 'animal' },
  shell: { emoji: '🐚', assetPath: 'items/shell.png', counter: 'thing' },
  lily: { emoji: '🪷', assetPath: 'items/lily.png', counter: 'bloom' },
};

// 물건 이름 번역 키 (규칙 문제의 답 버튼, 화면 읽기용)
export const itemNameKey = (id: MathItemId) => `mathItems.${id}` as const;

// 문장 속 물건 낱말 번역 키: 여럿(영어 'pears', 문장 가운데라 소문자) / 하나('pear') / 세는 말(한국어 '개')
export const itemManyKey = (id: MathItemId) => `itemsMany.${id}` as const;
export const itemOneKey = (id: MathItemId) => `itemsOne.${id}` as const;
export const itemCounterKey = (id: MathItemId) => `counters.${MATH_ITEMS[id].counter}` as const;
