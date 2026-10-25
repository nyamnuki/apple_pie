import AppShell from '../../components/AppShell';
import ScreenHeader from '../../components/ScreenHeader';
import { useI18n } from '../../i18n';

// 아직 만들지 않은 기능의 자리 (놀이하기·방 꾸미기는 다음 단계에서 들어온다)
export default function ComingSoonScreen({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  return (
    <AppShell>
      <ScreenHeader title={t('common.comingSoon')} onBack={onBack} />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[2rem] bg-moss/60 p-6 text-center">
        <span className="text-7xl" aria-hidden>
          🌱
        </span>
        <p className="text-xl">{t('common.comingSoonDetail')}</p>
      </div>
    </AppShell>
  );
}
