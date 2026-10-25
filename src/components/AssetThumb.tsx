import { useId } from 'react';
import FurniturePlaceholder from '../features/room/placeholders/FurniturePlaceholder';
import WallPlaceholder from '../features/room/placeholders/WallPlaceholder';
import WallpaperPattern from '../features/room/placeholders/WallpaperPattern';
import { WALL_BANDS, footprintCorners } from '../features/room/iso';
import { assetUrl } from '../data/assets/assetRegistry';
import { useAssetStatus } from '../services/assets/useAssetStatus';
import type { FurnitureDef } from '../types/furniture';

// 목록(꾸미기·공방·가방)에 쓰는 작은 가구 그림.
// 그림 파일이 없으면 방에 그려지는 것과 같은 모양(같은 각도·조명)을 작게 그린다.
export default function AssetThumb({ def, size = 64 }: { def: FurnitureDef; size?: number }) {
  const url = assetUrl(def.assetPath);
  const status = useAssetStatus(url);
  const patternId = `thumb-wp-${useId().replace(/:/g, '')}`;
  if (status === 'ok') return <img src={url} alt="" width={size} height={size} className="object-contain" />;

  const frame = 'shrink-0 rounded-2xl';
  const style = { width: size, height: size, background: `${def.placeholder.color}66` };

  if (def.category === 'wallpaper')
    return (
      <svg aria-hidden="true" viewBox="0 0 60 60" className={frame} style={style}>
        <defs>
          <WallpaperPattern id={patternId} />
        </defs>
        <rect x="8" y="8" width="44" height="44" rx="6" fill={`url(#${patternId})`} stroke="#59483C" strokeOpacity="0.35" strokeWidth="2" />
      </svg>
    );

  if (def.category === 'wall') {
    const [z0, z1] = WALL_BANDS[def.wallBand ?? 'middle'];
    const w = def.gridWidth * 100;
    const h = z1 - z0;
    const side = Math.max(w, h) * 1.15; // 정사각형 칸 가운데에
    return (
      <svg aria-hidden="true" viewBox={`${(w - side) / 2} ${(h - side) / 2} ${side} ${side}`} className={frame} style={style}>
        <WallPlaceholder def={def} w={w} h={h} />
      </svg>
    );
  }

  // 바닥 가구: (0,0) 에 놓았을 때의 모습을 가구 크기에 맞춰 자른다
  const c = footprintCorners(0, 0, def.gridWidth, def.gridHeight);
  const w = c.right.x - c.left.x;
  const h = c.bottom.y - c.top.y + def.placeholder.height + 30;
  const side = Math.max(w, h) * 1.08;
  const cx = (c.left.x + c.right.x) / 2;
  const cy = c.bottom.y - h / 2 + 4;
  return (
    <svg aria-hidden="true" viewBox={`${cx - side / 2} ${cy - side / 2} ${side} ${side}`} className={frame} style={style}>
      <FurniturePlaceholder def={def} area={{ gx: 0, gy: 0, w: def.gridWidth, d: def.gridHeight }} />
    </svg>
  );
}
