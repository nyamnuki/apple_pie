import { Languages } from 'lucide-react';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import ScreenHeader from '../../components/ScreenHeader';
import LanguagePicker from './LanguagePicker';
import { useI18n } from '../../i18n';

// 설정 화면. 지금은 언어 설정만 있다. (부모 확인·시간 제한은 이후 단계)
export default function SettingsScreen({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  return (
    <AppShell>
      <ScreenHeader title={t('settings.title')} onBack={onBack} />

      <section aria-labelledby="language-heading" className="rounded-[2rem] bg-moss/60 p-5">
        <h2 id="language-heading" className="mb-1 flex items-center gap-2 text-2xl font-bold">
          <Languages size={28} aria-hidden />
          {t('settings.language')}
        </h2>
        <p className="mb-4 text-lg text-bark/80">{t('settings.languageHint')}</p>
        <LanguagePicker />
      </section>

      <div className="mt-auto pt-6">
        <BigButton variant="soft" className="w-full" onClick={onBack}>
          {t('menu.back')}
        </BigButton>
      </div>
    </AppShell>
  );
}
