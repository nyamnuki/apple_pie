import { createContext, useCallback, useContext, useMemo, useReducer, useRef, type ReactNode } from 'react';
import { applyRoomAction, type OwnedCounts, type RoomAction } from './roomState';
import { useGame } from '../../app/GameProvider';
import type { RoomLayout } from '../../types/furniture';

// ===== 방 상태 (어떤 가구가 어디에 놓였는지) =====
// 처음 값은 저장본에서 불러온다 (main.tsx). 저장은 SaveManager 가 맡는다.
// 바꾸는 규칙은 roomState.ts 한곳에 있다 (잘못된 요청은 무시된다).
export { DEFAULT_LAYOUT } from './roomState';

// reducer 는 '요청 + 그 순간 가진 가구 개수'를 받는다
function roomReducer(state: RoomLayout, { action, owned }: { action: RoomAction; owned: OwnedCounts }): RoomLayout {
  return applyRoomAction(state, action, owned);
}

interface RoomValue {
  layout: RoomLayout;
  dispatch: (action: RoomAction) => void;
}

const RoomContext = createContext<RoomValue | null>(null);

export function RoomProvider({ initial, children }: { initial: RoomLayout; children: ReactNode }) {
  const [layout, rawDispatch] = useReducer(roomReducer, initial);
  // 가진 가구 개수는 플레이어 상태에서 읽어 요청마다 함께 넘긴다 (가진 것보다 많이 놓지 못하게)
  const { game } = useGame();
  const ownedRef = useRef(game.furniture);
  ownedRef.current = game.furniture;
  const dispatch = useCallback((action: RoomAction) => rawDispatch({ action, owned: ownedRef.current }), []);
  const value = useMemo(() => ({ layout, dispatch }), [layout, dispatch]);
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
