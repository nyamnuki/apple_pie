import { ArrowLeft } from 'lucide-react';
import BigButton from '../common/BigButton.jsx';

// 하위 화면 공통 머리말: 뒤로 가기 + 제목 + (선택) 오른쪽 영역
export default function ScreenHeader({ title, onBack, right }) {
  return (
    <header className="flex items-center gap-3 py-2">
      {onBack && (
        <BigButton variant="soft" size="icon" onClick={onBack} aria-label="뒤로 가기">
          <ArrowLeft size={28} strokeWidth={3} />
        </BigButton>
      )}
      <h1 className="flex-1 truncate font-display text-2xl text-cocoa-700 sm:text-3xl">{title}</h1>
      {right}
    </header>
  );
}
