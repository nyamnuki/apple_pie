import { canPlace, canPlaceWall, isWallItem } from './placement';
import { getFurniture } from '../../data/furniture/furniture';
import type { PlacedFurniture, RoomLayout, WallItem, WallSide } from '../../types/furniture';

// ===== 방 상태 규칙 (화면과 상관없는 순수 함수) =====
// 방을 바꾸는 모든 요청은 여기를 거친다. 규칙에 맞지 않는 요청(방 밖, 겹침, 창문 자리,
// 가진 개수 초과, 없는 가구, 같은 번호 중복 등)은 무시하고 기존 상태를 그대로 돌려준다.
// (화면에서도 미리 막지만, 아이가 빠르게 두 번 누르는 경우 등을 위해 여기서 한 번 더 검사한다)

// 처음 방 모습
export const DEFAULT_LAYOUT: RoomLayout = {
  placed: [
    { uid: 'leafBed-1', furnitureId: 'leafBed', gx: 0, gy: 0, rotation: 0 },
    { uid: 'mushroomLamp-1', furnitureId: 'mushroomLamp', gx: 2, gy: 0, rotation: 0 },
    { uid: 'petalRug-1', furnitureId: 'petalRug', gx: 2, gy: 2, rotation: 0 },
    { uid: 'flowerPot-1', furnitureId: 'flowerPot', gx: 5, gy: 0, rotation: 0 },
  ],
  wallItems: [],
  wallpaperId: null,
};

export type RoomAction =
  | { type: 'load'; layout: RoomLayout } // 백업 파일에서 되살리기 (검사를 마친 배치)
  | { type: 'place'; item: PlacedFurniture }
  | { type: 'move'; uid: string; gx: number; gy: number }
  | { type: 'rotate'; uid: string }
  | { type: 'remove'; uid: string } // 바닥 가구·벽 장식 모두
  | { type: 'placeWall'; item: WallItem }
  | { type: 'moveWall'; uid: string; wall: WallSide; slot: number }
  | { type: 'setWallpaper'; wallpaperId: string | null }
  | { type: 'reset' }; // 처음 방 모습으로

// 가진 가구 개수 (플레이어 상태에서 받아 온다)
export type OwnedCounts = Record<string, number>;

const uidTaken = (state: RoomLayout, uid: string) => state.placed.some((p) => p.uid === uid) || state.wallItems.some((w) => w.uid === uid);
const countOf = (list: { furnitureId: string }[], furnitureId: string) => list.filter((p) => p.furnitureId === furnitureId).length;

export function applyRoomAction(state: RoomLayout, action: RoomAction, owned: OwnedCounts): RoomLayout {
  switch (action.type) {
    case 'place': {
      const { item } = action;
      const def = getFurniture(item.furnitureId);
      if (!def || isWallItem(def) || def.category === 'wallpaper') return state;
      if (uidTaken(state, item.uid)) return state;
      if (countOf(state.placed, item.furnitureId) >= (owned[item.furnitureId] ?? 0)) return state; // 가진 것보다 많이 놓을 수 없다
      if (!canPlace(state.placed, item.furnitureId, item.rotation, item.gx, item.gy)) return state; // 방 밖·겹침
      return { ...state, placed: [...state.placed, item] };
    }
    case 'move': {
      const item = state.placed.find((p) => p.uid === action.uid);
      if (!item || (item.gx === action.gx && item.gy === action.gy)) return state;
      if (!canPlace(state.placed, item.furnitureId, item.rotation, action.gx, action.gy, item.uid)) return state;
      return { ...state, placed: state.placed.map((p) => (p.uid === action.uid ? { ...p, gx: action.gx, gy: action.gy } : p)) };
    }
    case 'rotate': {
      const item = state.placed.find((p) => p.uid === action.uid);
      if (!item) return state;
      const rotation = item.rotation === 0 ? 1 : 0;
      if (!canPlace(state.placed, item.furnitureId, rotation, item.gx, item.gy, item.uid)) return state; // 돌리면 방 밖·겹침
      return { ...state, placed: state.placed.map((p) => (p.uid === action.uid ? { ...p, rotation } : p)) };
    }
    case 'remove': {
      if (!uidTaken(state, action.uid)) return state;
      return { ...state, placed: state.placed.filter((p) => p.uid !== action.uid), wallItems: state.wallItems.filter((w) => w.uid !== action.uid) };
    }
    case 'placeWall': {
      const { item } = action;
      if (!isWallItem(getFurniture(item.furnitureId))) return state;
      if (uidTaken(state, item.uid)) return state;
      if (countOf(state.wallItems, item.furnitureId) >= (owned[item.furnitureId] ?? 0)) return state;
      if (!canPlaceWall(state.wallItems, item.furnitureId, item.wall, item.slot)) return state; // 벽 밖·창문·겹침
      return { ...state, wallItems: [...state.wallItems, item] };
    }
    case 'moveWall': {
      const item = state.wallItems.find((w) => w.uid === action.uid);
      if (!item || (item.wall === action.wall && item.slot === action.slot)) return state;
      if (!canPlaceWall(state.wallItems, item.furnitureId, action.wall, action.slot, item.uid)) return state;
      return { ...state, wallItems: state.wallItems.map((w) => (w.uid === action.uid ? { ...w, wall: action.wall, slot: action.slot } : w)) };
    }
    case 'setWallpaper': {
      const id = action.wallpaperId;
      if (id === state.wallpaperId) return state;
      // 벽지를 떼는 것은 언제나 가능, 붙이는 것은 가진 벽지만
      if (id !== null && (getFurniture(id)?.category !== 'wallpaper' || (owned[id] ?? 0) < 1)) return state;
      return { ...state, wallpaperId: id };
    }
    case 'reset':
      return DEFAULT_LAYOUT;
    case 'load':
      return action.layout;
  }
}
