// 지역(수학 영역) 정의. 프로토타입에서는 locked: false 인 두 곳만 열린다.
export const REGIONS = [
  {
    id: 'acornVillage',
    name: 'Acorn Village',
    ko: '도토리 마을',
    topic: '수 세기 & 비교',
    resources: ['apple'],
    theme: 'bg-mint-200',
    locked: false,
  },
  {
    id: 'moonlightForest',
    name: 'Moonlight Forest',
    ko: '달빛 숲',
    topic: '덧셈 & 뺄셈',
    resources: ['branch'],
    theme: 'bg-lilac-200',
    locked: false,
  },
  {
    id: 'goldenHammerMine',
    name: 'Golden Hammer Mine',
    ko: '황금망치 광산',
    topic: '도형 & 공간',
    resources: ['stone', 'crystal'],
    theme: 'bg-butter-200',
    locked: true,
  },
  {
    id: 'emberVolcano',
    name: 'Ember Volcano',
    ko: '불씨 화산',
    topic: '패턴 & 규칙',
    resources: ['fireRock', 'crimsonGem'],
    theme: 'bg-peach-200',
    locked: true,
  },
  {
    id: 'azureHarbor',
    name: 'Azure Harbor',
    ko: '하늘빛 항구',
    topic: '분류 & 측정',
    resources: ['pearl', 'driftWood'],
    theme: 'bg-sky-200',
    locked: true,
  },
  {
    id: 'knightsCitadel',
    name: "Knight's Citadel",
    ko: '기사의 성채',
    topic: '종합 응용',
    resources: ['heroBadge'],
    theme: 'bg-rose-200',
    locked: true,
  },
];

export const getRegion = (id) => REGIONS.find((r) => r.id === id);
