import { BarChart3 } from '../../components/icons';
import { useGame } from '../../app/GameProvider';
import { useI18n } from '../../i18n';
import { dateKey } from '../../utils/dates';

// 최근 7일(오늘 포함) 날짜와 그날 끝낸 놀이 수
export function lastWeek(playDays: Record<string, number>, today: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + i);
    return { date: d, n: playDays[dateKey(d)] ?? 0 };
  });
}

// 어른 설정 '이번 주 놀이': 하루 하나씩 막대 7개 (한 가지 색, 막대 위에 수, 아래에 요일).
// 막대마다 '요일: 몇 개' 이름이 있어 화면 읽기 프로그램은 목록으로 읽는다.
export default function WeekChart({ className }: { className: string }) {
  const { t, locale, formatNumber } = useI18n();
  const { game } = useGame();
  const days = lastWeek(game.playDays, new Date());
  const max = Math.max(3, ...days.map((d) => d.n)); // 하루 1~2개여도 막대가 꽉 차 보이지 않게
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const total = days.reduce((sum, d) => sum + d.n, 0);

  return (
    <section aria-labelledby="week-h" className={className}>
      <h2 id="week-h" className="mb-2 flex items-center gap-2 text-2xl font-bold">
        <BarChart3 size={28} aria-hidden />
        {t('parent.weekTitle')}
      </h2>
      <p className="mb-3 text-lg">{t('parent.weekTotal', { n: formatNumber(total) })}</p>
      <ol className="flex h-40 items-end gap-2 border-b-2 border-bark/20 pb-0">
        {days.map(({ date, n }, i) => {
          const day = i === 6 ? t('parent.today') : weekday.format(date);
          return (
            <li key={dateKey(date)} aria-label={t('parent.weekDay', { day, n: formatNumber(n) })} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span aria-hidden="true" className="text-base font-bold tabular-nums">
                {n > 0 ? formatNumber(n) : ''}
              </span>
              <span aria-hidden="true" data-count={n} className="w-full max-w-10 rounded-t bg-sage" style={{ height: `${(n / max) * 82}%`, minHeight: n > 0 ? 4 : 0 }} />
            </li>
          );
        })}
      </ol>
      <div aria-hidden="true" className="mt-1 flex gap-2">
        {days.map(({ date }, i) => (
          <span key={dateKey(date)} className={`flex-1 text-center text-sm ${i === 6 ? 'font-bold' : ''}`}>
            {i === 6 ? t('parent.today') : weekday.format(date)}
          </span>
        ))}
      </div>
    </section>
  );
}
