import BigButton from '../../../components/BigButton';
import { useI18n } from '../../../i18n';
import { useBackHandler } from '../../../app/backButton';

// 놀이 도중 나가기 전에 한 번 묻는다. 기본(먼저 초점)은 '계속하기' — 실수로 나가지 않게.
// 휴대폰 뒤로 가기를 한 번 더 누르면 '계속하기'와 같다.
export default function ExitConfirm({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) {
  const { t } = useI18n();
  useBackHandler(onStay);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bark/40 p-4" onKeyDown={(e) => e.key === 'Escape' && onStay()}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="exit-q" className="storybook-card flex w-full max-w-sm flex-col gap-4 rounded-[2rem] p-6 text-center">
        <h2 id="exit-q" className="text-2xl font-bold">
          {t('math.exitAsk')}
        </h2>
        <p className="text-lg">{t('math.exitNote')}</p>
        <div className="grid gap-3">
          <BigButton autoFocus size="lg" onClick={onStay}>
            {t('math.exitStay')}
          </BigButton>
          <BigButton variant="soft" onClick={onLeave}>
            {t('math.exitLeave')}
          </BigButton>
        </div>
      </div>
    </div>
  );
}
