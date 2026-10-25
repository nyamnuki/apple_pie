import { useState } from 'react';
import type { Screen } from './screens';
import TitleScreen from './screens/TitleScreen';
import ComingSoonScreen from './screens/ComingSoonScreen';
import RoomScreen from '../features/room/RoomScreen';
import SettingsScreen from '../features/settings/SettingsScreen';

// 화면 전환. 설정에서 '뒤로'를 누르면 설정을 열기 전 화면으로 돌아간다.
export default function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [settingsFrom, setSettingsFrom] = useState<Screen>('title');

  const openSettings = (from: Screen) => {
    setSettingsFrom(from);
    setScreen('settings');
  };

  switch (screen) {
    case 'title':
      return <TitleScreen onStart={() => setScreen('room')} onSettings={() => openSettings('title')} />;
    case 'room':
      return (
        <RoomScreen
          onPlay={() => setScreen('comingSoon')}
          onDecorate={() => setScreen('comingSoon')}
          onSettings={() => openSettings('room')}
          onBack={() => setScreen('title')}
        />
      );
    case 'settings':
      return <SettingsScreen onBack={() => setScreen(settingsFrom)} />;
    case 'comingSoon':
      return <ComingSoonScreen onBack={() => setScreen('room')} />;
  }
}
