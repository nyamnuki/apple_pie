import type { OutfitId } from './outfits';

// 루루 옷 그림. 루루 그림(src/components/characters/LuluSvg.tsx)과 같은 좌표(가로 120 × 세로 150)에 그린다.
// 모자는 머리 위(귀 사이), 스카프는 목(망토 깃 위). 옷장 버튼의 작은 그림은 VIEWBOX 로 그 부분만 잘라 보여 준다.
const LINE = { stroke: '#6B5444', strokeWidth: 2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export const OUTFIT_VIEWBOX: Record<OutfitId, string> = {
  acornCap: '30 14 60 44',
  flowerCrown: '28 24 64 30',
  moonHat: '30 -4 64 60',
  berryScarf: '30 92 62 40',
  starScarf: '30 92 62 40',
};

function Scarf({ main, stripe, dots }: { main: string; stripe: string; dots?: boolean }) {
  return (
    <g {...LINE}>
      {/* 목에 두른 부분 */}
      <path d="M36 100 C46 110 74 110 84 100 C86 104 86 108 84 111 C72 118 48 118 36 111 C34 108 34 104 36 100 Z" fill={main} />
      {/* 늘어진 끝 */}
      <path d="M70 110 C72 118 72 124 70 130 L80 128 C81 122 80 116 77 110 Z" fill={main} />
      <path d="M70.6 124 L79.6 122.4" fill="none" stroke={stripe} strokeWidth="3" />
      <path d="M44 106 C52 111 68 111 76 106" fill="none" stroke={stripe} strokeWidth="2.6" />
      {dots &&
        [
          [44, 110],
          [56, 113],
          [68, 112],
          [75, 120],
        ].map(([x, y]) => <path key={`${x}-${y}`} d={`M${x} ${y - 3} l1 2 l2.2 .3 l-1.6 1.5 l.4 2.2 l-2 -1 l-2 1 l.4 -2.2 l-1.6 -1.5 l2.2 -.3 z`} fill="#FFF0B8" strokeWidth="0.8" />)}
    </g>
  );
}

export default function OutfitArt({ id }: { id: OutfitId }) {
  switch (id) {
    case 'acornCap':
      // 도토리 깍정이 모자: 머리 위에 살짝 기울여 얹고 꼭지가 위로
      return (
        <g {...LINE} transform="rotate(-8 60 40)">
          <path d="M36 44 C36 26 84 26 84 44 C76 48 44 48 36 44 Z" fill="#B88353" />
          <path d="M40 40 C50 36 70 36 80 40 M42 34 C52 31 68 31 78 34" fill="none" stroke="#8E6339" strokeWidth="1.4" />
          <path d="M59 28 C58 23 60 19 64 17" fill="none" strokeWidth="3" />
        </g>
      );
    case 'flowerCrown':
      // 꽃 화관: 머리 둘레에 작은 꽃 다섯 송이와 잎
      return (
        <g {...LINE} strokeWidth={1.4}>
          <path d="M32 46 C44 36 76 36 88 46" fill="none" stroke="#89AE83" strokeWidth="3" />
          {[
            [34, 45, '#F3C6D2'],
            [46, 39, '#FFF0B8'],
            [60, 37, '#C9D8F0'],
            [74, 39, '#F3C6D2'],
            [86, 45, '#FFF0B8'],
          ].map(([x, y, c]) => (
            <g key={`${x}`} transform={`translate(${x} ${y})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx="0" cy="-3.2" rx="2.6" ry="3.4" fill={c as string} transform={`rotate(${a})`} />
              ))}
              <circle r="1.8" fill="#F5D0AD" />
            </g>
          ))}
        </g>
      );
    case 'moonHat':
      // 밤하늘 고깔모자: 끝이 살짝 휘고 노란 달과 별
      return (
        <g {...LINE}>
          <path d="M40 46 C48 30 56 14 70 2 C70 12 72 24 82 46 C70 50 52 50 40 46 Z" fill="#7C8CC4" />
          <path d="M38 46 C52 52 70 52 84 46 C86 49 84 52 82 53 C68 57 52 57 40 53 C37 52 36 49 38 46 Z" fill="#C9D8F0" />
          <path d="M62 30 C57 28 56 21 61 18 C59 23 61 28 66 29 C65 30 64 30 62 30 Z" fill="#FFF0B8" strokeWidth="1.2" />
          <path d="M70 38 l1 2.2 l2.4 .3 l-1.8 1.6 l.5 2.4 l-2.1 -1.2 l-2.1 1.2 l.5 -2.4 l-1.8 -1.6 l2.4 -.3 z" fill="#FFF0B8" strokeWidth="1" />
          <circle cx="70" cy="2" r="3.4" fill="#FFF0B8" strokeWidth="1.4" />
        </g>
      );
    case 'berryScarf':
      return <Scarf main="#E58E8E" stripe="#FFF6E6" />;
    case 'starScarf':
      return <Scarf main="#8FA6D8" stripe="#C9D8F0" dots />;
  }
}
