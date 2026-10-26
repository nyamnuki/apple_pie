import { Puzzle, Sofa, Settings, Hammer, Backpack, BookHeart } from 'lucide-react';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import ScreenHeader from '../../components/ScreenHeader';
import RoomView from './RoomView';
import { useRoom } from './RoomProvider';
import { useI18n } from '../../i18n';

interface Props {
  onPlay: () => void;
  onDecorate: () => void;
  onWorkshop: () => void;
  onInventory: () => void;
  onStickers: () => void;
  onSettings: () => void;
  onBack: () => void;
}

// 내 방(홈) 화면: 지금 꾸며진 방을 보여주고, 놀이하기·방 꾸미기로 갈 수 있다.
export default function RoomScreen({ onPlay, onDecorate, onWorkshop, onInventory, onStickers, onSettings, onBack }: Props) {
  const { t } = useI18n();
  const { layout } = useRoom();
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

      <div className="flex min-h-0 flex-1 flex-col gap-4 [@media(max-height:500px)]:flex-row">
        <section className="min-h-[240px] flex-1 [@media(max-height:500px)]:min-h-0">
          <RoomView layout={layout} />
        </section>

        {/* 아래 메뉴: 수학 놀이(초록)와 꾸미기·만들기(나무색)를 색과 아이콘으로 구분.
            아이콘을 글자 위에 두어 좁은 폰에서도 글자가 한 줄에 들어가게 한다 */}
        <nav className="grid grid-cols-2 gap-3 [@media(max-height:500px)]:w-64 [@media(max-height:500px)]:content-center">
          <BigButton size="lg" variant="sage" className="col-span-2 flex-col !gap-1 !px-3" onClick={onPlay}>
            <Puzzle size={30} aria-hidden />
            {t('menu.play')}
          </BigButton>
          <BigButton variant="primary" className="flex-col !gap-1 !px-2" onClick={onDecorate}>
            <Sofa size={26} aria-hidden />
            {t('menu.decorate')}
          </BigButton>
          <BigButton variant="primary" className="flex-col !gap-1 !px-2" onClick={onWorkshop}>
            <Hammer size={26} aria-hidden />
            {t('menu.workshop')}
          </BigButton>
          <BigButton variant="soft" className="!min-h-[52px] !px-2" onClick={onInventory}>
            <Backpack size={24} aria-hidden />
            {t('menu.inventory')}
          </BigButton>
          <BigButton variant="soft" className="!min-h-[52px] !px-2" onClick={onStickers}>
            <BookHeart size={24} aria-hidden />
            {t('menu.stickers')}
          </BigButton>
        </nav>
      </div>
    </AppShell>
  );
}
