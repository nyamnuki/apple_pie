import { Languages, Save, Lock, Volume2, VolumeX, Music } from 'lucide-react';
import AppShell from '../../components/AppShell';
import BigButton from '../../components/BigButton';
import ScreenHeader from '../../components/ScreenHeader';
import LanguagePicker from './LanguagePicker';
import SettingSwitch from '../../components/SettingSwitch';
import { useI18n } from '../../i18n';
import { readSavedAt } from '../../services/storage/gameSave';
import { useSound } from '../../services/audio/SoundProvider';
import { SOUNDS } from '../../services/audio/sound';

// 설정 화면: 언어 선택, 효과음·배경 음악 켜기/끄기, 저장 상태 안내, 어른 전용 설정으로 가는 버튼
export default function SettingsScreen({ onBack, onParent, canSave }: { onBack: () => void; onParent: () => void; canSave: boolean }) {
  const { t, formatDateTime } = useI18n();
  const savedAt = canSave ? readSavedAt() : null;
  const { soundOn, setSoundOn, musicOn, setMusicOn } = useSound();
  return (
    <AppShell>
      <ScreenHeader title={t('settings.title')} onBack={onBack} />

      <section aria-labelledby="language-heading" className="rounded-[2rem] bg-moss/60 p-5">
        <h2 id="language-heading" className="mb-1 flex items-center gap-2 text-2xl font-bold">
          <Languages size={28} aria-hidden />
          {t('settings.language')}
        </h2>
        <p className="mb-4 text-lg text-bark/85">{t('settings.languageHint')}</p>
        <LanguagePicker />
      </section>

      <SettingSwitch
        id="sound-heading"
        title={t('settings.sound')}
        icon={soundOn ? <Volume2 size={28} aria-hidden /> : <VolumeX size={28} aria-hidden />}
        on={soundOn}
        onLabel={t('settings.soundOn')}
        offLabel={t('settings.soundOff')}
        onToggle={() => {
          setSoundOn(!soundOn);
          if (!soundOn) SOUNDS.correct(); // 켤 때 소리로 확인 (아직 꺼진 상태라 직접 재생)
        }}
      />
      <SettingSwitch
        id="music-heading"
        title={t('settings.music')}
        icon={<Music size={28} aria-hidden />}
        on={musicOn}
        onLabel={t('settings.musicOn')}
        offLabel={t('settings.musicOff')}
        onToggle={() => setMusicOn(!musicOn)}
      />

      <section aria-labelledby="save-heading" className="selectable mt-4 rounded-[2rem] bg-moss/60 p-5">
        <h2 id="save-heading" className="mb-1 flex items-center gap-2 text-2xl font-bold">
          <Save size={28} aria-hidden />
          {t('save.title')}
        </h2>
        <p className="text-lg">{t(canSave ? 'save.savedHere' : 'save.notSaved')}</p>
        {savedAt && <p className="mt-1 text-base text-bark/85">{t('save.lastSaved', { time: formatDateTime(savedAt) })}</p>}
      </section>

      {/* 어른 전용: 곱셈 문제를 풀어야 들어갈 수 있다 */}
      <BigButton variant="soft" className="mt-4" onClick={onParent}>
        <Lock size={24} aria-hidden />
        {t('parent.entry')}
      </BigButton>

      <div className="mt-auto pt-6">
        <BigButton variant="soft" className="w-full" onClick={onBack}>
          {t('menu.back')}
        </BigButton>
      </div>
    </AppShell>
  );
}
