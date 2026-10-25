import type { MathItemId } from '../../types/math';

// 수학 놀이 물건의 그림. public/assets/items/ 에 같은 이름의 그림을 넣으면 그림으로 바뀐다.
export const MATH_ITEMS: Record<MathItemId, { emoji: string; assetPath: string }> = {
  apple: { emoji: '🍎', assetPath: 'items/apple.png' },
  pear: { emoji: '🍐', assetPath: 'items/pear.png' },
  mushroom: { emoji: '🍄', assetPath: 'items/mushroom.png' },
  acorn: { emoji: '🌰', assetPath: 'items/acorn.png' },
  leaf: { emoji: '🍃', assetPath: 'items/leaf.png' },
  flower: { emoji: '🌼', assetPath: 'items/flower.png' },
  butterfly: { emoji: '🦋', assetPath: 'items/butterfly.png' },
  ladybug: { emoji: '🐞', assetPath: 'items/ladybug.png' },
  frog: { emoji: '🐸', assetPath: 'items/frog.png' },
  blueberry: { emoji: '🫐', assetPath: 'items/blueberry.png' },
  cookie: { emoji: '🍪', assetPath: 'items/cookie.png' },
};
