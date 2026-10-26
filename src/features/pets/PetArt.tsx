import type { PetId } from './pets';

// 반려 친구 그림 (64×64, 수채화). 발 아래 가운데가 (32, 60).
const L = { stroke: '#6B5444', strokeOpacity: 0.7, strokeWidth: 1.8, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
const Eyes = ({ y = 30, gap = 8 }: { y?: number; gap?: number }) => (
  <g fill="#59483C">
    <circle cx={32 - gap} cy={y} r="2.4" />
    <circle cx={32 + gap} cy={y} r="2.4" />
    <circle cx={32 - gap + 0.8} cy={y - 0.9} r="0.8" fill="#fff" />
    <circle cx={32 + gap + 0.8} cy={y - 0.9} r="0.8" fill="#fff" />
  </g>
);

function Duckling() {
  return (
    <g>
      <ellipse cx="32" cy="60" rx="14" ry="3" fill="#59483C" opacity="0.15" />
      <path d="M20 58 L22 52 M30 58 L30 52 M36 58 L36 52 M44 58 L42 52" stroke="#E9A05A" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="32" cy="44" rx="17" ry="12" fill="#F7DA7A" {...L} />
      <path d="M20 42 C24 38 30 40 32 46" fill="none" stroke="#E8C25A" strokeWidth="2" />
      <circle cx="32" cy="28" r="12" fill="#F7DA7A" {...L} />
      <circle cx="32" cy="28" r="12" fill="url(#wc-ball)" stroke="none" />
      <path d="M30 15 C30 11 33 10 34 13" fill="none" {...L} />
      <Eyes y={27} gap={5} />
      <path d="M27 32 C30 30 34 30 37 32 C34 35 30 35 27 32 Z" fill="#F0A86A" {...L} strokeWidth={1.3} />
      <ellipse cx="23" cy="32" rx="2.6" ry="1.6" fill="#F3C6D2" />
      <ellipse cx="41" cy="32" rx="2.6" ry="1.6" fill="#F3C6D2" />
    </g>
  );
}

function FoxKit() {
  return (
    <g>
      <ellipse cx="32" cy="60" rx="17" ry="3" fill="#59483C" opacity="0.15" />
      {/* 꼬리 */}
      <path d="M44 52 C56 52 60 40 54 34 C52 42 46 44 42 46 Z" fill="#E09A5E" {...L} />
      <path d="M54 34 C56 38 56 42 52 46 C52 42 53 38 54 34 Z" fill="#FFF5DF" />
      <ellipse cx="32" cy="48" rx="13" ry="10" fill="#E09A5E" {...L} />
      <ellipse cx="32" cy="50" rx="7" ry="7" fill="#FFF5DF" />
      {/* 귀 */}
      <path d="M18 24 L18 8 L28 16 Z M46 24 L46 8 L36 16 Z" fill="#E09A5E" {...L} />
      <path d="M20 20 L20 12 L25 16 Z M44 20 L44 12 L39 16 Z" fill="#6B5444" opacity="0.55" />
      <path d="M32 14 C44 14 50 22 48 30 C46 38 38 40 32 40 C26 40 18 38 16 30 C14 22 20 14 32 14 Z" fill="#E09A5E" {...L} />
      <path d="M32 14 C44 14 50 22 48 30 C46 38 38 40 32 40 C26 40 18 38 16 30 C14 22 20 14 32 14 Z" fill="url(#wc-ball)" stroke="none" />
      <path d="M20 30 C24 36 28 38 32 38 C36 38 40 36 44 30 C40 32 36 30 32 34 C28 30 24 32 20 30 Z" fill="#FFF5DF" />
      <Eyes y={27} gap={7} />
      <circle cx="32" cy="34" r="2" fill="#59483C" />
      <ellipse cx="22" cy="32" rx="2.4" ry="1.4" fill="#F3C6D2" />
      <ellipse cx="42" cy="32" rx="2.4" ry="1.4" fill="#F3C6D2" />
    </g>
  );
}

function Owlet() {
  return (
    <g>
      <ellipse cx="32" cy="60" rx="14" ry="3" fill="#59483C" opacity="0.15" />
      <path d="M17 26 L19 12 L26 18 C30 16 34 16 38 18 L45 12 L47 26 C50 38 48 52 32 57 C16 52 14 38 17 26 Z" fill="#C9C0DE" {...L} />
      <path d="M17 26 L19 12 L26 18 C30 16 34 16 38 18 L45 12 L47 26 C50 38 48 52 32 57 C16 52 14 38 17 26 Z" fill="url(#wc-ball)" stroke="none" />
      <ellipse cx="32" cy="45" rx="10" ry="9" fill="#F1E9F7" />
      <path d="M26 43 q3 2 6 0 q3 2 6 0 M27 48 q2.5 2 5 0 q2.5 2 5 0" fill="none" stroke="#B3A8CC" strokeWidth="1.1" />
      <circle cx="25" cy="28" r="7" fill="#FFF5DF" {...L} />
      <circle cx="39" cy="28" r="7" fill="#FFF5DF" {...L} />
      <circle cx="25.5" cy="28" r="3.4" fill="#59483C" />
      <circle cx="39.5" cy="28" r="3.4" fill="#59483C" />
      <circle cx="26.5" cy="26.8" r="1" fill="#fff" />
      <circle cx="40.5" cy="26.8" r="1" fill="#fff" />
      <path d="M30 33 L32 37 L34 33 Z" fill="#F5D0AD" {...L} strokeWidth={1.1} />
      <path d="M22 56 l-2 3 M42 56 l2 3" stroke="#E9A05A" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

function Turtle() {
  return (
    <g>
      <ellipse cx="32" cy="60" rx="20" ry="3" fill="#59483C" opacity="0.15" />
      {/* 발과 머리 */}
      <path d="M16 54 C14 58 20 60 22 56 M42 56 C44 60 50 58 48 54" fill="#B9D1AD" {...L} />
      <path d="M44 44 C50 38 60 40 58 48 C56 54 48 52 44 50 Z" fill="#B9D1AD" {...L} />
      <circle cx="53" cy="45" r="1.8" fill="#59483C" />
      <path d="M52 49 C54 50 56 49 57 48" fill="none" stroke="#59483C" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="55" cy="49" rx="1.8" ry="1" fill="#F3C6D2" />
      {/* 등딱지: 둥근 지붕과 육각 무늬 */}
      <path d="M10 52 C10 30 22 22 32 22 C42 22 52 30 50 52 Z" fill="#8FB58A" {...L} />
      <path d="M10 52 C10 30 22 22 32 22 C42 22 52 30 50 52 Z" fill="url(#wc-ball)" stroke="none" />
      <path d="M24 34 L30 30 L36 34 L36 41 L30 45 L24 41 Z" fill="#B9D1AD" {...L} strokeWidth={1.3} />
      <path d="M14 46 L20 42 M40 42 L46 46 M30 45 L30 52 M24 34 L18 30 M36 34 L42 30" fill="none" stroke="#6F9468" strokeWidth="1.3" />
      <path d="M10 52 C20 55 40 55 50 52" fill="none" stroke="#F5D0AD" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

const ART: Record<PetId, () => JSX.Element> = { duckling: Duckling, foxKit: FoxKit, owlet: Owlet, turtle: Turtle };

export default function PetArt({ id }: { id: PetId }) {
  const Art = ART[id];
  return (
    <g filter="url(#wc-small)">
      <Art />
    </g>
  );
}
