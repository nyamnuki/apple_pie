import type { ReactNode } from 'react';

// 모든 화면의 바깥 틀. 폰·태블릿 어디서든 가운데 정렬하고 최대 폭을 둔다.
export default function AppShell({ children, background = 'bg-cream' }: { children: ReactNode; background?: string }) {
  return (
    <div className={`fixed inset-0 flex justify-center overflow-y-auto ${background}`}>
      <div className="safe-pad flex min-h-full w-full max-w-3xl flex-col">{children}</div>
    </div>
  );
}
