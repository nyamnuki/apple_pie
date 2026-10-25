import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { createInitialGameState, gameReducer, type GameAction, type GameState } from './gameState';

// 플레이어 상태를 앱 전체에 나눠 준다. 지금은 메모리에만 있고, 저장은 Phase 5 에서 붙인다.
interface GameValue {
  game: GameState;
  dispatch: (action: GameAction) => void;
}

const GameContext = createContext<GameValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [game, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);
  const value = useMemo(() => ({ game, dispatch }), [game]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame 은 GameProvider 안에서만 쓸 수 있어요');
  return ctx;
}
