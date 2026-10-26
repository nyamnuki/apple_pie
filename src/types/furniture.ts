import type { TranslationKey } from '../i18n';
import type { ResourceBundle } from './resources';

// 가구 종류. 'rug' 는 바닥에 깔리므로 다른 가구가 위에 올라설 수 있다.
export type FurnitureCategory = 'bed' | 'rug' | 'light' | 'storage' | 'table' | 'seat' | 'plant' | 'decor' | 'wallpaper' | 'wall';

// 얻는 방법
export type UnlockCondition =
  | { type: 'starter' } // 처음부터 가지고 있음
  | { type: 'recipe'; cost: ResourceBundle }; // 공방에서 이 재료로 만든다

// 그림 파일이 없을 때 코드로 그리는 모양 (src/features/room/placeholders/)
export type PlaceholderShape =
  | 'bed' | 'rug' | 'lamp' | 'shelf' | 'desk' | 'pot' | 'chest' | 'stool' | 'basket' | 'lantern' | 'box'
  | 'crystal' | 'mushroomBed' | 'cushion' | 'bench' | 'sunflowerPot' | 'honeyLamp' | 'beanbag' | 'lilyRug' | 'shellLamp'
  | 'frame' | 'garland' | 'starFrame' | 'mirror' | 'gemGarland' | 'kiteGarland'; // 벽 장식

// 그림 파일이 없을 때 대신 쓰는 임시 그래픽 정보
export interface PlaceholderStyle {
  shape: PlaceholderShape; // 방에 그릴 모양
  color: string; // 목록 썸네일 배경색 (#RRGGBB)
  emoji: string; // 목록 썸네일 그림 문자
  height: number; // 대략적인 높이 (선택 화살표 위치에 쓴다, 방 좌표 단위)
}

// 가구 한 종류의 정의 (Asset Registry 의 한 줄)
export interface FurnitureDef {
  id: string;
  nameKey: TranslationKey; // 이름 번역 키
  descriptionKey: TranslationKey; // 설명 번역 키
  assetPath: string; // public/assets/ 아래 그림 경로
  category: FurnitureCategory;
  width: number; // 그림 너비 (방 좌표 단위)
  height: number; // 그림 높이 (방 좌표 단위)
  gridWidth: number; // 바닥에서 차지하는 칸 수 (가로, 오른쪽 위 방향). 벽 장식은 벽에서 차지하는 칸 수
  gridHeight: number; // 바닥에서 차지하는 칸 수 (세로, 왼쪽 아래 방향)
  unlockCondition: UnlockCondition;
  placeholder: PlaceholderStyle;
  wallBand?: WallBand; // 벽 장식만: 거는 높이
}

// ===== 벽 장식 =====
export type WallSide = 'left' | 'right';
export type WallBand = 'middle' | 'high'; // 가운데 높이(액자) / 위쪽(가랜드)

// 벽에 건 장식 하나: 어느 벽의 몇 번째 칸부터
export interface WallItem {
  uid: string;
  furnitureId: string;
  wall: WallSide;
  slot: number;
}

// 방에 놓인 가구 한 개
export interface PlacedFurniture {
  uid: string; // 같은 가구를 여러 개 놓아도 구분하는 고유 번호
  furnitureId: string;
  gx: number; // 바닥 칸 위치 (가로)
  gy: number; // 바닥 칸 위치 (세로)
  rotation: 0 | 1; // 0 = 기본 방향, 1 = 좌우로 돌린 방향
  tint?: 1 | 2; // 고른 색 (없으면 원래 색)
}

// 방 전체 상태
export interface RoomLayout {
  placed: PlacedFurniture[];
  wallItems: WallItem[]; // 벽에 건 장식
  wallpaperId: string | null; // 붙인 벽지 (없으면 기본 벽)
}
