import type { TranslationKey } from '../i18n';

// 가구 종류. 'rug' 는 바닥에 깔리므로 다른 가구가 위에 올라설 수 있다.
export type FurnitureCategory = 'bed' | 'rug' | 'light' | 'storage' | 'table' | 'plant' | 'wallpaper';

// 잠금 해제 조건 (Phase 4 보상 시스템에서 실제로 적용한다)
export type UnlockCondition =
  | { type: 'starter' } // 처음부터 가지고 있음
  | { type: 'stars'; count: number }; // 별을 이만큼 모으면

// 그림 파일이 없을 때 대신 그리는 임시 그래픽 정보
export interface PlaceholderStyle {
  color: string; // 상자 색 (#RRGGBB)
  emoji: string; // 상자 위에 올릴 그림 문자
  height: number; // 상자 높이 (방 좌표 단위)
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
  gridWidth: number; // 바닥에서 차지하는 칸 수 (가로, 오른쪽 위 방향)
  gridHeight: number; // 바닥에서 차지하는 칸 수 (세로, 왼쪽 아래 방향)
  unlockCondition: UnlockCondition;
  placeholder: PlaceholderStyle;
}

// 방에 놓인 가구 한 개
export interface PlacedFurniture {
  uid: string; // 같은 가구를 여러 개 놓아도 구분하는 고유 번호
  furnitureId: string;
  gx: number; // 바닥 칸 위치 (가로)
  gy: number; // 바닥 칸 위치 (세로)
  rotation: 0 | 1; // 0 = 기본 방향, 1 = 좌우로 돌린 방향
}

// 방 전체 상태
export interface RoomLayout {
  placed: PlacedFurniture[];
  wallpaperId: string | null; // 붙인 벽지 (없으면 기본 벽)
}
