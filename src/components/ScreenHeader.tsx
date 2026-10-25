import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import BigButton from './BigButton';
import { useI18n } from '../i18n';

// 하위 화면 머리말: 뒤로 가기 버튼 + 제목 (+ 오른쪽 추가 영역)
export default function ScreenHeader({ title, onBack, right }: { title: string; onBack?: () => void; right?: ReactNode }) {
  const { t } = useI18n();
  const titleRef = useRef<HTMLHeadingElement>(null);
  // 새 화면이 열리면 제목으로 초점을 옮긴다 (손가락으로 누를 때는 테두리가 보이지 않는다)
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, []);
  return (
    <header className="flex items-center gap-3 pb-4 [@media(max-height:500px)]:pb-2">
      {onBack && (
        <BigButton variant="soft" size="icon" onClick={onBack} aria-label={t('a11y.goBack')}>
          <ArrowLeft size={28} strokeWidth={3} aria-hidden />
        </BigButton>
      )}
      <h1 ref={titleRef} tabIndex={-1} className="min-w-0 flex-1 text-2xl font-bold outline-none sm:text-3xl">
        {title}
      </h1>
      {right}
    </header>
  );
}
