import type { FurnitureDef } from '../../types/furniture';

// ===== 가구 목록 =====
// 새 가구를 추가하려면:
//  1) 여기에 한 줄 추가 (unlockCondition: 처음부터 가짐 / 공방 레시피)  2) en.ts / ko.ts 의 furniture 에 이름·설명 추가
//  3) (선택) public/assets/furniture/ 에 그림 넣기 — 없으면 임시 상자로 보인다
//
// 그림 규칙 (모든 가구가 같은 각도·조명으로 보이게):
//  - 2:1 아이소메트릭 시점, 빛은 왼쪽 위에서, 배경은 투명한 PNG
//  - 그림의 '아래 가운데'가 가구가 차지한 바닥 영역의 '맨 아래 꼭짓점'에 맞춰진다
//  - 바닥 한 칸 = 가로 120 × 세로 60 (방 좌표 단위). width 는 보통 (gridWidth + gridHeight) × 60

export const FURNITURE: FurnitureDef[] = [
  {
    id: 'leafBed',
    nameKey: 'furniture.leafBed.name',
    descriptionKey: 'furniture.leafBed.description',
    assetPath: 'furniture/leaf-bed.png',
    category: 'bed',
    width: 300,
    height: 220,
    gridWidth: 2,
    gridHeight: 3,
    unlockCondition: { type: 'starter' },
    placeholder: { color: '#A8C3A0', emoji: '🛏️', height: 45 },
  },
  {
    id: 'petalRug',
    nameKey: 'furniture.petalRug.name',
    descriptionKey: 'furniture.petalRug.description',
    assetPath: 'furniture/petal-rug.png',
    category: 'rug',
    width: 240,
    height: 130,
    gridWidth: 2,
    gridHeight: 2,
    unlockCondition: { type: 'starter' },
    placeholder: { color: '#F3C6D2', emoji: '🌸', height: 4 },
  },
  {
    id: 'mushroomLamp',
    nameKey: 'furniture.mushroomLamp.name',
    descriptionKey: 'furniture.mushroomLamp.description',
    assetPath: 'furniture/mushroom-lamp.png',
    category: 'light',
    width: 120,
    height: 200,
    gridWidth: 1,
    gridHeight: 1,
    unlockCondition: { type: 'starter' },
    placeholder: { color: '#F5D0AD', emoji: '🍄', height: 100 },
  },
  {
    id: 'forestBookshelf',
    nameKey: 'furniture.forestBookshelf.name',
    descriptionKey: 'furniture.forestBookshelf.description',
    assetPath: 'furniture/forest-bookshelf.png',
    category: 'storage',
    width: 180,
    height: 260,
    gridWidth: 2,
    gridHeight: 1,
    unlockCondition: { type: 'recipe', cost: { acorn: 4, apple: 2 } },
    placeholder: { color: '#B9855A', emoji: '📚', height: 150 },
  },
  {
    id: 'woodenDesk',
    nameKey: 'furniture.woodenDesk.name',
    descriptionKey: 'furniture.woodenDesk.description',
    assetPath: 'furniture/wooden-desk.png',
    category: 'table',
    width: 180,
    height: 170,
    gridWidth: 2,
    gridHeight: 1,
    unlockCondition: { type: 'recipe', cost: { acorn: 5, goldenAcorn: 1 } },
    placeholder: { color: '#C99A6E', emoji: '✏️', height: 65 },
  },
  {
    id: 'flowerPot',
    nameKey: 'furniture.flowerPot.name',
    descriptionKey: 'furniture.flowerPot.description',
    assetPath: 'furniture/flower-pot.png',
    category: 'plant',
    width: 120,
    height: 140,
    gridWidth: 1,
    gridHeight: 1,
    unlockCondition: { type: 'starter' },
    placeholder: { color: '#D9D0EC', emoji: '🪴', height: 45 },
  },
  {
    id: 'toyChest',
    nameKey: 'furniture.toyChest.name',
    descriptionKey: 'furniture.toyChest.description',
    assetPath: 'furniture/toy-chest.png',
    category: 'storage',
    width: 120,
    height: 130,
    gridWidth: 1,
    gridHeight: 1,
    unlockCondition: { type: 'recipe', cost: { acorn: 3, apple: 3 } },
    placeholder: { color: '#A8744A', emoji: '🧸', height: 55 },
  },
  {
    id: 'woodlandWallpaper',
    nameKey: 'furniture.woodlandWallpaper.name',
    descriptionKey: 'furniture.woodlandWallpaper.description',
    // 벽지 그림은 이음새 없이 반복되는 정사각형 무늬 (120×120 권장)
    assetPath: 'furniture/woodland-wallpaper.png',
    category: 'wallpaper',
    width: 120,
    height: 120,
    gridWidth: 0,
    gridHeight: 0,
    unlockCondition: { type: 'recipe', cost: { glowBranch: 3, acorn: 2 } },
    placeholder: { color: '#A8C3A0', emoji: '🌿', height: 0 },
  },
];

const BY_ID = new Map(FURNITURE.map((f) => [f.id, f]));

// id 로 가구 정의 찾기
export function getFurniture(id: string): FurnitureDef | undefined {
  return BY_ID.get(id);
}
