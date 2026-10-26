import { useEffect, useRef } from 'react';
import { useI18n } from '../../../i18n';
import { useSound } from '../../../services/audio/SoundProvider';
import { speakNumber } from '../../../services/speech/speech';
import { useCanSpeak } from '../../../services/speech/useCanSpeak';

// 지금까지 센 수를 크게 보여주는 동그라미.
// 수가 하나 늘 때마다 그 수를 소리 내어 읽어 준다 (자동 읽기를 켰을 때. 처음부터 끝난 모습이면 읽지 않음)
export default function CountBubble({ value }: { value: number }) {
  const { t, formatNumber, locale } = useI18n();
  const { voiceOn, interacted } = useSound();
  const speakable = useCanSpeak(locale);
  const heard = useRef(value);
  useEffect(() => {
    if (value > heard.current && speakable && voiceOn && interacted) speakNumber(value, locale);
    heard.current = value;
  }, [value, speakable, voiceOn, interacted, locale]);
  return (
    <div
      role="status"
      aria-label={t('math.a11y.counter', { n: formatNumber(value) })}
      className="flex h-16 min-w-16 items-center justify-center rounded-full bg-apricot px-3 text-4xl font-bold shadow-pop-sm"
    >
      {formatNumber(value)}
    </div>
  );
}
