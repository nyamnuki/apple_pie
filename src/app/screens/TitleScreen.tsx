import { Play, Settings } from '../../components/icons';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import SaveNotice from '../../components/SaveNotice';
import Character from '../../components/characters/Character';
import TitleScene from '../../components/art/TitleScene';
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
      <TitleScene />
      {notice && <SaveNotice status={notice} onClose={onCloseNotice} />}
      <div className="relative flex justify-end">
        <BigButton variant="soft" size="icon" onClick={onSettings} aria-label={t('a11y.openSettings')}>
          <Settings size={28} aria-hidden />
        </BigButton>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 text-center [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:gap-10">
        {/* 루루와 친구들 (도토·모모) */}
        <div className="flex items-end gap-1">
          <Character id="doto" expression="happy" size={92} />
          <Character expression="cheer" size={150} bob />
          <Character id="momo" expression="happy" size={92} />
        </div>
        <div className="flex w-full max-w-xs flex-col items-center gap-6">
          <div>
            {/* 제목: 크림색 종이 띠 위에 (뒤 풍경과 겹쳐도 또렷하게) */}
            <h1 className="storybook-card rounded-[2rem] px-6 py-2 text-5xl font-bold sm:text-6xl">{t('app.title')}</h1>
            <p className="mt-3 inline-block rounded-full bg-cream/80 px-4 text-2xl font-semibold text-wood">{t('app.subtitle')}</p>
          </div>
          <BigButton size="lg" onClick={onStart} className="w-full">
            <Play size={30} fill="currentColor" aria-hidden />
            {t('menu.start')}
          </BigButton>
        </div>
      </div>

      <p className="relative mx-auto mt-4 rounded-full bg-cream/85 px-4 py-1 text-center text-sm text-bark">{t('app.promise')}</p>
    </AppShell>
  );
}
