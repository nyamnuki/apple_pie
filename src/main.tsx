import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { I18nProvider } from './i18n';
import { RoomProvider } from './features/room/RoomProvider';
import { GameProvider } from './app/GameProvider';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <GameProvider>
        <RoomProvider>
          <App />
        </RoomProvider>
      </GameProvider>
    </I18nProvider>
  </React.StrictMode>,
);
