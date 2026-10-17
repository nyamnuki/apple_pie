// 건물 정의. costs[n] 은 레벨 n → n+1 로 올릴 때 필요한 자원이다. (최대 레벨 3)
export const MAX_BUILDING_LEVEL = 3;

export const BUILDINGS = {
  acornBurrow: {
    name: 'Acorn Burrow',
    ko: '도토리 굴집',
    costs: [{ apple: 2 }, { apple: 5 }, { apple: 8, branch: 3 }],
  },
  fairyCottage: {
    name: 'Fairy Cottage',
    ko: '요정 오두막',
    costs: [{ branch: 3 }, { branch: 6, apple: 3 }, { branch: 10, apple: 5 }],
  },
  workshop: {
    name: 'Little Workshop',
    ko: '꼬마 작업장',
    costs: [{ apple: 4, branch: 2 }, { apple: 6, branch: 6 }, { apple: 10, branch: 10 }],
  },
  forge: {
    name: 'Treasure Forge',
    ko: '보물 제련소',
    costs: [{ apple: 5, branch: 5 }, { apple: 8, branch: 8 }, { apple: 12, branch: 12 }],
  },
};

export const BUILDING_KEYS = Object.keys(BUILDINGS);
