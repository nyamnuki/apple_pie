import { useState } from 'react';
import { SCREENS } from './screens/screens.js';
import SplashScreen from './screens/SplashScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import PlaceholderScreen from './screens/PlaceholderScreen.jsx';

// 최상위 화면 전환기. screen 상태 하나로 어떤 화면을 보여줄지 정한다.
export default function App() {
  const [screen, setScreen] = useState(SCREENS.SPLASH);
  const goHome = () => setScreen(SCREENS.HOME);

  switch (screen) {
    case SCREENS.SPLASH:
      return <SplashScreen onStart={goHome} />;
    case SCREENS.HOME:
      return <HomeScreen go={setScreen} />;
    case SCREENS.MAP:
      return <PlaceholderScreen title="모험 지도" emoji="🗺️" note="3단계에서 지역 선택 화면이 들어와요" onBack={goHome} />;
    case SCREENS.FORGE:
      return <PlaceholderScreen title="보물 제련소" emoji="⚒️" note="8단계에서 제련 기능이 들어와요" onBack={goHome} />;
    case SCREENS.PARENT:
      return <PlaceholderScreen title="부모 설정" emoji="🔒" note="7단계에서 부모 게이트가 들어와요" onBack={goHome} />;
    default:
      return <HomeScreen go={setScreen} />;
  }
}
