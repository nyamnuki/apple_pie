import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import PetArt from './PetArt';
import { startSpots, step, type PetDef, type Spot } from './pets';
import { footprintCorners, TILE_H } from '../room/iso';
import { useI18n } from '../../i18n';
import { useSound } from '../../services/audio/SoundProvider';
import { canSpeak, speak } from '../../services/speech/speech';
import type { RoomLayout } from '../../types/furniture';

const SIZE = 64; // 방 좌표에서 친구 그림 크기
const WALK_MS = 3200; // 몇 초마다 한 친구가 한 칸 걷는지

// 방의 반려 친구들: 빈 칸을 천천히 돌아다니고, 누르면 폴짝 뛰며 하트를 보여준다.
// 움직임 줄이기 설정이면 돌아다니지 않는다. 앱이 보이지 않을 때도 멈춘다.
export default function PetLayer({ pets, layout }: { pets: PetDef[]; layout: RoomLayout }) {
  const { t, tKey, locale } = useI18n();
  const { play, voiceOn } = useSound();
  const [speakable] = useState(() => canSpeak(locale));
  const [spots, setSpots] = useState<Spot[]>(() => startSpots(layout, pets.length));
  const [hop, setHop] = useState<{ i: number; n: number } | null>(null);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  // 친구 수가 바뀌면(새 친구) 자리를 다시 정한다
  useEffect(() => setSpots(startSpots(layoutRef.current, pets.length)), [pets.length]);

  // 걷기
  const still = useMemo(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, []);
  useEffect(() => {
    if (still || pets.length === 0) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'hidden') return;
      setSpots((prev) => {
        if (prev.length === 0) return prev;
        const i = Math.floor(Math.random() * prev.length);
        const others = prev.filter((_, k) => k !== i);
        const next = [...prev];
        next[i] = step(layoutRef.current, prev[i], others, Math.random());
        return next;
      });
    }, WALK_MS);
    return () => window.clearInterval(timer);
  }, [still, pets.length]);

  // 누르면 폴짝 + 소리, 자동 읽기를 켰으면 '안녕, ○○!' 하고 이름을 불러 준다
  const sayHi = (i: number) => {
    setHop((h) => ({ i, n: (h?.n ?? 0) + 1 }));
    play.correct();
    if (voiceOn && speakable) speak(t('pets.hello', { name: tKey(pets[i].nameKey) }), locale);
  };

  return (
    <g>
      {pets.map((pet, i) => {
        const spot = spots[i];
        if (!spot) return null;
        const c = footprintCorners(spot.gx, spot.gy, 1, 1);
        const x = c.top.x - SIZE / 2;
        const y = c.top.y + TILE_H / 2 + 6 - SIZE;
        const hopping = hop?.i === i;
        const onKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            sayHi(i);
          }
        };
        return (
          <g
            key={pet.id}
            data-pet={pet.id}
            data-spot={`${spot.gx},${spot.gy}`}
            role="button"
            tabIndex={0}
            aria-label={t('pets.sayHi', { name: tKey(pet.nameKey) })}
            onClick={() => sayHi(i)}
            onKeyDown={onKeyDown}
            style={{ transform: `translate(${x}px, ${y}px)`, transition: 'transform 0.9s ease-in-out', cursor: 'pointer' }}
          >
            <g key={hopping ? hop!.n : 0} className={hopping ? 'animate-hop' : undefined} style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
              <svg width={SIZE} height={SIZE} viewBox="0 0 64 64" overflow="visible">
                <PetArt id={pet.id} />
                {hopping && (
                  <path key={hop!.n} className="animate-rise" d="M32 4 C28 -2 20 0 22 6 C24 10 32 14 32 14 C32 14 40 10 42 6 C44 0 36 -2 32 4 Z" fill="#F3C6D2" stroke="#6B5444" strokeOpacity="0.6" strokeWidth="1.4" />
                )}
              </svg>
            </g>
          </g>
        );
      })}
    </g>
  );
}
