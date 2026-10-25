import { assetUrl } from '../data/assets/assetRegistry';
import { useAssetStatus } from '../services/assets/useAssetStatus';

// 그림 하나. public/assets/ 에 그림 파일이 있으면 그림을, 없으면 그림 문자(emoji)를 보여준다.
export default function AssetIcon({ path, emoji, size }: { path: string; emoji: string; size: number }) {
  const url = assetUrl(path);
  const status = useAssetStatus(url);
  if (status === 'ok') return <img src={url} alt="" width={size} height={size} className="object-contain" />;
  return (
    <span aria-hidden="true" className="leading-none" style={{ fontSize: size * 0.8 }}>
      {emoji}
    </span>
  );
}
