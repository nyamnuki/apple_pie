// 마을 완성 리본 (둥근 꽃 모양 메달과 꼬리 두 개). 색만으로 알리지 않도록 가운데에 별.
export default function Rosette({ size = 40 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 48" width={size} height={size * 1.2} aria-hidden="true" className="overflow-visible">
      <g stroke="#6B5444" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M13 26 L8 46 L14 42 L18 47 L20 28 Z" fill="#E58E8E" />
        <path d="M27 26 L32 46 L26 42 L22 47 L20 28 Z" fill="#E58E8E" />
        {Array.from({ length: 10 }, (_, i) => (
          <circle key={i} cx={20 + Math.cos((i / 10) * Math.PI * 2) * 13} cy={18 + Math.sin((i / 10) * Math.PI * 2) * 13} r="5" fill="#F5D0AD" />
        ))}
        <circle cx="20" cy="18" r="12" fill="#F5D0AD" />
        <circle cx="20" cy="18" r="8.5" fill="#FFF0B8" />
        <path d="M20 12 l1.8 3.8 l4.1 .5 l-3 2.8 l.8 4.1 l-3.7 -2 l-3.7 2 l.8 -4.1 l-3 -2.8 l4.1 -.5 z" fill="#E7B24C" strokeWidth="1.1" />
      </g>
    </svg>
  );
}
