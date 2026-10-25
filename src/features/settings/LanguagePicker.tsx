import { Check } from 'lucide-react';
import { useI18n, LOCALES, type Locale, type TranslationKey } from '../../i18n';

// 각 언어 버튼의 이름. 언어 이름은 그 언어 자체로도 함께 보여줘서
// 지금 화면 언어를 못 읽는 사람도 자기 언어를 찾을 수 있게 한다.
const LABELS: Record<Locale, { key: TranslationKey; native: string; flag: string }> = {
  en: { key: 'settings.english', native: 'English', flag: '🇺🇸' },
  ko: { key: 'settings.korean', native: '한국어', flag: '🇰🇷' },
};

// 언어 선택: 큰 카드 두 개. 고르면 바로 화면 전체 언어가 바뀐다.
export default function LanguagePicker() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div role="radiogroup" aria-label={t('settings.language')} className="grid gap-3 sm:grid-cols-2">
      {LOCALES.map((code) => {
        const selected = code === locale;
        const label = LABELS[code];
        const translated = t(label.key);
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={selected}
            lang={code}
            onClick={() => setLocale(code)}
            className={`flex min-h-[80px] items-center gap-4 rounded-3xl border-4 px-5 py-3 text-left transition-colors ${
              selected ? 'border-oak bg-apricot shadow-pop-sm' : 'border-transparent bg-cream shadow-pop'
            }`}
          >
            <span className="text-4xl" aria-hidden>
              {label.flag}
            </span>
            <span className="flex-1">
              <span className="block text-2xl font-bold">{label.native}</span>
              {/* 현재 언어로 번역한 이름 (예: 한국어 화면에서 '영어') — 같으면 생략 */}
              {translated !== label.native && <span className="block text-base text-bark/70">{translated}</span>}
            </span>
            {/* 색만으로 구분하지 않도록 체크 표시와 '선택됨' 글자도 함께 보여준다 */}
            {selected && (
              <span className="flex items-center gap-1 rounded-full bg-oak px-3 py-1 text-base text-cream">
                <Check size={20} strokeWidth={3} aria-hidden />
                {t('settings.selected')}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
