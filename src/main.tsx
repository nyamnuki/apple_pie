import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { I18nProvider } from './i18n';
import { RoomProvider } from './features/room/RoomProvider';
import { GameProvider } from './app/GameProvider';
import SaveManager from './app/SaveManager';
import { loadGame } from './services/storage/gameSave';
import './styles/index.css';

// 시작할 때 저장본을 한 번 불러온다 (없거나 망가졌으면 처음 상태)
const save = loadGame();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <GameProvider initial={save.game}>
        <RoomProvider initial={save.room}>
          <SaveManager />
          <App loadStatus={save.status} />
        </RoomProvider>
      </GameProvider>
    </I18nProvider>
  </React.StrictMode>,
);
