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
  withName?: boolean; // 그림 아래에 재료 이름을 작게 (그림만으로는 어떤 재료인지 알기 어려운 곳)
}

// 재료 아이콘 + 숫자. 모자라면 점선 테두리와 흐린 글자로 표시한다 (색만으로 구분하지 않음).
export default function ResourceChip({ id, amount, need, prefix = '', size = 'md', withName = false }: Props) {
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
      className={`inline-flex border-2 ${lacking ? 'border-dashed border-bark/40' : 'border-transparent'} ${
        withName ? 'min-w-0 flex-col items-center gap-0.5 rounded-2xl px-2 py-1' : `items-center gap-1.5 rounded-full ${big ? 'px-3 py-1.5' : 'px-2 py-0.5'}`
      }`}
      style={{ background: `${def.placeholder.color}99` }}
    >
      <span className={withName ? 'flex items-center gap-1.5' : 'contents'}>
      <span className="relative inline-flex">
        <AssetIcon path={def.assetPath} emoji={def.placeholder.emoji} size={big ? 40 : 26} />
        {/* 드문 재료 표시: 반짝이 (색만으로 구분하지 않도록) */}
        {def.rare && (
          <svg aria-hidden="true" viewBox="0 0 20 20" className={`absolute -right-1.5 -top-1.5 ${big ? 'h-5 w-5' : 'h-3.5 w-3.5'}`}>
            <path d="M10 1 l2.4 6.2 l6.2 2.4 l-6.2 2.4 l-2.4 6.2 l-2.4 -6.2 l-6.2 -2.4 l6.2 -2.4 z" fill="#FFF0B8" stroke="#946539" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={`font-bold tabular-nums ${big ? 'text-2xl' : 'text-lg'} ${lacking ? 'text-bark/85' : ''}`}>
        {prefix}
        {formatNumber(amount)}
        {need !== undefined && <span className="text-bark/85"> / {formatNumber(need)}</span>}
      </span>
      </span>
      {/* 재료 이름 (그림만으로는 구분하기 어려운 곳에서만 보여 준다) */}
      {withName && <span className="max-w-[7rem] text-center text-xs font-semibold leading-tight text-bark">{name}</span>}
    </span>
  );
}
