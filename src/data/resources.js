// 자원 정의. key 는 저장 데이터(resources)의 키와 같다.
// rare: true 인 자원은 제련소에서 보물 재료로 쓰인다.
export const RESOURCES = {
  apple: { name: 'Sweet Apple', ko: '달콤 사과', color: 'bg-rose-200' },
  branch: { name: 'Glow Branch', ko: '빛나는 나뭇가지', color: 'bg-butter-200' },
  stone: { name: 'Iron Stone', ko: '무쇠 돌', color: 'bg-sky-200' },
  crystal: { name: 'Magic Crystal', ko: '마법 수정', color: 'bg-lilac-200', rare: true },
  fireRock: { name: 'Fire Rock', ko: '불꽃 바위', color: 'bg-peach-200' },
  crimsonGem: { name: 'Crimson Gem', ko: '진홍 보석', color: 'bg-rose-200', rare: true },
  pearl: { name: 'Sea Pearl', ko: '바다 진주', color: 'bg-sky-100', rare: true },
  driftWood: { name: 'Drift Wood', ko: '떠내려온 나무', color: 'bg-peach-100' },
  heroBadge: { name: 'Hero Badge', ko: '영웅 배지', color: 'bg-butter-400', rare: true },
};

export const RESOURCE_KEYS = Object.keys(RESOURCES);
