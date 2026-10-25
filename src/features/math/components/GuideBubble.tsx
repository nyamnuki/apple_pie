import Character from '../../../components/characters/Character';
import type { Expression } from '../../../data/characters/characters';
import { useI18n } from '../../../i18n';

// 루루의 말풍선. 상황에 맞는 표정을 함께 보여준다.
// 화면 읽기 프로그램이 바뀐 말을 읽어 주도록 aria-live 를 쓴다.
export default function GuideBubble({ text, expression = 'default' }: { text: string; expression?: Expression }) {
  const { t } = useI18n();
  return (
    <div className="flex items-start gap-2">
      <Character expression={expression} size={72} bob />
      <p aria-live="polite" aria-label={`${t('math.a11y.guide')}: ${text}`} className="min-h-[3.5rem] flex-1 rounded-3xl rounded-tl-none bg-cream px-4 py-3 text-xl font-semibold shadow-pop-sm">
        {text}
      </p>
    </div>
  );
}
