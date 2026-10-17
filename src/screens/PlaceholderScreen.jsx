import AppShell from '../components/layout/AppShell.jsx';
import ScreenHeader from '../components/layout/ScreenHeader.jsx';

// 아직 만들지 않은 화면 자리 (단계별로 실제 화면으로 바꿔 간다)
export default function PlaceholderScreen({ title, emoji = '🚧', note, onBack }) {
  return (
    <AppShell>
      <ScreenHeader title={title} onBack={onBack} />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-[2rem] bg-white/70 p-6 text-center shadow-card">
        <span className="text-7xl">{emoji}</span>
        <p className="font-display text-2xl text-cocoa-700">곧 만들어질 거예요!</p>
        {note && <p className="text-cocoa-400">{note}</p>}
      </div>
    </AppShell>
  );
}
