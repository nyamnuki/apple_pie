import { assetUrl } from '../data/assets/assetRegistry';
import { useAssetStatus } from '../services/assets/useAssetStatus';
import type { FurnitureDef } from '../types/furniture';

// 목록에 쓰는 작은 가구 그림. 그림 파일이 없으면 색 상자 + 그림 문자로 대신한다.
export default function AssetThumb({ def, size = 64 }: { def: FurnitureDef; size?: number }) {
  const url = assetUrl(def.assetPath);
  const status = useAssetStatus(url);
  if (status === 'ok') return <img src={url} alt="" width={size} height={size} className="object-contain" />;
  return (
    <span
      aria-hidden="true"
      className="flex items-center justify-center rounded-2xl"
      style={{ width: size, height: size, background: def.placeholder.color, fontSize: size * 0.55 }}
    >
      {def.placeholder.emoji}
    </span>
  );
}
