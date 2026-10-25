import AssetIcon from './AssetIcon';
import { getResource } from '../data/resources/resources';
import { useI18n } from '../i18n';
import type { ResourceId } from '../types/resources';

interface Props {
  id: ResourceId;
  amount: number; // 가진 수 (또는 받은 수)
  need?: number; // 주면 '가진 수 / 필요한 수' 로 보여준다
  prefix?: string; // 예: '+' (받은 보상)
  size?: 'md' | 'lg';
}

// 재료 아이콘 + 숫자. 모자라면 점선 테두리와 흐린 글자로 표시한다 (색만으로 구분하지 않음).
export default function ResourceChip({ id, amount, need, prefix = '', size = 'md' }: Props) {
  const { t, tKey, formatNumber } = useI18n();
  const def = getResource(id);
  const lacking = need !== undefined && amount < need;
  const name = tKey(def.nameKey);
  const label =
    need !== undefined
      ? t('inventory.a11y.haveNeed', { name, have: formatNumber(amount), need: formatNumber(need) })
      : `${name} ${prefix}${formatNumber(amount)}`;
  const big = size === 'lg';
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-flex items-center gap-1.5 rounded-full border-2 ${lacking ? 'border-dashed border-bark/40' : 'border-transparent'} ${big ? 'px-3 py-1.5' : 'px-2 py-0.5'}`}
      style={{ background: `${def.placeholder.color}99` }}
    >
      <span className="relative inline-flex">
        <AssetIcon path={def.assetPath} emoji={def.placeholder.emoji} size={big ? 40 : 26} />
        {/* 드문 재료 표시: 반짝이 (색만으로 구분하지 않도록) */}
        {def.rare && (
          <span aria-hidden="true" className={`absolute -right-1.5 -top-1.5 ${big ? 'text-lg' : 'text-xs'}`}>
            ✨
          </span>
        )}
      </span>
      <span className={`font-bold tabular-nums ${big ? 'text-2xl' : 'text-lg'} ${lacking ? 'text-bark/85' : ''}`}>
        {prefix}
        {formatNumber(amount)}
        {need !== undefined && <span className="text-bark/85"> / {formatNumber(need)}</span>}
      </span>
    </span>
  );
}
