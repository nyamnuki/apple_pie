import { memo } from 'react';
import type { TimeOfDay } from './timeOfDay';
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

// 방의 바닥과 벽 (수채화 동화책 스타일). 배경 그림(room-base.png)이 있으면 그 그림을, 없으면 아래 그림을 그린다.
// 그리는 순서: 바닥·벽 → 벽지 → 창문·덩굴·가랜드·걸레받이 (벽지를 붙여도 창문이 또렷하게 보이도록)

// 창밖 하늘 색 (위 → 아래)
const SKY: Record<TimeOfDay, [string, string, string]> = {
  day: ['#B7DCE7', '#E1EBCF', '#9BBE8B'],
  evening: ['#F2B48F', '#F3C6D2', '#B9A6C9'],
  night: ['#3F4A78', '#5E5D92', '#3E5A55'],
};

export default memo(function RoomBackground({ wallpaperId, time = 'day' }: { wallpaperId: string | null; time?: TimeOfDay }) {
  const baseUrl = assetUrl(BACKGROUNDS.roomBase);
  const baseStatus = useAssetStatus(baseUrl);
  const wallpaper = wallpaperId ? getFurniture(wallpaperId) : undefined;
  const wallpaperUrl = wallpaper ? assetUrl(wallpaper.assetPath) : null;
  const wallpaperStatus = useAssetStatus(wallpaperUrl);
  const wallFill = wallpaper
    ? wallpaperStatus === 'ok' ? 'url(#wallpaper-image)' : 'url(#wallpaper-leaf)'
    : null;

  const WINDOW = [
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
          <stop offset="0%" stopColor={SKY[time][0]} />
          <stop offset="65%" stopColor={SKY[time][1]} />
          <stop offset="100%" stopColor={SKY[time][2]} />
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
        {/* 벽지가 없을 때 크림색 벽에 옅게 그려진 풀잎 무늬 */}
        <pattern id="storybook-sprigs" patternUnits="userSpaceOnUse" width="90" height="90">
          <path d="M20 40 C20 30 22 22 26 16" fill="none" stroke="#A8C3A0" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M22 30 C16 28 14 24 15 21 C19 22 22 25 22 30 Z M24 24 C28 20 32 20 34 21 C32 25 28 26 24 24 Z" fill="#C5D8BB" />
          <circle cx="26" cy="15" r="2.2" fill="#F3C6D2" />
          <path d="M66 82 C66 74 68 68 71 64" fill="none" stroke="#A8C3A0" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M67 74 C62 72 61 69 62 67 C65 68 67 70 67 74 Z" fill="#C5D8BB" />
          <circle cx="70" cy="62" r="1.8" fill="#F5D0AD" />
        </pattern>
        {/* 창문으로 들어온 햇빛 */}
        <linearGradient id="storybook-sun" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF6D8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFF6D8" stopOpacity="0" />
        </linearGradient>
        <clipPath id="storybook-window-clip">
          <polygon points={toPoints(WINDOW)} />
        </clipPath>
      </defs>

      {baseStatus === 'ok' ? (
        <image href={baseUrl} width={VIEW_W} height={VIEW_H} />
      ) : (
        <g filter="url(#wc-room)">
          {/* Warm wooden edge around the miniature room */}
          <polygon points={toPoints([leftCorner, front, lift(front, -SLAB), lift(leftCorner, -SLAB)])} fill="#B9855A" />
          <polygon points={toPoints([front, rightCorner, lift(rightCorner, -SLAB), lift(front, -SLAB)])} fill="#95633F" />
          <polygon points={toPoints(LEFT_WALL)} fill="url(#storybook-wall-left)" />
          <polygon points={toPoints(RIGHT_WALL)} fill="url(#storybook-wall-right)" />

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
            <ellipse cx={toScreen(1.6, 4.3).x} cy={toScreen(1.6, 4.3).y} rx="7" ry="2.6" transform={`rotate(-28 ${toScreen(1.6, 4.3).x} ${toScreen(1.6, 4.3).y})`} />
            <ellipse cx={toScreen(4.4, 1.7).x} cy={toScreen(4.4, 1.7).y} rx="7" ry="2.6" transform={`rotate(25 ${toScreen(4.4, 1.7).x} ${toScreen(4.4, 1.7).y})`} />
          </g>
          {/* 마루 이음새: 판자 끝이 엇갈리게 짧은 선 */}
          <g stroke="#A8744A" strokeOpacity=".22" strokeWidth="2">
            {Array.from({ length: GRID }, (_, row) =>
              [row % 2 === 0 ? 1.5 : 3, row % 2 === 0 ? 4.5 : 0.5].map((col) => {
                const p = toScreen(col, row);
                const q = toScreen(col, row + 1);
                return <path key={`${row}-${col}`} d={`M ${p.x} ${p.y} L ${q.x} ${q.y}`} />;
              }),
            )}
          </g>
          {/* 크림색 벽의 옅은 풀잎 무늬 */}
          {!wallFill && (
            <g opacity="0.55">
              <polygon points={toPoints(LEFT_WALL)} fill="url(#storybook-sprigs)" />
              <polygon points={toPoints(RIGHT_WALL)} fill="url(#storybook-sprigs)" />
            </g>
          )}
          {/* 창문에서 바닥으로 비치는 햇빛 (밤에는 없음) */}
          <polygon opacity={time === 'night' ? 0 : time === 'evening' ? 0.6 : 1} points={toPoints([toScreen(2.2, 0), toScreen(3.8, 0), toScreen(3.2, 2.6), toScreen(1.6, 2.6)])} fill="url(#storybook-sun)" />
        </g>
      )}

      {wallFill && (
        <g filter="url(#wc-room)">
          <polygon points={toPoints(LEFT_WALL)} fill={wallFill} />
          <polygon points={toPoints(RIGHT_WALL)} fill={wallFill} />
          <polygon points={toPoints(RIGHT_WALL)} fill="#59483C" fillOpacity=".06" />
        </g>
      )}

      {baseStatus !== 'ok' && (
        <g filter="url(#wc-room)">
          {/* Window looking into a layered, leafy forest */}
            <g clipPath="url(#storybook-window-clip)">
              <polygon points={toPoints(WINDOW)} fill="url(#storybook-window-sky)" />
              {/* 낮·저녁: 해, 밤: 초승달과 별 */}
              {time === 'night' ? (
                <g data-sky="night">
                  <circle cx={lift(toScreen(3.43, 0), 140).x} cy={lift(toScreen(3.43, 0), 140).y} r="11" fill="#F4D98C" />
                  <circle cx={lift(toScreen(3.43, 0), 140).x + 5} cy={lift(toScreen(3.43, 0), 140).y - 4} r="10" fill={SKY.night[0]} />
                  {[[2.45, 160], [2.8, 150], [3.15, 165], [3.65, 158]].map(([a, z]) => (
                    <circle key={a} cx={lift(toScreen(a, 0), z).x} cy={lift(toScreen(a, 0), z).y} r="1.8" fill="#FFF5DF" />
                  ))}
                </g>
              ) : (
                <circle data-sky={time} cx={lift(toScreen(3.43, 0), time === 'evening' ? 118 : 140).x} cy={lift(toScreen(3.43, 0), time === 'evening' ? 118 : 140).y} r={time === 'evening' ? 15 : 13} fill={time === 'evening' ? '#F5A97A' : '#FFF0B8'} />
              )}
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
            <polygon points={toPoints(WINDOW)} fill="none" stroke="#B9855A" strokeWidth="10" strokeLinejoin="round" />
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

            {/* 왼쪽 벽 밑의 작은 버섯과 풀 (바닥 가장자리, 가구에 가려져도 괜찮은 자리) */}
            {(() => {
              const p = toScreen(0, 5.3);
              return (
                <g stroke="#6B5444" strokeOpacity=".55" strokeWidth="1.5" strokeLinejoin="round">
                  <path d={`M ${p.x + 4} ${p.y - 8} q -6 -14 -2 -24 M ${p.x + 8} ${p.y - 8} q 2 -14 10 -20 M ${p.x + 12} ${p.y - 6} q 8 -8 16 -8`} fill="none" stroke="#7FA077" strokeOpacity="1" strokeWidth="2" />
                  <rect x={p.x + 14} y={p.y - 20} width="7" height="12" rx="3" fill="#FBF1DF" />
                  <path d={`M ${p.x + 8} ${p.y - 18} q 9 -14 19 0 z`} fill="#E0796B" />
                  <circle cx={p.x + 15} cy={p.y - 22} r="1.6" fill="#FFF5DF" stroke="none" />
                  <rect x={p.x + 27} y={p.y - 13} width="5" height="8" rx="2" fill="#FBF1DF" />
                  <path d={`M ${p.x + 23} ${p.y - 12} q 6 -10 13 0 z`} fill="#E9A08C" />
                </g>
              );
            })()}
        </g>
      )}

      <polygon points={toPoints([top, leftCorner, lift(leftCorner, 14), lift(top, 14)])} fill="#C59669" stroke="#A8744A" strokeWidth="1.5" />
      <polygon points={toPoints([top, rightCorner, lift(rightCorner, 14), lift(top, 14)])} fill="#A8744A" stroke="#8F613C" strokeWidth="1.5" />
    </g>
  );
});
