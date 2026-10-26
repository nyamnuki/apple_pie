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
import StickerBookScreen from '../features/stickers/StickerBookScreen';
import BreakReminder from '../features/breaks/BreakReminder';
import DailyScreen from '../features/daily/DailyScreen';
import ParentGate from '../features/settings/ParentGate';
import ParentScreen from '../features/settings/ParentScreen';
import RegionMapScreen from '../features/map/RegionMapScreen';
import { getLesson } from '../data/math/lessons';
import type { RegionId } from '../types/resources';
import MusicManager from '../services/audio/MusicManager';
import type { TrackId } from '../services/audio/music';
import type { LessonId } from '../types/math';
import type { LoadStatus } from '../services/storage/gameSave';

// 화면 전환. 설정에서 '뒤로'를 누르면 설정을 열기 전 화면으로 돌아간다.
export default function App({ loadStatus }: { loadStatus: LoadStatus }) {
  const [screen, setScreen] = useState<Screen>('title');
  // 저장 안내는 한 번 닫으면 이번 실행 동안 다시 보이지 않는다
  const [notice, setNotice] = useState<LoadStatus | null>(loadStatus);
  const [settingsFrom, setSettingsFrom] = useState<Screen>('title');
  const [lessonId, setLessonId] = useState<LessonId>('counting1');
  const [regionId, setRegionId] = useState<RegionId>('acornVillage');

  const openSettings = (from: Screen) => {
    setSettingsFrom(from);
    setScreen('settings');
  };

  // 배경 음악: 달빛 숲(놀이 고르기·놀이)은 밤의 곡, 수정 동굴은 동굴 곡, 나머지는 낮의 곡
  const here: RegionId | null = screen === 'math' ? regionId : screen === 'lesson' ? getLesson(lessonId).region : null;
  const track: TrackId = here === 'moonlightForest' ? 'night' : here === 'crystalCave' ? 'cave' : 'day';

  return (
    <>
      <MusicManager track={track} />
      {renderScreen()}
      <BreakReminder />
    </>
  );

  // 지금 화면 그리기
  function renderScreen() {
    switch (screen) {
      case 'title':
        return <TitleScreen onStart={() => setScreen('room')} onSettings={() => openSettings('title')} notice={notice} onCloseNotice={() => setNotice(null)} />;
      case 'room':
        return (
          <RoomScreen
            onPlay={() => setScreen('map')}
            onDecorate={() => setScreen('decorate')}
            onWorkshop={() => setScreen('workshop')}
            onInventory={() => setScreen('inventory')}
            onStickers={() => setScreen('stickers')}
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
      case 'map':
        return (
          <RegionMapScreen
            onDaily={() => setScreen('daily')}
            onPick={(id) => {
              setRegionId(id);
              setScreen('math');
            }}
            onBack={() => setScreen('room')}
          />
        );
      case 'math':
        return (
          <MathMenuScreen
            regionId={regionId}
            onPick={(id) => {
              setLessonId(id);
              setScreen('lesson');
            }}
            onBack={() => setScreen('map')}
          />
        );
      case 'lesson':
        return (
          <LessonScreen
            key={lessonId}
            lessonId={lessonId}
            onExit={() => {
              setRegionId(getLesson(lessonId).region);
              setScreen('math');
            }}
            onWorkshop={() => setScreen('workshop')}
          />
        );
      case 'workshop':
        return <WorkshopScreen onBack={() => setScreen('room')} onDecorate={() => setScreen('decorate')} />;
      case 'daily':
        return <DailyScreen onBack={() => setScreen('map')} />;
      case 'stickers':
        return <StickerBookScreen onBack={() => setScreen('room')} />;
      case 'inventory':
        return <InventoryScreen onBack={() => setScreen('room')} onWorkshop={() => setScreen('workshop')} onDecorate={() => setScreen('decorate')} />;
    }
  }
}
