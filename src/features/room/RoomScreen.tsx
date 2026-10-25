import { Puzzle, Sofa, Settings } from 'lucide-react';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import ScreenHeader from '../../components/ScreenHeader';
import { useI18n } from '../../i18n';

interface Props {
  onPlay: () => void;
  onDecorate: () => void;
  onSettings: () => void;
  onBack: () => void;
}

// 내 방(홈) 화면. 지금은 방 자리와 메뉴만 있고, 아이소메트릭 방은 Phase 2 에서 만든다.
export default function RoomScreen({ onPlay, onDecorate, onSettings, onBack }: Props) {
  const { t } = useI18n();
  return (
    <AppShell background="bg-gradient-to-b from-cream to-moss">
      <ScreenHeader
        title={t('room.title')}
        onBack={onBack}
        right={
          <BigButton variant="soft" size="icon" onClick={onSettings} aria-label={t('a11y.openSettings')}>
            <Settings size={28} aria-hidden />
          </BigButton>
        }
      />

      {/* 방이 들어갈 자리 */}
      <section className="flex flex-1 items-center justify-center rounded-[2rem] border-4 border-dashed border-oak/30 bg-apricot/30 p-6 text-center">
        <p className="text-xl">{t('room.placeholder')}</p>
      </section>

      {/* 아래 메뉴: 수학 놀이와 꾸미기를 색과 아이콘으로 구분.
          아이콘을 글자 위에 두어 좁은 폰에서도 글자가 한 줄에 들어가게 한다 */}
      <nav className="mt-4 grid grid-cols-2 gap-3">
        <BigButton size="lg" variant="sage" className="flex-col !gap-1 !px-3" onClick={onPlay}>
          <Puzzle size={30} aria-hidden />
          {t('menu.play')}
        </BigButton>
        <BigButton size="lg" variant="primary" className="flex-col !gap-1 !px-3" onClick={onDecorate}>
          <Sofa size={30} aria-hidden />
          {t('menu.decorate')}
        </BigButton>
      </nav>
    </AppShell>
  );
}
