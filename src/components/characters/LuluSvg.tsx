import Face from './Face';
import type { Expression } from '../../data/characters/characters';
import OutfitArt from '../../features/outfits/OutfitArt';
import { useOutfit } from '../../features/outfits/OutfitContext';

// 루루: 크림색 토끼. 한쪽 귀가 살짝 접혀 있고(알아보기 쉬운 모양), 잎사귀 망토와 귀에 꽂은 분홍 꽃이 상징.
// 수채화 효과(#wc-small)와 둥근 빛(#wc-ball)은 src/components/art/WatercolorDefs.tsx
const C = {
  fur: '#FFF6E6',
  furShade: '#F1E2CB',
  line: '#6B5444',
  pink: '#F3C6D2',
  innerEar: '#F2B9C8',
  leaf: '#A8C3A0',
  leafDark: '#89AE83',
  vein: '#6F9468',
  center: '#F5D0AD',
};

export default function LuluSvg({ expression }: { expression: Expression }) {
  const outfit = useOutfit(); // 옷장에서 고른 모자·스카프
  return (
    <svg viewBox="0 0 120 150" className="h-full w-full overflow-visible" aria-hidden="true">
      <g filter="url(#wc-small)">
        <g stroke={C.line} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
          {/* 잎사귀 망토 (몸 뒤): 잎 세 장이 겹친 모양 */}
          <path d="M60 92 C34 94 22 118 26 142 C40 136 50 140 60 146 C70 140 80 136 94 142 C98 118 86 94 60 92 Z" fill={C.leaf} />
          <path d="M60 94 C74 100 88 116 94 142 C84 136 74 138 66 142 Z" fill={C.leafDark} stroke="none" opacity="0.55" />
          <path d="M60 98 L60 140 M60 110 L44 124 M60 110 L76 124 M60 124 L48 134 M60 124 L72 134" fill="none" stroke={C.vein} strokeWidth="1.4" />
          {/* 귀: 왼쪽은 곧게, 오른쪽은 끝이 살짝 접힘 */}
          <path d="M36 52 C28 34 30 8 42 4 C52 2 54 28 52 50 Z" fill={C.fur} />
          <path d="M40 46 C36 32 37 14 43 10 C48 10 48 30 47 46 Z" fill={C.innerEar} stroke="none" />
          <path d="M68 50 C68 30 72 10 84 8 C92 8 94 18 90 26 C96 28 98 34 94 38 C88 44 80 48 76 54 Z" fill={C.fur} />
          <path d="M73 46 C74 32 77 16 84 13 C88 14 88 22 85 30 C80 36 77 42 75 47 Z" fill={C.innerEar} stroke="none" />
          {/* 몸 */}
          <ellipse cx="60" cy="122" rx="24" ry="22" fill={C.fur} />
          <ellipse cx="60" cy="122" rx="24" ry="22" fill="url(#wc-ball)" stroke="none" />
          <ellipse cx="60" cy="128" rx="13" ry="12" fill="#FFFDF7" stroke="none" />
          {/* 머리 */}
          <circle cx="60" cy="72" r="34" fill={C.fur} />
          <circle cx="60" cy="72" r="34" fill="url(#wc-ball)" stroke="none" />
          {/* 볼 아래 털 (색연필 몇 획) */}
          <path d="M30 84 l-6 2 M30 89 l-5 4 M90 84 l6 2 M90 89 l5 4" fill="none" strokeWidth="1.2" opacity="0.7" />
          {/* 망토 깃: 잎사귀 두 장 + 도토리 단추 */}
          <path d="M60 104 C51 99 42 101 38 108 C47 113 56 111 60 104 Z" fill={C.leaf} />
          <path d="M60 104 C69 99 78 101 82 108 C73 113 64 111 60 104 Z" fill={C.leaf} />
          <circle cx="60" cy="106" r="3.6" fill="#C79461" strokeWidth="1.4" />
          {outfit.scarf && <OutfitArt id={outfit.scarf} />}
          {outfit.hat && <OutfitArt id={outfit.hat} />}
          {/* 귀에 꽂은 분홍 꽃 (상징) */}
          <g transform="translate(86 20)">
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-6" rx="4.6" ry="6.4" fill={C.pink} strokeWidth="1.3" transform={`rotate(${a})`} />
            ))}
            <circle r="3.6" fill={C.center} strokeWidth="1.3" />
            <path d="M-6 6 C-10 10 -14 10 -16 9 C-14 5 -10 4 -6 6 Z" fill={C.leaf} strokeWidth="1.2" />
          </g>
          {/* 손 */}
          {expression === 'cheer' ? (
            <>
              <ellipse cx="94" cy="98" rx="7" ry="8" fill={C.fur} />
              <path d="M104 82 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 z" fill="#FFF0B8" strokeWidth="1.3" />
              <ellipse cx="39" cy="118" rx="6" ry="5" fill={C.fur} />
            </>
          ) : expression === 'thinking' ? (
            <ellipse cx="72" cy="100" rx="7" ry="6" fill={C.fur} />
          ) : (
            <>
              <ellipse cx="39" cy="118" rx="6" ry="5" fill={C.fur} />
              <ellipse cx="81" cy="118" rx="6" ry="5" fill={C.fur} />
            </>
          )}
          {/* 발 */}
          <ellipse cx="48" cy="143" rx="9" ry="4.5" fill={C.furShade} />
          <ellipse cx="72" cy="143" rx="9" ry="4.5" fill={C.furShade} />
        </g>

        {/* 볼과 코 */}
        <ellipse cx="38" cy="82" rx="7.5" ry="4.8" fill={C.pink} opacity="0.85" />
        <ellipse cx="82" cy="82" rx="7.5" ry="4.8" fill={C.pink} opacity="0.85" />
        <path d="M56.5 77 Q60 75 63.5 77 Q60 81.5 56.5 77 Z" fill="#E79BB0" stroke={C.line} strokeWidth="1" />

        <Face expression={expression} />

        {expression === 'thinking' && (
          <g fill={C.fur} stroke={C.line} strokeWidth="1.6">
            <circle cx="100" cy="52" r="3" />
            <circle cx="106" cy="42" r="4.5" />
            <circle cx="112" cy="29" r="6.5" />
          </g>
        )}
      </g>
    </svg>
  );
}
