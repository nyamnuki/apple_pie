import type { ReactNode } from 'react';

interface Props {
  id: string; // 제목 요소 id (스위치 이름으로 쓴다)
  title: string;
  icon: ReactNode;
  on: boolean;
  onLabel: string; // 켜졌을 때 글자 (예: 소리 켜짐)
  offLabel: string;
  onToggle: () => void;
}

// 설정의 켜기/끄기 스위치. 켜짐/꺼짐을 색만이 아니라 글자와 위치로도 보여준다.
export default function SettingSwitch({ id, title, icon, on, onLabel, offLabel, onToggle }: Props) {
  return (
    <section aria-labelledby={id} className="mt-4 rounded-[2rem] bg-moss/60 p-5">
      <h2 id={id} className="mb-3 flex items-center gap-2 text-2xl font-bold">
        {icon}
        {title}
      </h2>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={id}
        onClick={onToggle}
        className={`flex min-h-[56px] w-full items-center justify-between rounded-3xl border-4 px-5 text-xl font-bold transition-colors ${on ? 'border-wood bg-apricot' : 'border-transparent bg-cream'}`}
      >
        <span>{on ? onLabel : offLabel}</span>
        <span className={`flex h-9 w-16 items-center rounded-full p-1 transition-colors ${on ? 'justify-end bg-wood' : 'justify-start bg-bark/30'}`} aria-hidden="true">
          <span className="h-7 w-7 rounded-full bg-cream shadow-pop-sm" />
        </span>
      </button>
    </section>
  );
}
