import OutfitArt from './OutfitArt';
import { useOutfit } from './OutfitContext';
import { assetUrl, outfitPath } from '../../data/assets/assetRegistry';
import { useAssetStatus } from '../../services/assets/useAssetStatus';
import type { OutfitId } from './outfits';

// ===== 루루가 입은 모자·스카프 겹 =====
// 루루 그림 위에 따로 얹는다. 루루가 그림 파일(PNG)이든 코드로 그린 SVG 든
// 같은 120×150 좌표 위에 겹쳐지므로, 둘 다에서 옷이 그대로 보인다.
// (전에는 LuluSvg 안에서 함께 그려서, 루루 PNG 를 넣으면 옷이 사라졌다)

// 옷 한 가지. 그림 파일이 있으면 그 그림, 없으면 코드로 그린 옷.
function Piece({ id }: { id: OutfitId }) {
  const url = assetUrl(outfitPath(id));
  const status = useAssetStatus(url);
  return status === 'ok' ? <image href={url} width="120" height="150" /> : <OutfitArt id={id} />;
}

export default function OutfitLayer() {
  const outfit = useOutfit();
  if (!outfit.hat && !outfit.scarf) return null;
  return (
    <svg viewBox="0 0 120 150" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <g filter="url(#wc-small)">
        {outfit.scarf && <Piece id={outfit.scarf} />}
        {outfit.hat && <Piece id={outfit.hat} />}
      </g>
    </svg>
  );
}
