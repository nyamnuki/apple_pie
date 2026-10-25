import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { PlacedFurniture, RoomLayout, WallItem, WallSide } from '../../types/furniture';

// ===== 방 상태 (어떤 가구가 어디에 놓였는지) =====
// 처음 값은 저장본에서 불러온다 (main.tsx). 저장은 SaveManager 가 맡는다.

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

type Action =
  | { type: 'place'; item: PlacedFurniture }
  | { type: 'move'; uid: string; gx: number; gy: number }
  | { type: 'rotate'; uid: string }
  | { type: 'remove'; uid: string } // 바닥 가구·벽 장식 모두
  | { type: 'placeWall'; item: WallItem }
  | { type: 'moveWall'; uid: string; wall: WallSide; slot: number }
  | { type: 'setWallpaper'; wallpaperId: string | null }
  | { type: 'reset' }; // 처음 방 모습으로

function roomReducer(state: RoomLayout, action: Action): RoomLayout {
  switch (action.type) {
    case 'place':
      return { ...state, placed: [...state.placed, action.item] };
    case 'move':
      return { ...state, placed: state.placed.map((p) => (p.uid === action.uid ? { ...p, gx: action.gx, gy: action.gy } : p)) };
    case 'rotate':
      return { ...state, placed: state.placed.map((p) => (p.uid === action.uid ? { ...p, rotation: p.rotation === 0 ? 1 : 0 } : p)) };
    case 'remove':
      return { ...state, placed: state.placed.filter((p) => p.uid !== action.uid), wallItems: state.wallItems.filter((w) => w.uid !== action.uid) };
    case 'placeWall':
      return { ...state, wallItems: [...state.wallItems, action.item] };
    case 'moveWall':
      return { ...state, wallItems: state.wallItems.map((w) => (w.uid === action.uid ? { ...w, wall: action.wall, slot: action.slot } : w)) };
    case 'setWallpaper':
      return { ...state, wallpaperId: action.wallpaperId };
    case 'reset':
      return DEFAULT_LAYOUT;
  }
}

interface RoomValue {
  layout: RoomLayout;
  dispatch: (action: Action) => void;
}

const RoomContext = createContext<RoomValue | null>(null);

export function RoomProvider({ initial, children }: { initial: RoomLayout; children: ReactNode }) {
  const [layout, dispatch] = useReducer(roomReducer, initial);
  const value = useMemo(() => ({ layout, dispatch }), [layout]);
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoom(): RoomValue {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error('useRoom 은 RoomProvider 안에서만 쓸 수 있어요');
  return ctx;
}

// 새로 놓는 가구의 고유 번호 만들기
let counter = 0;
export const newUid = (furnitureId: string) => `${furnitureId}-${Date.now().toString(36)}-${(counter++).toString(36)}`;
