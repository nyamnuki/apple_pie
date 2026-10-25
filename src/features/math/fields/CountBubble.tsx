import { useI18n } from '../../../i18n';

// 지금까지 센 수를 크게 보여주는 동그라미
export default function CountBubble({ value }: { value: number }) {
  const { t, formatNumber } = useI18n();
  return (
    <div
      role="status"
      aria-label={t('math.a11y.counter', { n: formatNumber(value) })}
      className="flex h-16 min-w-16 items-center justify-center rounded-full bg-apricot px-3 text-4xl font-bold shadow-pop-sm"
    >
      {formatNumber(value)}
    </div>
  );
}
