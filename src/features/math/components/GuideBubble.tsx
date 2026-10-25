import { useI18n } from '../../../i18n';

// 안내 캐릭터의 말풍선. (Lulu 그림은 Phase 6 에서 들어오고, 지금은 그림 문자로 대신한다)
// 화면 읽기 프로그램이 바뀐 말을 읽어 주도록 aria-live 를 쓴다.
export default function GuideBubble({ text }: { text: string }) {
  const { t } = useI18n();
  return (
    <div className="flex items-start gap-2">
      <span role="img" aria-label={t('a11y.mascot')} className="text-5xl leading-none">
        🐰
      </span>
      <p aria-live="polite" aria-label={`${t('math.a11y.guide')}: ${text}`} className="min-h-[3.5rem] flex-1 rounded-3xl rounded-tl-none bg-cream px-4 py-3 text-xl font-semibold shadow-pop-sm">
        {text}
      </p>
    </div>
  );
}
