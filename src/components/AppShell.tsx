import type { ReactNode } from 'react';

// 모든 화면의 바깥 틀. 폰·태블릿 어디서든 가운데 정렬하고 최대 폭을 둔다.
// 안쪽 틀이 <main> 이라서 화면 읽기 프로그램이 '본문'으로 바로 이동할 수 있다.
// (그래서 각 화면 안에서는 <main> 을 또 쓰지 않는다)
export default function AppShell({ children, background = 'bg-cream' }: { children: ReactNode; background?: string }) {
  return (
    <div className={`fixed inset-0 flex justify-center overflow-y-auto ${background}`}>
      <main className="safe-pad flex min-h-full w-full max-w-3xl flex-col">{children}</main>
    </div>
  );
}
