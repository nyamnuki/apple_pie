import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { gameReducer, type GameAction, type GameState } from './gameState';

// 플레이어 상태를 앱 전체에 나눠 준다. 처음 값은 저장본에서 불러온다 (main.tsx).
interface GameValue {
  game: GameState;
  dispatch: (action: GameAction) => void;
}

const GameContext = createContext<GameValue | null>(null);

export function GameProvider({ initial, children }: { initial: GameState; children: ReactNode }) {
  const [game, dispatch] = useReducer(gameReducer, initial);
  const value = useMemo(() => ({ game, dispatch }), [game]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame 은 GameProvider 안에서만 쓸 수 있어요');
  return ctx;
}
