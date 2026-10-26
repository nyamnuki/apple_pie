import { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import Character from './characters/Character';
import { CHARACTERS, type CharacterId, type Expression } from '../data/characters/characters';
import { useI18n } from '../i18n';
import { useSound } from '../services/audio/SoundProvider';
import { canSpeak, speak, stopSpeaking } from '../services/speech/speech';

interface Props {
  text: string;
  expression?: Expression;
  speaker?: CharacterId; // 말하는 캐릭터 (기본: 루루)
}

// 캐릭터의 말풍선. 상황에 맞는 표정을 함께 보여준다.
// 화면 읽기 프로그램이 바뀐 말을 읽어 주도록 aria-live 를 쓴다.
// 스피커 버튼을 누르면 소리 내어 읽어 주고, 설정의 '읽어 주기'가 켜져 있으면 말이 바뀔 때마다 자동으로 읽는다.
export default function GuideBubble({ text, expression = 'default', speaker = 'lulu' }: Props) {
  const { t, tKey, locale } = useI18n();
  const { voiceOn, interacted } = useSound();
  const [speakable] = useState(() => canSpeak(locale));

  // 자동 읽기: 아이가 화면을 한 번 누른 뒤부터 (브라우저 규칙)
  useEffect(() => {
    if (speakable && voiceOn && interacted) speak(text, locale);
  }, [text, locale, voiceOn, interacted, speakable]);
  // 화면을 떠나면 읽던 것을 멈춘다
  useEffect(() => () => stopSpeaking(), []);

  return (
    <div className="flex items-start gap-2">
      {/* 기쁘거나 놀랄 때 한 번 폴짝 (표정이 바뀔 때마다 다시) */}
      <span key={expression} className={expression === 'happy' || expression === 'surprised' ? 'animate-hop' : undefined}>
        <Character id={speaker} expression={expression} size={72} bob />
      </span>
      <div className="storybook-card relative min-h-[3.5rem] flex-1 rounded-3xl rounded-tl-none">
        <p aria-live="polite" aria-label={`${t('math.a11y.guide', { name: tKey(CHARACTERS[speaker].nameKey) })}: ${text}`} className={`px-4 py-3 text-xl font-semibold ${speakable ? 'pr-16' : 'pr-12'}`}>
          {text}
        </p>
        {speakable && (
          <button
            type="button"
            onClick={() => speak(text, locale)}
            aria-label={t('a11y.readAloud')}
            className="absolute bottom-1 right-1 flex h-12 w-12 items-center justify-center rounded-full bg-sage/70 text-bark shadow-pop-sm active:translate-y-0.5"
          >
            <Volume2 size={26} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
