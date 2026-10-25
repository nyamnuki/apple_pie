import { useEffect, useRef } from 'react';
import { useGame } from './GameProvider';
import { useRoom } from '../features/room/RoomProvider';
import { saveGame } from '../services/storage/gameSave';

const SAVE_DELAY = 300; // 바뀐 뒤 잠깐 기다렸다 한 번에 저장 (ms)

// 화면에는 보이지 않는 저장 담당.
// 플레이어 상태나 방 배치가 바뀌면 저장하고, 창을 닫거나 다른 앱으로 넘어갈 때는 바로 저장한다.
export default function SaveManager() {
  const { game } = useGame();
  const { layout } = useRoom();

  const latest = useRef({ game, layout });
  latest.current = { game, layout };

  useEffect(() => {
    const timer = setTimeout(() => saveGame(game, layout), SAVE_DELAY);
    return () => clearTimeout(timer);
  }, [game, layout]);

  useEffect(() => {
    const flush = () => saveGame(latest.current.game, latest.current.layout);
    const onHidden = () => document.visibilityState === 'hidden' && flush();
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onHidden);
    };
  }, []);

  return null;
}
