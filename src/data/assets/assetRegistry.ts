// ===== Asset Registry: 그림 파일 경로를 한곳에서 관리 =====
// 모든 그림은 public/assets/ 아래에 둔다. 코드에서는 경로를 직접 쓰지 말고 여기 이름으로 부른다.
// 그림 파일이 없으면 화면은 자동으로 임시 그래픽을 그린다. (앱이 깨지지 않음)
//
// 경로는 늘 '.png' 로 적지만, 같은 이름의 '.webp' 를 넣으면 그 파일을 먼저 쓴다.
// (파일 이름 규칙은 public/assets/README.md, 그림 규칙은 docs/ART_BIBLE.md)

import AVAILABLE from 'virtual:asset-index';
import type { RegionId } from '../../types/resources';

// 빌드할 때 public/assets/ 에 실제로 있던 그림 (build/assetIndex.ts)
export const availableAssets = (): readonly string[] => AVAILABLE;

// ===== 같은 이름의 다른 형식 찾기 (.png 로 적은 경로 → 실제로 있는 .webp) =====
const withoutExtension = (path: string) => path.replace(/\.[a-z0-9]+$/i, '');
// 같은 이름의 파일이 여럿이면 이 순서로 고른다 (webp 가 가장 작다)
const FORMAT_ORDER = ['.webp', '.png'];
const formatRank = (file: string) => {
  const i = FORMAT_ORDER.findIndex((ext) => file.toLowerCase().endsWith(ext));
  return i === -1 ? FORMAT_ORDER.length : i;
};

// 파일 목록 → '확장자 뺀 이름' → '실제 파일' 표
export function indexAssets(files: readonly string[]): Map<string, string> {
  const byName = new Map<string, string>();
  for (const file of [...files].sort((a, b) => formatRank(a) - formatRank(b))) {
    const name = withoutExtension(file);
    if (!byName.has(name)) byName.set(name, file); // 앞선 형식이 이긴다
  }
  return byName;
}

const byName = indexAssets(AVAILABLE);

// 이 그림의 실제 파일 경로 (없으면 null). 'items/apple.png' → 'items/apple.webp' 일 수 있다.
export const resolveAsset = (path: string): string | null => byName.get(withoutExtension(path)) ?? null;

// 이 그림 파일이 있는지 (없으면 내려받지 않고 바로 임시 그래픽을 쓴다)
export const hasAsset = (path: string) => resolveAsset(path) !== null;

// public/assets/ 안의 경로를 실제 주소로 바꾼다 (있는 형식으로 바꿔 준다)
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}assets/${resolveAsset(path) ?? path}`;
}

// ===== 배경 =====
// 방 배경은 겹쳐 그리는 여러 장이다. 한 장이 없으면 그 겹만 코드로 그린다.
//  - roomBase: 바닥과 벽 (760×640). 창문·햇빛·계절은 이 그림에 그리지 않는다 (앱이 그 위에 그린다)
//  - windowSky: 창밖 하늘. 시간대마다 한 장 (해·달·별까지 그림에 넣는다)
//  - windowWoods: 창밖 숲. 계절마다 한 장 (날리는 꽃잎·나비·낙엽·눈까지 넣는다)
//  - titleScene: 타이틀 화면 풍경 (아직 화면에 연결하지 않았다 — 6단계)
export const BACKGROUNDS = {
  roomBase: 'backgrounds/room-base.png',
  titleScene: 'backgrounds/title-scene.png',
} as const;

// 창밖 그림의 시간대·계절 (src/features/room/timeOfDay.ts 의 TimeOfDay·Season 과 같아야 한다)
export const SKY_TIMES = ['day', 'evening', 'night'] as const;
export const WOODS_SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;

export const windowSkyPath = (time: (typeof SKY_TIMES)[number]) => `backgrounds/window-sky-${time}.png`;
export const windowWoodsPath = (season: (typeof WOODS_SEASONS)[number]) => `backgrounds/window-woods-${season}.png`;

// ===== 아직 화면에 연결하지 않은 그룹 (경로와 이름만 정해 둔다) =====
// 이름 규칙: 코드의 id 를 소문자-붙임표로 바꾼다 (foxKit → fox-kit, acornVillage → acorn-village)
export const kebab = (id: string) => id.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

// 지도의 마을 풍경 (160×110) — 6단계에서 RegionLandmark 에 연결한다
export const landmarkPath = (region: RegionId) => `landmarks/${kebab(region)}.png`;
// 방에 찾아오는 반려 친구 — 7단계에서 PetArt 에 연결한다
export const petPath = (pet: string) => `pets/${kebab(pet)}.png`;
// 루루의 모자·스카프 (루루 그림과 같은 120×150 좌표, 투명 배경) — 2단계에서 쓴다
export const outfitPath = (outfit: string) => `outfits/${kebab(outfit)}.png`;
