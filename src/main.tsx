import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { I18nProvider } from './i18n';
import { RoomProvider } from './features/room/RoomProvider';
import { GameProvider } from './app/GameProvider';
import SaveManager from './app/SaveManager';
import ErrorBoundary from './app/ErrorBoundary';
import { SoundProvider } from './services/audio/SoundProvider';
import { loadGame } from './services/storage/gameSave';
import './styles/index.css';
import WatercolorDefs from './components/art/WatercolorDefs';
import ArtGallery from './features/dev/ArtGallery';

// 배포된 앱만: 인터넷 없이도 열리도록 서비스 워커를 등록한다 (개발 중에는 하지 않는다)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // 등록이 안 돼도(사생활 보호 모드 등) 앱은 그대로 쓸 수 있다
    });
  });
}

// 시작할 때 저장본을 한 번 불러온다 (없거나 망가졌으면 처음 상태)
const save = loadGame();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 모든 그림이 같이 쓰는 수채화 효과 */}
    <WatercolorDefs />
    <I18nProvider>
      <SoundProvider>
        <ErrorBoundary>
          <GameProvider initial={save.game}>
            <RoomProvider initial={save.room}>
              <SaveManager />
              {location.hash === '#gallery' ? <ArtGallery /> : <App loadStatus={save.status} />}
            </RoomProvider>
          </GameProvider>
        </ErrorBoundary>
      </SoundProvider>
    </I18nProvider>
  </React.StrictMode>,
);
