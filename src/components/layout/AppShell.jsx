// 전체 화면 틀. 세로(폰)·가로(태블릿) 모두에서 가운데 정렬되고,
// 아주 넓은 화면에서는 최대 폭을 둬서 게임 화면이 지나치게 늘어나지 않게 한다.
export default function AppShell({ children, background = 'bg-cream' }) {
  return (
    <div className={`fixed inset-0 flex justify-center ${background} transition-colors duration-500`}>
      <div className="safe-pad relative flex h-full w-full max-w-5xl flex-col">{children}</div>
    </div>
  );
}
