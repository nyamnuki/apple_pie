import { useState } from 'react';
import { Delete, Check } from 'lucide-react';
import AppShell from '../../components/AppShell';
import ScreenHeader from '../../components/ScreenHeader';
import { useI18n } from '../../i18n';

const NEEDED = 2; // 연속으로 맞혀야 하는 문제 수

// 6~9 곱하기 6~9 (5~7세 아이는 풀기 어려운 문제)
const newQuestion = () => ({ a: 6 + Math.floor(Math.random() * 4), b: 6 + Math.floor(Math.random() * 4) });

// 부모 확인: 곱셈 문제 2개를 연속으로 맞히면 부모 설정이 열린다. 틀려도 벌칙 없이 새 문제.
export default function ParentGate({ onPass, onBack }: { onPass: () => void; onBack: () => void }) {
  const { t, formatNumber } = useI18n();
  const [q, setQ] = useState(newQuestion);
  const [typed, setTyped] = useState('');
  const [streak, setStreak] = useState(0);
  const [wrong, setWrong] = useState(false);

  const submit = () => {
    if (!typed) return;
    if (Number(typed) === q.a * q.b) {
      if (streak + 1 >= NEEDED) return onPass();
      setStreak(streak + 1);
      setWrong(false);
    } else {
      setStreak(0);
      setWrong(true);
    }
    setQ(newQuestion());
    setTyped('');
  };

  // 숫자판 버튼 (가로 화면에서는 높이를 조금 줄인다, 최소 48px)
  const key = 'flex h-16 items-center justify-center rounded-2xl bg-cream text-3xl font-bold shadow-pop-sm active:translate-y-0.5 [@media(max-height:500px)]:h-12';

  return (
    <AppShell>
      <ScreenHeader title={t('parent.gateTitle')} onBack={onBack} />
      {/* 세로 화면: 위에서 아래로 / 높이가 낮은 가로 화면: 왼쪽 문제, 오른쪽 숫자판 */}
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-4 [@media(max-height:500px)]:grid [@media(max-height:500px)]:max-w-2xl [@media(max-height:500px)]:grid-cols-2 [@media(max-height:500px)]:items-start">
        <div className="flex flex-col gap-4">
          <p className="text-lg">{t('parent.gateIntro')}</p>
          <p className="text-base font-semibold text-wood">{t('parent.questionOf', { n: formatNumber(streak + 1), total: formatNumber(NEEDED) })}</p>
          <p className="text-3xl font-bold" aria-live="polite">
            {t('parent.question', { a: formatNumber(q.a), b: formatNumber(q.b) })}
          </p>
          {wrong && <p className="text-lg font-semibold">{t('parent.wrong')}</p>}
        </div>

        <div className="flex flex-col gap-4">
          <output aria-label={t('parent.a11y.answer')} className="flex h-16 items-center justify-center rounded-2xl border-4 border-dashed border-bark/30 text-4xl font-bold tabular-nums">
            {typed || '\u00a0'}
          </output>
          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
              <button key={d} type="button" className={key} onClick={() => setTyped((v) => (v.length < 3 ? v + d : v))}>
                {d}
              </button>
            ))}
            <button type="button" className={key} aria-label={t('parent.a11y.delete')} onClick={() => setTyped((v) => v.slice(0, -1))}>
              <Delete size={30} aria-hidden />
            </button>
            <button type="button" className={key} onClick={() => setTyped((v) => (v.length < 3 ? v + '0' : v))}>
              0
            </button>
            <button type="button" className={`${key} !bg-wood text-cream`} aria-label={t('parent.a11y.submit')} onClick={submit}>
              <Check size={32} strokeWidth={3} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
