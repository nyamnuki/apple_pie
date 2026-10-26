import { useEffect, useRef, useState } from 'react';
import Character from '../../components/characters/Character';
import BigButton from '../../components/BigButton';
import { useI18n } from '../../i18n';
import { useSound } from '../../services/audio/SoundProvider';
import { speak } from '../../services/speech/speech';

const REST_SECONDS = 20; // 쉬는 시간 (이만큼 지나야 '다시 놀래요' 버튼이 켜진다)
const AWAY_RESET = 5 * 60; // 이만큼(초) 앱을 떠나 있었으면 이미 쉰 것으로 친다

// 쉬어 가기: 앱을 계속 보고 있으면 정해진 시간마다 루루가 잠깐 쉬자고 권한다.
// 앱이 보일 때만 시간을 센다. 어른 설정에서 끄거나 15·20·30분으로 바꿀 수 있다.
export default function BreakReminder() {
  const { t, locale } = useI18n();
  const { breakMinutes, voiceOn, interacted } = useSound();
  const [resting, setResting] = useState(false);
  const [left, setLeft] = useState(REST_SECONDS);
  const active = useRef(0); // 앱을 보고 있던 초
  const hiddenAt = useRef<number | null>(null);

  // 1초마다: 보이는 동안만 센다
  useEffect(() => {
    if (!breakMinutes) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'hidden' || resting) return;
      active.current += 1;
      if (active.current >= breakMinutes * 60) {
        active.current = 0;
        setLeft(REST_SECONDS);
        setResting(true);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [breakMinutes, resting]);

  // 오래 떠나 있다 돌아오면 처음부터
  useEffect(() => {
    const onChange = () => {
      if (document.visibilityState === 'hidden') hiddenAt.current = Date.now();
      else if (hiddenAt.current && Date.now() - hiddenAt.current > AWAY_RESET * 1000) active.current = 0;
    };
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  // 쉬는 동안 남은 초
  useEffect(() => {
    if (!resting || left <= 0) return;
    const timer = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resting, left]);

  // 쉬자는 말도 읽어 준다
  useEffect(() => {
    if (resting && voiceOn && interacted) speak(t('breaks.body'), locale);
  }, [resting, voiceOn, interacted, t, locale]);

  if (!resting) return null;
  const ready = left <= 0;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bark/40 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="break-title" aria-describedby="break-body" className="storybook-card flex w-full max-w-sm flex-col items-center gap-3 rounded-[2rem] p-6 text-center">
        <span className="animate-bob">
          <Character expression="cheer" size={120} />
        </span>
        <h2 id="break-title" className="text-3xl font-bold">
          {t('breaks.title')}
        </h2>
        <p id="break-body" className="text-xl">
          {t('breaks.body')}
        </p>
        {/* 남은 시간: 숫자와 줄어드는 막대 */}
        <div className="flex w-full items-center gap-3" aria-hidden={ready}>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-bark/10">
            <div className="h-full rounded-full bg-sage transition-[width] duration-1000 ease-linear" style={{ width: `${(left / REST_SECONDS) * 100}%` }} />
          </div>
          {!ready && <span className="w-8 text-xl font-bold tabular-nums">{left}</span>}
        </div>
        <BigButton size="lg" className="w-full" disabled={!ready} onClick={() => setResting(false)}>
          {t('breaks.back')}
        </BigButton>
      </div>
    </div>
  );
}
