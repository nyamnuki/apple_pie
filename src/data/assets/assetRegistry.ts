// ===== Asset Registry: 그림 파일 경로를 한곳에서 관리 =====
// 모든 그림은 public/assets/ 아래에 둔다. 코드에서는 경로를 직접 쓰지 말고 여기 이름으로 부른다.
// 그림 파일이 없으면 화면은 자동으로 임시 그래픽을 그린다. (앱이 깨지지 않음)

import AVAILABLE from 'virtual:asset-index';

// 빌드할 때 public/assets/ 에 실제로 있던 그림 (build/assetIndex.ts)
const available = new Set(AVAILABLE);
export const availableAssets = (): readonly string[] => AVAILABLE;

// 이 그림 파일이 있는지 (없으면 내려받지 않고 바로 임시 그래픽을 쓴다)
export const hasAsset = (path: string) => available.has(path);

// public/assets/ 안의 경로를 실제 주소로 바꾼다
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}assets/${path}`;
}

// 방 배경: 바닥과 벽이 함께 그려진 한 장짜리 그림 (방 좌표 760×640 크기에 맞춘다)
export const BACKGROUNDS = {
  roomBase: 'backgrounds/room-base.png',
} as const;


