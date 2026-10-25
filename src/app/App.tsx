import { useState } from 'react';
import type { Screen } from './screens';
import TitleScreen from './screens/TitleScreen';
import RoomScreen from '../features/room/RoomScreen';
import DecorateScreen from '../features/room/decorate/DecorateScreen';
import SettingsScreen from '../features/settings/SettingsScreen';
import MathMenuScreen from '../features/math/MathMenuScreen';
import LessonScreen from '../features/math/LessonScreen';
import WorkshopScreen from '../features/workshop/WorkshopScreen';
import InventoryScreen from '../features/inventory/InventoryScreen';
import ParentGate from '../features/settings/ParentGate';
import ParentScreen from '../features/settings/ParentScreen';
import type { LessonId } from '../types/math';
import type { LoadStatus } from '../services/storage/gameSave';

// 화면 전환. 설정에서 '뒤로'를 누르면 설정을 열기 전 화면으로 돌아간다.
export default function App({ loadStatus }: { loadStatus: LoadStatus }) {
  const [screen, setScreen] = useState<Screen>('title');
  // 저장 안내는 한 번 닫으면 이번 실행 동안 다시 보이지 않는다
  const [notice, setNotice] = useState<LoadStatus | null>(loadStatus);
  const [settingsFrom, setSettingsFrom] = useState<Screen>('title');
  const [lessonId, setLessonId] = useState<LessonId>('counting1');

  const openSettings = (from: Screen) => {
    setSettingsFrom(from);
    setScreen('settings');
  };

  switch (screen) {
    case 'title':
      return <TitleScreen onStart={() => setScreen('room')} onSettings={() => openSettings('title')} notice={notice} onCloseNotice={() => setNotice(null)} />;
    case 'room':
      return (
        <RoomScreen
          onPlay={() => setScreen('math')}
          onDecorate={() => setScreen('decorate')}
          onWorkshop={() => setScreen('workshop')}
          onInventory={() => setScreen('inventory')}
          onSettings={() => openSettings('room')}
          onBack={() => setScreen('title')}
        />
      );
    case 'decorate':
      return <DecorateScreen onBack={() => setScreen('room')} />;
    case 'settings':
      return <SettingsScreen onBack={() => setScreen(settingsFrom)} onParent={() => setScreen('parentGate')} canSave={loadStatus !== 'unavailable'} />;
    case 'parentGate':
      return <ParentGate onPass={() => setScreen('parent')} onBack={() => setScreen('settings')} />;
    case 'parent':
      return <ParentScreen onBack={() => setScreen('settings')} />;
    case 'math':
      return (
        <MathMenuScreen
          onPick={(id) => {
            setLessonId(id);
            setScreen('lesson');
          }}
          onBack={() => setScreen('room')}
        />
      );
    case 'lesson':
      return <LessonScreen key={lessonId} lessonId={lessonId} onExit={() => setScreen('math')} onWorkshop={() => setScreen('workshop')} />;
    case 'workshop':
      return <WorkshopScreen onBack={() => setScreen('room')} onDecorate={() => setScreen('decorate')} />;
    case 'inventory':
      return <InventoryScreen onBack={() => setScreen('room')} onWorkshop={() => setScreen('workshop')} onDecorate={() => setScreen('decorate')} />;
  }
}
