// 이미지 경로 한곳 모음.
// 지금은 emoji 로 표시하고, public/images/ 아래에 같은 이름의 파일을 넣으면
// <GameImage> 가 자동으로 실제 그림을 쓴다. (파일이 없으면 emoji 로 대체)
const BASE = `${import.meta.env.BASE_URL}images`;

export const IMAGES = {
  ui: {
    logo: { src: `${BASE}/ui/logo.png`, emoji: '🏰' },
    townBackground: { src: `${BASE}/ui/town-bg.png`, emoji: '🌳' },
    nightSky: { src: `${BASE}/ui/night-sky.png`, emoji: '🌙' },
  },
  characters: {
    mascot: { src: `${BASE}/characters/squirrel.png`, emoji: '🐿️' },
  },
  regions: {
    acornVillage: { src: `${BASE}/regions/acorn-village.png`, emoji: '🌰' },
    moonlightForest: { src: `${BASE}/regions/moonlight-forest.png`, emoji: '🌲' },
    goldenHammerMine: { src: `${BASE}/regions/golden-hammer-mine.png`, emoji: '⛏️' },
    emberVolcano: { src: `${BASE}/regions/ember-volcano.png`, emoji: '🌋' },
    azureHarbor: { src: `${BASE}/regions/azure-harbor.png`, emoji: '⚓' },
    knightsCitadel: { src: `${BASE}/regions/knights-citadel.png`, emoji: '🏯' },
  },
  resources: {
    apple: { src: `${BASE}/resources/apple.png`, emoji: '🍎' },
    branch: { src: `${BASE}/resources/glow-branch.png`, emoji: '🪵' },
    stone: { src: `${BASE}/resources/iron-stone.png`, emoji: '🪨' },
    crystal: { src: `${BASE}/resources/magic-crystal.png`, emoji: '💎' },
    fireRock: { src: `${BASE}/resources/fire-rock.png`, emoji: '🔥' },
    crimsonGem: { src: `${BASE}/resources/crimson-gem.png`, emoji: '❤️‍🔥' },
    pearl: { src: `${BASE}/resources/sea-pearl.png`, emoji: '🫧' },
    driftWood: { src: `${BASE}/resources/drift-wood.png`, emoji: '🪵' },
    heroBadge: { src: `${BASE}/resources/hero-badge.png`, emoji: '🎖️' },
  },
  // 건물은 레벨별(0=빈 터, 1~3) 그림을 둔다
  buildings: {
    acornBurrow: levels('acorn-burrow', ['🟫', '🕳️', '🏡', '🏘️']),
    fairyCottage: levels('fairy-cottage', ['🟫', '🛖', '🏠', '🧚']),
    workshop: levels('workshop', ['🟫', '⛺', '🏚️', '🏭']),
    forge: levels('forge', ['🟫', '🔨', '⚒️', '🔮']),
  },
};

// 'name-1.png', 'name-2.png' … 처럼 레벨별 경로를 만든다
function levels(name, emojis) {
  return emojis.map((emoji, lv) => ({ src: `${BASE}/buildings/${name}-${lv}.png`, emoji }));
}
