import { Languages, Save } from 'lucide-react';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import ScreenHeader from '../../components/ScreenHeader';
import LanguagePicker from './LanguagePicker';
import { useI18n } from '../../i18n';
import { readSavedAt } from '../../services/storage/gameSave';

// 설정 화면: 언어 선택과 저장 상태 안내. (부모 확인·시간 제한은 이후 단계)
export default function SettingsScreen({ onBack, canSave }: { onBack: () => void; canSave: boolean }) {
  const { t, formatDateTime } = useI18n();
  const savedAt = canSave ? readSavedAt() : null;
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

      <section aria-labelledby="save-heading" className="mt-4 rounded-[2rem] bg-moss/60 p-5">
        <h2 id="save-heading" className="mb-1 flex items-center gap-2 text-2xl font-bold">
          <Save size={28} aria-hidden />
          {t('save.title')}
        </h2>
        <p className="text-lg">{t(canSave ? 'save.savedHere' : 'save.notSaved')}</p>
        {savedAt && <p className="mt-1 text-base text-bark/80">{t('save.lastSaved', { time: formatDateTime(savedAt) })}</p>}
      </section>

      <div className="mt-auto pt-6">
        <BigButton variant="soft" className="w-full" onClick={onBack}>
          {t('menu.back')}
        </BigButton>
      </div>
    </AppShell>
  );
}
