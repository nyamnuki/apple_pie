import { GRID, WALL_H, VIEW_W, VIEW_H, toScreen, toPoints, lift } from './iso';
import { assetUrl, BACKGROUNDS } from '../../data/assets/assetRegistry';
import { getFurniture } from '../../data/furniture/furniture';
import { useAssetStatus } from '../../services/assets/useAssetStatus';

// 방의 바닥과 벽. 배경 그림(room-base.png)이 있으면 그 그림을, 없으면 아래 도형으로 그린다.
// 벽지는 벽 위에 무늬로 덧칠한다.

// 벽·바닥의 꼭짓점 (한 번만 계산)
const top = toScreen(0, 0);
const leftCorner = toScreen(0, GRID);
const rightCorner = toScreen(GRID, 0);
const front = toScreen(GRID, GRID);
const LEFT_WALL = [top, leftCorner, lift(leftCorner, WALL_H), lift(top, WALL_H)];
const RIGHT_WALL = [top, rightCorner, lift(rightCorner, WALL_H), lift(top, WALL_H)];
const FLOOR = [top, rightCorner, front, leftCorner];
const SLAB = 16; // 바닥 두께

export default function RoomBackground({ wallpaperId }: { wallpaperId: string | null }) {
  const baseUrl = assetUrl(BACKGROUNDS.roomBase);
  const baseStatus = useAssetStatus(baseUrl);
  const wallpaper = wallpaperId ? getFurniture(wallpaperId) : undefined;
  const wallpaperUrl = wallpaper ? assetUrl(wallpaper.assetPath) : null;
  const wallpaperStatus = useAssetStatus(wallpaperUrl);
  const wallFill = wallpaper ? (wallpaperStatus === 'ok' ? 'url(#wallpaper-image)' : 'url(#wallpaper-leaf)') : null;

  return (
    <g>
      <defs>
        {/* 벽지 그림이 있을 때: 그림을 반복해서 붙인다 */}
        {wallpaperUrl && (
          <pattern id="wallpaper-image" patternUnits="userSpaceOnUse" width="120" height="120">
            <image href={wallpaperUrl} width="120" height="120" />
          </pattern>
        )}
        {/* 벽지 그림이 없을 때: 나뭇잎과 작은 별 무늬로 대신 그린다 */}
        <pattern id="wallpaper-leaf" patternUnits="userSpaceOnUse" width="60" height="60">
          <rect width="60" height="60" fill="#A8C3A0" />
          <ellipse cx="15" cy="18" rx="7" ry="4" fill="#D5E4C8" transform="rotate(-35 15 18)" />
          <ellipse cx="45" cy="45" rx="7" ry="4" fill="#D5E4C8" transform="rotate(35 45 45)" />
          <circle cx="45" cy="14" r="2.5" fill="#FFF5DF" />
          <circle cx="14" cy="46" r="2" fill="#FFF5DF" />
        </pattern>
      </defs>

      {baseStatus === 'ok' ? (
        <image href={baseUrl} width={VIEW_W} height={VIEW_H} />
      ) : (
        <>
          {/* 바닥 두께 (앞쪽 두 모서리) */}
          <polygon points={toPoints([leftCorner, front, lift(front, -SLAB), lift(leftCorner, -SLAB)])} fill="#A8744A" />
          <polygon points={toPoints([front, rightCorner, lift(rightCorner, -SLAB), lift(front, -SLAB)])} fill="#8F613C" />
          {/* 벽: 빛이 왼쪽 위에서 오므로 왼쪽 벽이 더 밝다 */}
          <polygon points={toPoints(LEFT_WALL)} fill="#F7EBD3" />
          <polygon points={toPoints(RIGHT_WALL)} fill="#EEDDC0" />
          {/* 창문 (오른쪽 벽) */}
          <polygon
            points={toPoints([lift(toScreen(2.2, 0), 175), lift(toScreen(3.8, 0), 175), lift(toScreen(3.8, 0), 85), lift(toScreen(2.2, 0), 85)])}
            fill="#C8DFE8"
            stroke="#B9855A"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          {/* 바닥 */}
          <polygon points={toPoints(FLOOR)} fill="#E6C9A0" />
          {/* 바닥 칸 무늬 */}
          {Array.from({ length: GRID - 1 }, (_, i) => i + 1).map((i) => (
            <g key={i} stroke="#59483C" strokeOpacity="0.12" strokeWidth="2">
              <line x1={toScreen(i, 0).x} y1={toScreen(i, 0).y} x2={toScreen(i, GRID).x} y2={toScreen(i, GRID).y} />
              <line x1={toScreen(0, i).x} y1={toScreen(0, i).y} x2={toScreen(GRID, i).x} y2={toScreen(GRID, i).y} />
            </g>
          ))}
        </>
      )}

      {/* 벽지: 벽 위에 덧칠하고, 오른쪽 벽은 살짝 어둡게 해서 조명을 맞춘다 */}
      {wallFill && (
        <g>
          <polygon points={toPoints(LEFT_WALL)} fill={wallFill} />
          <polygon points={toPoints(RIGHT_WALL)} fill={wallFill} />
          <polygon points={toPoints(RIGHT_WALL)} fill="#59483C" fillOpacity="0.08" />
        </g>
      )}

      {/* 걸레받이 (벽 아래 나무 띠) */}
      <polygon points={toPoints([top, leftCorner, lift(leftCorner, 14), lift(top, 14)])} fill="#B9855A" />
      <polygon points={toPoints([top, rightCorner, lift(rightCorner, 14), lift(top, 14)])} fill="#A8744A" />
    </g>
  );
}
