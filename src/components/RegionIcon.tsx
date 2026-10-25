import AssetIcon from './AssetIcon';
import { getRegion } from '../data/regions/regions';
import type { RegionId } from '../types/resources';

// 마을 상징 그림 (도토리·달·보석). 글자 옆에 쓸 때는 inline 으로.
export default function RegionIcon({ id, size, inline = false }: { id: RegionId; size: number; inline?: boolean }) {
  const r = getRegion(id);
  return (
    <span aria-hidden="true" className={inline ? 'inline-flex align-[-0.2em]' : 'inline-flex'}>
      <AssetIcon path={r.art} emoji={r.emoji} size={size} />
    </span>
  );
}
