import { Play, Settings } from 'lucide-react';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import SaveNotice from '../../components/SaveNotice';
import Character from '../../components/characters/Character';
import { useI18n } from '../../i18n';
import type { LoadStatus } from '../../services/storage/gameSave';

// 타이틀 화면: 루루가 반겨 준다.
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

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:gap-10">
        <Character expression="cheer" size={150} bob />
        <div className="flex w-full max-w-xs flex-col items-center gap-6">
          <div>
            <h1 className="text-5xl font-bold sm:text-6xl">{t('app.title')}</h1>
            <p className="mt-2 text-2xl text-wood">{t('app.subtitle')}</p>
          </div>
          <BigButton size="lg" onClick={onStart} className="w-full">
            <Play size={30} fill="currentColor" aria-hidden />
            {t('menu.start')}
          </BigButton>
        </div>
      </div>

      <p className="pt-4 text-center text-sm text-bark/85">{t('app.promise')}</p>
    </AppShell>
  );
}
