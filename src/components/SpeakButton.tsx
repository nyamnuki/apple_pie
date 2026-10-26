import { useState } from 'react';
import { Volume2 } from './icons';
import { useI18n } from '../i18n';
import { canSpeak, speak } from '../services/speech/speech';

// 이름 듣기: 글을 아직 못 읽는 아이가 놀이·가구 이름을 소리로 듣는 작은 스피커 버튼.
// 기기에 그 언어 목소리가 없으면 그리지 않는다. (다른 버튼 안에 넣지 말고 옆에 둔다)
// 이름표는 '이름 듣기' 하나로 둔다: 바로 옆 카드가 이름을 알려 주고, 카드 이름과 겹치지 않게.
export default function SpeakButton({ text, className = '' }: { text: string; className?: string }) {
  const { t, locale } = useI18n();
  const [speakable] = useState(() => canSpeak(locale));
  if (!speakable) return null;
  return (
    <button
      type="button"
      onClick={() => speak(text, locale)}
      aria-label={t('a11y.hear')}
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage/70 text-bark shadow-pop-sm active:translate-y-0.5 ${className}`}
    >
      <Volume2 size={24} aria-hidden />
    </button>
  );
}
