import { assetUrl } from '../data/assets/assetRegistry';
import { useAssetStatus } from '../services/assets/useAssetStatus';
import { ITEM_ART, ItemArt } from './art/itemArt';

// 그림 하나. 순서: public/assets/ 의 그림 파일 → 코드로 그린 수채화 그림 → 그림 문자(emoji)
export default function AssetIcon({ path, emoji, size }: { path: string; emoji: string; size: number }) {
  const url = assetUrl(path);
  const status = useAssetStatus(url);
  if (status === 'ok') return <img src={url} alt="" width={size} height={size} className="object-contain" />;
  if (ITEM_ART[path]) return <ItemArt path={path} size={size} />;
  return (
    <span aria-hidden="true" className="leading-none" style={{ fontSize: size * 0.8 }}>
      {emoji}
    </span>
  );
}
