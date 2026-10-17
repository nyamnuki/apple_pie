import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { gameReducer } from './gameReducer.js';
import { hydrate } from './initialState.js';
import { loadSave, writeSave } from './storage.js';
import { setSoundEnabled } from '../utils/sound.js';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  // 처음 한 번만 저장본을 읽어 상태를 만든다
  const [state, dispatch] = useReducer(gameReducer, undefined, () => hydrate(loadSave()));

  // 상태가 바뀌면 잠깐 모았다가 저장 (1초마다 오는 사용 시간 갱신으로 과하게 쓰지 않게)
  const timer = useRef(null);
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => writeSave(state), 300);
    return () => clearTimeout(timer.current);
  }, [state]);

  // 창을 닫거나 백그라운드로 갈 때는 즉시 저장
  const latest = useRef(state);
  latest.current = state;
  useEffect(() => {
    const flush = () => writeSave(latest.current);
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', flush);
    };
  }, []);

  // 효과음 켜기/끄기 설정을 사운드 모듈에 반영
  useEffect(() => setSoundEnabled(state.settings.sound), [state.settings.sound]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame 은 GameProvider 안에서만 쓸 수 있어요');
  return ctx;
}
