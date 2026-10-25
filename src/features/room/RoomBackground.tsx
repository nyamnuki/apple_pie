import { GRID, WALL_H, VIEW_W, VIEW_H, toScreen, toPoints, lift } from './iso';
import { assetUrl, BACKGROUNDS } from '../../data/assets/assetRegistry';
import { getFurniture } from '../../data/furniture/furniture';
import { useAssetStatus } from '../../services/assets/useAssetStatus';

const top = toScreen(0, 0);
const leftCorner = toScreen(0, GRID);
const rightCorner = toScreen(GRID, 0);
const front = toScreen(GRID, GRID);
const LEFT_WALL = [top, leftCorner, lift(leftCorner, WALL_H), lift(top, WALL_H)];
const RIGHT_WALL = [top, rightCorner, lift(rightCorner, WALL_H), lift(top, WALL_H)];
const FLOOR = [top, rightCorner, front, leftCorner];
const SLAB = 16;

export default function RoomBackground({ wallpaperId }: { wallpaperId: string | null }) {
  const baseUrl = assetUrl(BACKGROUNDS.roomBase);
  const baseStatus = useAssetStatus(baseUrl);
  const wallpaper = wallpaperId ? getFurniture(wallpaperId) : undefined;
  const wallpaperUrl = wallpaper ? assetUrl(wallpaper.assetPath) : null;
  const wallpaperStatus = useAssetStatus(wallpaperUrl);
  const wallFill = wallpaper
    ? wallpaperStatus === 'ok' ? 'url(#wallpaper-image)' : 'url(#wallpaper-leaf)'
    : null;

  const window = [
    lift(toScreen(2.2, 0), 175),
    lift(toScreen(3.8, 0), 175),
    lift(toScreen(3.8, 0), 85),
    lift(toScreen(2.2, 0), 85),
  ];

  return (
    <g>
      <defs>
        <linearGradient id="storybook-wall-left" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF9EA" />
          <stop offset="100%" stopColor="#F0E1C6" />
        </linearGradient>
        <linearGradient id="storybook-wall-right" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F3E5CC" />
          <stop offset="100%" stopColor="#E1CBA8" />
        </linearGradient>
        <linearGradient id="storybook-floor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4DDB8" />
          <stop offset="100%" stopColor="#D9B184" />
        </linearGradient>
        <linearGradient id="storybook-window-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B7DCE7" />
          <stop offset="65%" stopColor="#E1EBCF" />
          <stop offset="100%" stopColor="#9BBE8B" />
        </linearGradient>
        {wallpaperUrl && (
          <pattern id="wallpaper-image" patternUnits="userSpaceOnUse" width="120" height="120">
            <image href={wallpaperUrl} width="120" height="120" />
          </pattern>
        )}
        <pattern id="wallpaper-leaf" patternUnits="userSpaceOnUse" width="66" height="66">
          <rect width="66" height="66" fill="#DCE8D0" />
          <path d="M8 31 Q15 8 29 20 Q24 34 8 31Z" fill="#A8C3A0" />
          <path d="M39 57 Q37 39 55 36 Q58 50 39 57Z" fill="#B9D1AD" />
          <circle cx="48" cy="12" r="2.5" fill="#F3C6D2" />
          <circle cx="29" cy="43" r="2" fill="#FFF5DF" />
        </pattern>
        <clipPath id="storybook-window-clip">
          <polygon points={toPoints(window)} />
        </clipPath>
      </defs>

      {baseStatus === 'ok' ? (
        <image href={baseUrl} width={VIEW_W} height={VIEW_H} />
      ) : (
        <>
          {/* Warm wooden edge around the miniature room */}
          <polygon points={toPoints([leftCorner, front, lift(front, -SLAB), lift(leftCorner, -SLAB)])} fill="#B9855A" />
          <polygon points={toPoints([front, rightCorner, lift(rightCorner, -SLAB), lift(front, -SLAB)])} fill="#95633F" />
          <polygon points={toPoints(LEFT_WALL)} fill="url(#storybook-wall-left)" />
          <polygon points={toPoints(RIGHT_WALL)} fill="url(#storybook-wall-right)" />

          {/* Window looking into a layered, leafy forest */}
          <g clipPath="url(#storybook-window-clip)">
            <polygon points={toPoints(window)} fill="url(#storybook-window-sky)" />
            <circle cx={lift(toScreen(3.43, 0), 140).x} cy={lift(toScreen(3.43, 0), 140).y} r="13" fill="#FFF0B8" />
            <path
              d={`M ${toScreen(2.05, 0).x} ${toScreen(2.05, 0).y - 106}
                  q 17 -28 34 -4 q 17 -28 37 -5 q 20 -26 42 -1 q 18 -18 37 2
                  L ${toScreen(3.95, 0).x} ${toScreen(3.95, 0).y - 70}
                  L ${toScreen(2.05, 0).x} ${toScreen(2.05, 0).y - 70} Z`}
              fill="#7FA779"
            />
            <path
              d={`M ${toScreen(2.05, 0).x} ${toScreen(2.05, 0).y - 91}
                  q 20 -25 39 -3 q 17 -25 37 -2 q 22 -23 43 0
                  L ${toScreen(3.95, 0).x} ${toScreen(3.95, 0).y - 61}
                  L ${toScreen(2.05, 0).x} ${toScreen(2.05, 0).y - 61} Z`}
              fill="#A7C69A"
            />
            <path
              d={`M ${toScreen(2.05, 0).x} ${toScreen(2.05, 0).y - 77}
                  q 20 -17 38 0 q 19 -18 38 -1 q 19 -17 40 0
                  L ${toScreen(3.95, 0).x} ${toScreen(3.95, 0).y - 54}
                  L ${toScreen(2.05, 0).x} ${toScreen(2.05, 0).y - 54} Z`}
              fill="#D0DFB9"
            />
          </g>
          <polygon points={toPoints(window)} fill="none" stroke="#B9855A" strokeWidth="10" strokeLinejoin="round" />
          <path
            d={`M ${lift(toScreen(3, 0), 171).x} ${lift(toScreen(3, 0), 171).y}
                L ${lift(toScreen(3, 0), 89).x} ${lift(toScreen(3, 0), 89).y}`}
            stroke="#B9855A" strokeWidth="5" strokeLinecap="round"
          />
          <path
            d={`M ${lift(toScreen(2.25, 0), 130).x} ${lift(toScreen(2.25, 0), 130).y}
                L ${lift(toScreen(3.75, 0), 130).x} ${lift(toScreen(3.75, 0), 130).y}`}
            stroke="#B9855A" strokeWidth="4" strokeLinecap="round"
          />

          {/* An irregular leafy garland, like a detail painted into a picture book */}
          <path
            d={`M ${top.x + 14} ${top.y - 18} Q ${top.x + 40} ${top.y - 53} ${top.x + 69} ${top.y - 42}
                T ${top.x + 115} ${top.y - 73}`}
            fill="none" stroke="#789B70" strokeWidth="3" strokeLinecap="round"
          />
          <g fill="#A8C3A0" stroke="#789B70" strokeWidth="1.2">
            <ellipse cx={top.x + 29} cy={top.y - 47} rx="10" ry="5" transform={`rotate(28 ${top.x + 29} ${top.y - 47})`} />
            <ellipse cx={top.x + 52} cy={top.y - 48} rx="10" ry="5" transform={`rotate(-28 ${top.x + 52} ${top.y - 48})`} />
            <ellipse cx={top.x + 77} cy={top.y - 54} rx="10" ry="5" transform={`rotate(25 ${top.x + 77} ${top.y - 54})`} />
            <ellipse cx={top.x + 101} cy={top.y - 67} rx="9" ry="4.5" transform={`rotate(-28 ${top.x + 101} ${top.y - 67})`} />
          </g>
          <g fill="#F3C6D2">
            <circle cx={top.x + 122} cy={top.y - 72} r="3.5" />
            <circle cx={top.x + 128} cy={top.y - 78} r="3" />
            <circle cx={top.x + 116} cy={top.y - 79} r="3" />
            <circle cx={top.x + 122} cy={top.y - 84} r="3" />
            <circle cx={top.x + 122} cy={top.y - 78} r="2" fill="#E7A9BA" />
          </g>

          {/* Floor boards use warm seams rather than a cold, uniform tile grid */}
          <polygon points={toPoints(FLOOR)} fill="url(#storybook-floor)" />
          {Array.from({ length: GRID - 1 }, (_, i) => {
            const a = toScreen(i + 1, 0);
            const b = toScreen(i + 1, GRID);
            return <path key={`board-${i}`} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke="#A8744A" strokeOpacity=".24" strokeWidth="2" fill="none" />;
          })}
          {Array.from({ length: GRID - 1 }, (_, i) => {
            const a = toScreen(0, i + 1);
            const b = toScreen(GRID, i + 1);
            return <path key={`seam-${i}`} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke="#FFF5DF" strokeOpacity=".38" strokeWidth="2" fill="none" />;
          })}
          <g fill="none" stroke="#A8744A" strokeOpacity=".24" strokeWidth="1.5">
            <ellipse cx={front.x - 65} cy={front.y - 56} rx="10" ry="3.5" transform={`rotate(-28 ${front.x - 65} ${front.y - 56})`} />
            <ellipse cx={front.x + 35} cy={front.y - 105} rx="8" ry="3" transform={`rotate(25 ${front.x + 35} ${front.y - 105})`} />
          </g>
        </>
      )}

      {wallFill && (
        <g>
          <polygon points={toPoints(LEFT_WALL)} fill={wallFill} />
          <polygon points={toPoints(RIGHT_WALL)} fill={wallFill} fillOpacity=".9" />
          <polygon points={toPoints(RIGHT_WALL)} fill="#59483C" fillOpacity=".06" />
        </g>
      )}

      <polygon points={toPoints([top, leftCorner, lift(leftCorner, 14), lift(top, 14)])} fill="#C59669" stroke="#A8744A" strokeWidth="1.5" />
      <polygon points={toPoints([top, rightCorner, lift(rightCorner, 14), lift(top, 14)])} fill="#A8744A" stroke="#8F613C" strokeWidth="1.5" />
    </g>
  );
}
