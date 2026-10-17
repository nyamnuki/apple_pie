import { Play } from 'lucide-react';
import AppShell from '../components/layout/AppShell.jsx';
import BigButton from '../components/common/BigButton.jsx';
import GameImage from '../components/common/GameImage.jsx';
import { IMAGES } from '../assets/images.js';

// 1. 스플래시 / 타이틀 화면
export default function SplashScreen({ onStart }) {
  return (
    <AppShell background="bg-gradient-to-b from-sky-200 via-cream to-mint-100">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center landscape:gap-3">
        {/* 마스코트와 성 */}
        <div className="flex items-end gap-2 animate-float">
          <GameImage asset={IMAGES.characters.mascot} alt="다람쥐 친구" emojiClassName="text-7xl landscape:text-6xl" />
          <GameImage asset={IMAGES.ui.logo} alt="판타지 성" emojiClassName="text-8xl landscape:text-7xl" />
        </div>

        <div className="animate-pop">
          <p className="font-display text-xl text-peach-600">Math Town</p>
          <h1 className="font-display text-5xl leading-tight text-cocoa-700 sm:text-6xl">셈셈마을</h1>
          <p className="mt-1 font-display text-2xl text-lilac-600">판타지 월드</p>
        </div>

        <BigButton size="lg" onClick={onStart} className="mt-2 w-64 animate-pop" aria-label="시작하기">
          <Play size={32} fill="currentColor" />
          시작!
        </BigButton>
      </div>

      {/* 아이 친화 약속: 광고·결제·개인정보 수집 없음 */}
      <p className="pb-1 text-center text-sm text-cocoa-400">광고 없음 · 결제 없음 · 개인정보 수집 없음</p>
    </AppShell>
  );
}
