import { Puzzle, Sofa, Settings, Hammer, Backpack, BookHeart, Check, Question, Camera } from '../../components/icons';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import ScreenHeader from '../../components/ScreenHeader';
import RoomView from './RoomView';
import { useRoom } from './RoomProvider';
import GuideBubble from '../../components/GuideBubble';
import { useGame } from '../../app/GameProvider';
import { roomTip } from './roomTip';
import { roomQuiz, type RoomQuiz } from './roomQuiz';
import { saveRoomPhoto } from '../photo/roomPhoto';
import ChoiceButtons from '../math/components/ChoiceButtons';
import { useRef, useState } from 'react';
import { useSound } from '../../services/audio/SoundProvider';
import { petsFor } from '../pets/pets';
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
  const { t, tKey, locale, formatNumber } = useI18n();
  const { layout } = useRoom();
  const { game } = useGame();
  const tip = roomTip(game, layout);
  const { play } = useSound();
  // 루루의 질문 (방 속 수학). asked: 몇 번째 질문인지 (열 때마다 다음 종류)
  const [asked, setAsked] = useState(0);
  const [quiz, setQuiz] = useState<{ q: RoomQuiz; tried: number[]; solved: boolean } | null>(null);
  const openQuiz = () => {
    const q = roomQuiz(layout, asked);
    if (!q) return;
    setAsked((n) => n + 1);
    setQuiz({ q, tried: [], solved: false });
  };
  const answer = (n: number) => {
    if (!quiz) return;
    const right = n === quiz.q.answer;
    if (right) play.correct();
    else play.tryAgain();
    setQuiz({ ...quiz, solved: right || quiz.solved, tried: right || quiz.tried.includes(n) ? quiz.tried : [...quiz.tried, n] });
  };
  // 방 사진: 화면의 방 그림을 그림 파일로 저장. 찰칵 소리와 함께 잠깐 하얗게 번쩍
  const roomRef = useRef<HTMLDivElement>(null);
  const [flash, setFlash] = useState(0);
  const takePhoto = async () => {
    const el = roomRef.current?.firstElementChild as HTMLElement | null;
    if (!el) return;
    setFlash((n) => n + 1);
    play.place();
    const now = new Date();
    await saveRoomPhoto(el, `my-room-${now.toISOString().slice(0, 10)}.png`, t('room.photoCaption', { date: new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(now) }));
  };
  // 저녁·밤 조명 켜고 끄기 (이 화면에 있는 동안만 기억한다)
  const [lightsOff, setLightsOff] = useState<ReadonlySet<string>>(() => new Set());
  const [lightMsg, setLightMsg] = useState<'room.lightOn' | 'room.lightOff' | null>(null);
  const toggleLight = (uid: string) => {
    const next = new Set(lightsOff);
    const off = !next.delete(uid);
    if (off) next.add(uid);
    setLightsOff(next);
    setLightMsg(off ? 'room.lightOff' : 'room.lightOn');
    play.place();
  };
  const counting = Boolean(quiz && (quiz.solved || quiz.tried.length > 0)); // 한 번 답하면 같이 세어 본다
  const tipText = t(tip.key, { name: tip.nameKey ? tKey(tip.nameKey) : '', region: tip.regionKey ? tKey(tip.regionKey) : '' });
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

      {/* 루루가 지금 하면 좋은 것을 알려 준다 (높이가 낮은 가로 화면에서는 자리가 없어 숨김) */}
      <div className="mb-2 [@media(max-height:500px)]:hidden">
        {quiz ? (
          <GuideBubble
            compact
            text={quiz.solved ? t('room.quiz.right', { n: formatNumber(quiz.q.answer) }) : quiz.tried.length > 0 ? `${t('room.quiz.countTogether')} ${t(quiz.q.question)}` : t(quiz.q.question)}
            expression={quiz.solved ? 'happy' : quiz.tried.length > 0 ? 'cheer' : 'thinking'}
          />
        ) : (
          <GuideBubble compact text={lightMsg ? t(lightMsg) : tipText} expression={lightMsg ? 'happy' : tip.key === 'room.tips.firstGame' || tip.key.startsWith('room.tips.cozy') ? 'happy' : 'cheer'} />
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 [@media(max-height:500px)]:flex-row">
        <section className="relative min-h-[240px] flex-1 [@media(max-height:500px)]:min-h-0 [@media(max-height:700px)]:min-h-[190px]">
          <div ref={roomRef} className="h-full w-full">
            <RoomView
              layout={layout}
              pets={petsFor(game.stickers.length)}
              marks={counting ? quiz!.q.counted : undefined}
              lightsOff={lightsOff}
              onLightClick={quiz ? undefined : toggleLight}
            />
          </div>
          {flash > 0 && <div key={flash} aria-hidden="true" className="pointer-events-none absolute inset-0 animate-flash rounded-3xl bg-white" />}
          {/* 방 사진 찍기 (그림 파일로 기기에 저장) */}
          {!quiz && (
            <BigButton variant="soft" size="icon" className="absolute right-0 top-0" aria-label={t('room.photo')} onClick={takePhoto}>
              <Camera size={28} aria-hidden />
            </BigButton>
          )}
          {/* 루루의 질문 열기 (방에 셀 물건이 있을 때) */}
          {!quiz && roomQuiz(layout, asked) && (
            <BigButton variant="soft" size="icon" className="absolute left-0 top-0" aria-label={t('room.quiz.button')} onClick={openQuiz}>
              <Question size={28} aria-hidden />
            </BigButton>
          )}
        </section>

        {/* 아래 메뉴: 수학 놀이(초록)와 꾸미기·만들기(나무색)를 색과 아이콘으로 구분.
            아이콘을 글자 위에 두어 좁은 폰에서도 글자가 한 줄에 들어가게 한다 */}
        {quiz ? (
          <div className="flex flex-col gap-3 [@media(max-height:500px)]:w-64 [@media(max-height:500px)]:justify-center">
            {/* 높이가 낮은 가로 화면에서는 말풍선이 숨어 있으므로 질문을 여기에 */}
            <p className="hidden text-lg font-semibold [@media(max-height:500px)]:block">{quiz.solved ? t('room.quiz.right', { n: quiz.q.answer }) : t(quiz.q.question)}</p>
            <ChoiceButtons choices={quiz.q.choices} tried={quiz.tried} chosen={quiz.solved ? quiz.q.answer : null} onChoose={(c) => answer(c as number)} />
            <BigButton variant={quiz.solved ? 'primary' : 'soft'} onClick={() => setQuiz(null)}>
              <Check size={26} strokeWidth={3} aria-hidden />
              {t('room.quiz.done')}
            </BigButton>
          </div>
        ) : (
          <nav className="grid grid-cols-2 gap-3 [@media(max-height:500px)]:w-64 [@media(max-height:500px)]:content-center">
            <BigButton size="lg" variant="sage" className="col-span-2 flex-col !gap-1 !px-3 [@media(max-height:700px)]:!min-h-[60px] [@media(max-height:700px)]:!py-1" onClick={onPlay}>
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
        )}
      </div>
    </AppShell>
  );
}
