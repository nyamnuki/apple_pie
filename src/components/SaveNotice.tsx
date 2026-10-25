import { Info } from 'lucide-react';
import BigButton from './BigButton';
import { useI18n } from '../i18n';
import type { LoadStatus } from '../services/storage/gameSave';

// 저장 관련 안내 (저장할 수 없는 브라우저이거나, 망가진 저장본을 새로 시작했을 때만 보인다)
export default function SaveNotice({ status, onClose }: { status: LoadStatus; onClose: () => void }) {
  const { t } = useI18n();
  if (status !== 'recovered' && status !== 'unavailable') return null;
  return (
    <div role="status" className="mb-3 flex items-center gap-3 rounded-3xl bg-cream p-3 shadow-pop-sm">
      <Info size={28} className="shrink-0 text-oak" aria-hidden />
      <p className="flex-1 text-base font-semibold">{t(status === 'recovered' ? 'save.recovered' : 'save.notSaved')}</p>
      <BigButton variant="soft" className="!min-h-[48px] !px-4 !text-lg" onClick={onClose}>
        {t('common.ok')}
      </BigButton>
    </div>
  );
}
