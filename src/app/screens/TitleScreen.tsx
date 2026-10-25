import { Play, Settings } from 'lucide-react';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import SaveNotice from '../../components/SaveNotice';
import { useI18n } from '../../i18n';
import type { LoadStatus } from '../../services/storage/gameSave';

// 타이틀 화면. 캐릭터(Lulu) 그림은 Phase 6 에서 실제 에셋으로 바뀐다.
interface Props {
  onStart: () => void;
  onSettings: () => void;
  notice: LoadStatus | null; // 보여줄 저장 안내 (없으면 null)
  onCloseNotice: () => void;
}

export default function TitleScreen({ onStart, onSettings, notice, onCloseNotice }: Props) {
  const { t } = useI18n();
  return (
    <AppShell background="bg-gradient-to-b from-mist via-cream to-moss">
      {notice && <SaveNotice status={notice} onClose={onCloseNotice} />}
      <div className="flex justify-end">
        <BigButton variant="soft" size="icon" onClick={onSettings} aria-label={t('a11y.openSettings')}>
          <Settings size={28} aria-hidden />
        </BigButton>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <span role="img" aria-label={t('a11y.mascot')} className="text-8xl">
          🐰
        </span>
        <div>
          <h1 className="text-5xl font-bold sm:text-6xl">{t('app.title')}</h1>
          <p className="mt-2 text-2xl text-oak">{t('app.subtitle')}</p>
        </div>
        <BigButton size="lg" onClick={onStart} className="w-full max-w-xs">
          <Play size={30} fill="currentColor" aria-hidden />
          {t('menu.start')}
        </BigButton>
      </main>

      <p className="pt-4 text-center text-sm text-bark/70">{t('app.promise')}</p>
    </AppShell>
  );
}
