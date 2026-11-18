import type { ReactNode } from 'react';

// 모든 화면의 바깥 틀. 폰·태블릿 어디서든 가운데 정렬하고 최대 폭을 둔다.
// 안쪽 틀이 <main> 이라서 화면 읽기 프로그램이 '본문'으로 바로 이동할 수 있다.
// (그래서 각 화면 안에서는 <main> 을 또 쓰지 않는다)
// fit: 화면 높이에 딱 맞춘다 (놀이 화면). 안쪽에서 놀이판만 따로 스크롤해서 안내와 답 버튼이 늘 보이게 한다.
//      내용이 그래도 넘치면(아주 낮은 화면) 바깥이 스크롤되므로 잘리지 않는다.
export default function AppShell({ children, background = 'bg-cream', fit = false }: { children: ReactNode; background?: string; fit?: boolean }) {
  return (
    <div className={`fixed inset-0 flex justify-center overflow-y-auto ${background}`}>
      {/* 수채화 종이 결 (화면 전체에 아주 옅게, 누르기에는 영향 없음) */}
      <div aria-hidden="true" className="paper-grain pointer-events-none fixed inset-0" />
      <main className={`safe-pad relative flex w-full max-w-3xl flex-col ${fit ? 'h-full' : 'min-h-full'}`}>{children}</main>
    </div>
  );
}
