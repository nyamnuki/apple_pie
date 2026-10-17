import { Map, Hammer, Settings } from 'lucide-react';
import AppShell from '../components/layout/AppShell.jsx';
import BigButton from '../components/common/BigButton.jsx';
import GameImage from '../components/common/GameImage.jsx';
import { IMAGES } from '../assets/images.js';
import { SCREENS } from './screens.js';

// 2. 메인 마을 화면 — 1단계에서는 3구역 레이아웃 뼈대만 잡는다.
// (상단 자원 바 / 가운데 마을 전경 / 하단 메뉴) 내용은 2단계에서 채운다.
export default function HomeScreen({ go }) {
  return (
    <AppShell background="bg-gradient-to-b from-sky-100 to-mint-100">
      {/* 상단: 자원 바 자리 */}
      <section className="flex min-h-[64px] items-center justify-center rounded-3xl bg-white/80 px-4 shadow-card">
        <span className="font-display text-lg text-cocoa-400">자원 바 (2단계)</span>
      </section>

      {/* 가운데: 마을 전경 자리 */}
      <section className="my-3 flex flex-1 items-center justify-center rounded-[2rem] border-4 border-dashed border-mint-400/60 bg-mint-200/40">
        <div className="text-center">
          <GameImage asset={IMAGES.ui.townBackground} alt="마을" emojiClassName="text-8xl" />
          <p className="mt-2 font-display text-xl text-mint-600">마을 전경 (2단계)</p>
        </div>
      </section>

      {/* 하단: 메뉴 */}
      <nav className="grid grid-cols-3 gap-3">
        <BigButton variant="mint" onClick={() => go(SCREENS.MAP)}>
          <Map size={28} /> 모험
        </BigButton>
        <BigButton variant="lilac" onClick={() => go(SCREENS.FORGE)}>
          <Hammer size={28} /> 제련소
        </BigButton>
        <BigButton variant="soft" onClick={() => go(SCREENS.PARENT)} aria-label="부모 설정">
          <Settings size={28} /> 설정
        </BigButton>
      </nav>
    </AppShell>
  );
}
