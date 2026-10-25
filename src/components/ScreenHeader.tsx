import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import BigButton from './BigButton';
import { useI18n } from '../i18n';

// 하위 화면 머리말: 뒤로 가기 버튼 + 제목 (+ 오른쪽 추가 영역)
export default function ScreenHeader({ title, onBack, right }: { title: string; onBack?: () => void; right?: ReactNode }) {
  const { t } = useI18n();
  return (
    <header className="flex items-center gap-3 pb-4">
      {onBack && (
        <BigButton variant="soft" size="icon" onClick={onBack} aria-label={t('a11y.goBack')}>
          <ArrowLeft size={28} strokeWidth={3} aria-hidden />
        </BigButton>
      )}
      <h1 className="min-w-0 flex-1 text-2xl font-bold sm:text-3xl">{title}</h1>
      {right}
    </header>
  );
}
