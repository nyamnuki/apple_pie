import Character from './characters/Character';
import { CHARACTERS, type CharacterId, type Expression } from '../data/characters/characters';
import { useI18n } from '../i18n';

interface Props {
  text: string;
  expression?: Expression;
  speaker?: CharacterId; // 말하는 캐릭터 (기본: 루루)
}

// 캐릭터의 말풍선. 상황에 맞는 표정을 함께 보여준다.
// 화면 읽기 프로그램이 바뀐 말을 읽어 주도록 aria-live 를 쓴다.
export default function GuideBubble({ text, expression = 'default', speaker = 'lulu' }: Props) {
  const { t, tKey } = useI18n();
  return (
    <div className="flex items-start gap-2">
      {/* 기쁘거나 놀랄 때 한 번 폴짝 (표정이 바뀔 때마다 다시) */}
      <span key={expression} className={expression === 'happy' || expression === 'surprised' ? 'animate-hop' : undefined}>
        <Character id={speaker} expression={expression} size={72} bob />
      </span>
      <p aria-live="polite" aria-label={`${t('math.a11y.guide', { name: tKey(CHARACTERS[speaker].nameKey) })}: ${text}`} className="storybook-card min-h-[3.5rem] flex-1 rounded-3xl rounded-tl-none px-4 py-3 pr-12 text-xl font-semibold">
        {text}
      </p>
    </div>
  );
}
