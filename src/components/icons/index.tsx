import type { CSSProperties, ReactNode } from 'react';

// ===== 손그림 아이콘 (수채화 동화책 스타일) =====
// 색연필로 그린 듯 살짝 휘어진 선 + 뒤에 옅은 물감 자국. 색은 글자색(currentColor)을 따른다.
// lucide-react 와 같은 이름·같은 사용법(size, strokeWidth, fill, className)으로 바꿔 끼울 수 있게 만들었다.
// 그림 규칙: docs/ART_BIBLE.md

export interface IconProps {
  size?: number;
  strokeWidth?: number;
  fill?: string; // 'currentColor' 이면 안을 칠한다 (재생 버튼 등)
  className?: string;
  style?: CSSProperties;
  'aria-hidden'?: boolean | 'true' | 'false';
}

function make(name: string, draw: (p: { fill: string }) => ReactNode, wash: { cx: number; cy: number; r: number } = { cx: 13, cy: 13, r: 8.5 }) {
  function Icon({ size = 24, strokeWidth = 2.2, fill = 'none', className = '', style, ...rest }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        style={style}
        data-icon={name}
        aria-hidden={rest['aria-hidden'] ?? true}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 물감 자국 (오른쪽 아래로 살짝 비켜서) */}
        <circle cx={wash.cx} cy={wash.cy} r={wash.r} fill="currentColor" opacity="0.12" stroke="none" />
        {draw({ fill })}
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}

export const Check = make('check', () => <path d="M4.5 12.6 C6.6 14.2 8.1 15.9 9.6 18.1 C12.4 12.8 15.6 9.1 19.6 5.8" />);
export const X = make('x', () => <path d="M6 6.2 C9.5 9.6 14 14.2 17.8 18 M17.6 6 C14 9.8 10 13.8 6.2 17.8" />);
export const Plus = make('plus', () => <path d="M12 5 C12.2 9.5 11.8 14.5 12 19 M5 12.2 C9.5 11.8 14.5 12.2 19 11.9" />);
export const ArrowLeft = make('arrow-left', () => <path d="M19 12.2 C14.2 11.8 9.6 12.3 5.5 12 M10.6 6.5 C8.6 8.5 7 10.2 5.2 12 C7 13.8 8.6 15.5 10.7 17.6" />);
export const ArrowRight = make('arrow-right', () => <path d="M5 11.8 C9.8 12.2 14.4 11.7 18.5 12 M13.4 6.4 C15.4 8.4 17 10.2 18.8 12 C17 13.8 15.4 15.6 13.3 17.6" />);
export const ChevronRight = make('chevron-right', () => <path d="M9 5.5 C11.5 8 13.4 10 15.6 12 C13.5 14.2 11.4 16.3 9 18.6" />);
export const Play = make('play', ({ fill }) => <path d="M8 5.6 C8 5 8.6 4.7 9.1 5 L18.4 11.1 C19 11.5 19 12.4 18.4 12.8 L9.1 19 C8.6 19.3 8 19 8 18.4 Z" fill={fill} />);
export const Settings = make('settings', () => (
  <>
    <path d="M12 3.4 L12.1 5.6 M12 18.4 L11.9 20.6 M3.4 12.1 L5.6 12 M18.4 12 L20.6 11.9 M5.9 5.8 L7.5 7.4 M16.5 16.6 L18.1 18.2 M5.8 18.1 L7.4 16.5 M16.6 7.5 L18.2 5.9" />
    <path d="M12 6.2 C15.4 6.1 17.9 8.6 17.8 12 C17.9 15.4 15.3 17.9 12 17.8 C8.6 17.9 6.1 15.3 6.2 12 C6.1 8.7 8.6 6.1 12 6.2 Z" />
    <circle cx="12" cy="12" r="2.3" />
  </>
));
export const Puzzle = make('puzzle', () => (
  <path d="M5 8.5 H9 C8.4 7.2 8.6 5.4 10.4 5.2 C12.3 5 12.6 7.2 11.9 8.5 H15.5 V12 C16.8 11.4 18.8 11.6 18.9 13.4 C19 15.3 16.8 15.6 15.5 14.9 V19 H11.8 C12.4 17.6 12.1 16 10.4 16 C8.7 16 8.4 17.6 9 19 H5 Z" />
));
export const Sofa = make('sofa', () => (
  <>
    <path d="M5.5 11 C5.4 8.4 6.4 7.2 8.4 7.2 H15.6 C17.6 7.2 18.6 8.4 18.5 11" />
    <path d="M3.6 12.6 C3.6 10.8 5.9 10.8 5.9 12.6 V14.2 H18.1 V12.6 C18.1 10.8 20.4 10.8 20.4 12.6 V16.8 C14.8 17 9.2 16.9 3.6 16.8 Z" />
    <path d="M5.4 17 L5.2 19 M18.6 17 L18.8 19" />
  </>
));
export const Hammer = make('hammer', () => (
  <>
    {/* 손잡이 + 비스듬한 망치 머리 */}
    <path d="M5 19.4 C7.8 16.6 10.4 13.9 13.1 11.2" />
    <rect x="9.4" y="4.6" width="10.6" height="5.4" rx="1.6" transform="rotate(45 14.7 7.3)" fill="currentColor" fillOpacity="0.25" />
  </>
));
export const Backpack = make('backpack', () => (
  <>
    <path d="M6.2 10 C6.2 7.2 8.6 5.6 12 5.6 C15.4 5.6 17.8 7.2 17.8 10 V18.4 C17.8 19.4 17.2 20 16.2 20 H7.8 C6.8 20 6.2 19.4 6.2 18.4 Z" />
    <path d="M9.4 5.9 C9.4 3.8 14.6 3.8 14.6 5.9 M8.6 14 H15.4 V17.2 H8.6 Z" />
  </>
));
export const BookHeart = make('book-heart', () => (
  <>
    <path d="M5.4 5.6 C5.4 4.6 6 4 7 4 H18.6 V17.6 H7 C6 17.6 5.4 18.2 5.4 19.1 C5.4 20 6 20.6 7 20.6 H18.6" />
    <path d="M5.4 5.6 V19.1" />
    <path d="M12 14.2 C9.2 12.2 8.6 10.8 9.2 9.6 C9.8 8.6 11.3 8.6 12 9.8 C12.7 8.6 14.2 8.6 14.8 9.6 C15.4 10.8 14.8 12.2 12 14.2 Z" fill="currentColor" fillOpacity="0.35" />
  </>
));
export const BookOpen = make('book-open', () => (
  <path d="M12 7.4 C10 5.8 6.8 5.4 3.6 5.8 V18 C6.8 17.6 10 18 12 19.4 C14 18 17.2 17.6 20.4 18 V5.8 C17.2 5.4 14 5.8 12 7.4 Z M12 7.4 V19.2" />
));
export const Lock = make('lock', () => (
  <>
    <path d="M8.2 10.6 V8.2 C8.2 5.9 9.8 4.4 12 4.4 C14.2 4.4 15.8 5.9 15.8 8.2 V10.6" />
    <path d="M5.8 10.8 C9.9 10.5 14.1 10.5 18.2 10.8 C18.4 13.6 18.4 16.4 18.2 19.2 C14.1 19.5 9.9 19.5 5.8 19.2 C5.6 16.4 5.6 13.6 5.8 10.8 Z" />
    <path d="M12 14 V16" />
  </>
));
export const Volume2 = make('volume', () => (
  <>
    <path d="M4.2 9.6 H7.4 L11.6 6 C11.9 9.9 11.9 14.1 11.6 18 L7.4 14.4 H4.2 Z" />
    <path d="M15 9.2 C16.2 10.8 16.2 13.2 15 14.8 M17.8 6.8 C20.4 9.8 20.4 14.2 17.8 17.2" />
  </>
));
export const VolumeX = make('volume-x', () => (
  <>
    <path d="M4.2 9.6 H7.4 L11.6 6 C11.9 9.9 11.9 14.1 11.6 18 L7.4 14.4 H4.2 Z" />
    <path d="M15.2 9.4 C16.8 11 18.4 12.8 20 14.6 M20 9.4 C18.4 11 16.8 12.8 15.2 14.6" />
  </>
));
export const Music = make('music', () => (
  <>
    <path d="M9.2 17.4 V6.4 C12.6 5.4 15.8 4.8 19 4.6 V15.4" />
    <path d="M9.2 17.4 C9.2 19 8 20 6.6 20 C5.2 20 4.4 19.2 4.4 18.2 C4.4 16.8 5.6 16 7 16 C8 16 8.8 16.4 9.2 17.4 Z M19 15.4 C19 17 17.8 18 16.4 18 C15 18 14.2 17.2 14.2 16.2 C14.2 14.8 15.4 14 16.8 14 C17.8 14 18.6 14.4 19 15.4 Z" fill="currentColor" fillOpacity="0.35" />
  </>
));
export const MessageCircle = make('message', () => (
  <path d="M12 4.4 C16.6 4.3 20 7.4 19.9 11.4 C20 15.4 16.6 18.4 12 18.4 C10.9 18.4 9.9 18.2 9 17.9 L4.6 19.6 L5.8 15.6 C4.7 14.4 4.1 13 4.1 11.4 C4 7.4 7.4 4.3 12 4.4 Z" />
));
export const RotateCw = make('rotate-cw', () => <path d="M18.6 12.4 C18.4 16 15.6 18.8 12 18.8 C8.2 18.8 5.2 15.8 5.2 12 C5.2 8.2 8.2 5.2 12 5.2 C14.4 5.2 16.4 6.3 17.6 8.2 M17.9 4.4 L17.8 8.4 L13.8 8.4" />);
export const RotateCcw = make('rotate-ccw', () => <path d="M5.4 12.4 C5.6 16 8.4 18.8 12 18.8 C15.8 18.8 18.8 15.8 18.8 12 C18.8 8.2 15.8 5.2 12 5.2 C9.6 5.2 7.6 6.3 6.4 8.2 M6.1 4.4 L6.2 8.4 L10.2 8.4" />);
export const ZoomIn = make('zoom-in', () => (
  <path d="M10.6 4.6 C14 4.5 16.6 7.2 16.5 10.6 C16.6 14 14 16.6 10.6 16.5 C7.2 16.6 4.5 14 4.6 10.6 C4.5 7.2 7.2 4.5 10.6 4.6 Z M15 15 C16.6 16.6 18.2 18.2 19.8 19.8 M10.6 8 V13.2 M8 10.6 H13.2" />
));
export const ZoomOut = make('zoom-out', () => (
  <path d="M10.6 4.6 C14 4.5 16.6 7.2 16.5 10.6 C16.6 14 14 16.6 10.6 16.5 C7.2 16.6 4.5 14 4.6 10.6 C4.5 7.2 7.2 4.5 10.6 4.6 Z M15 15 C16.6 16.6 18.2 18.2 19.8 19.8 M8 10.6 H13.2" />
));
export const Trash2 = make('trash', () => (
  <path d="M4.6 7 C9.5 6.7 14.5 6.7 19.4 7 M9.4 6.8 C9.4 5 10.4 4.4 12 4.4 C13.6 4.4 14.6 5 14.6 6.8 M6.6 7.4 L7.6 18.8 C7.7 19.6 8.2 20 9 20 H15 C15.8 20 16.3 19.6 16.4 18.8 L17.4 7.4 M10.2 10.6 V16.6 M13.8 10.6 V16.6" />
));
export const ShieldCheck = make('shield-check', () => (
  <path d="M12 3.8 C14.6 5.2 17 5.8 19.2 5.8 C19.4 12.6 16.6 17.6 12 20.2 C7.4 17.6 4.6 12.6 4.8 5.8 C7 5.8 9.4 5.2 12 3.8 Z M8.6 12.2 C9.6 13 10.4 14 11 15 C12.6 12.4 14 10.8 15.8 9.4" />
));
export const Save = make('save', () => (
  <path d="M5 5.6 C5 4.8 5.6 4.4 6.4 4.4 H15.6 L19.6 8.2 V18.6 C19.6 19.4 19 19.8 18.2 19.8 H6.4 C5.6 19.8 5 19.4 5 18.6 Z M8.2 4.6 V8.8 H14.6 V4.6 M8 19.6 V14 H16.4 V19.6" />
));
export const Move = make('move', () => (
  <path d="M12 3.6 V20.4 M3.6 12 H20.4 M9.6 6 L12 3.6 L14.4 6 M9.6 18 L12 20.4 L14.4 18 M6 9.6 L3.6 12 L6 14.4 M18 9.6 L20.4 12 L18 14.4" />
));
export const PackageOpen = make('package-open', () => (
  <path d="M4.2 9 L12 12.2 L19.8 9 M12 12.2 V20.4 M4.2 9 V16.8 L12 20.4 L19.8 16.8 V9 M4.2 9 L2.6 6 L10.4 3 L12 6 L13.6 3 L21.4 6 L19.8 9" />
));
export const LayoutGrid = make('layout-grid', () => (
  <path d="M5 5.2 H10.6 V10.6 H5 Z M13.4 5 H19 V10.6 H13.4 Z M5 13.4 H10.6 V19 H5 Z M13.4 13.4 H19 V19 H13.4 Z" />
));
export const Languages = make('languages', () => (
  <path d="M12 3.8 C16.6 3.8 20.2 7.4 20.2 12 C20.2 16.6 16.6 20.2 12 20.2 C7.4 20.2 3.8 16.6 3.8 12 C3.8 7.4 7.4 3.8 12 3.8 Z M4.2 12 H19.8 M12 4 C9.6 6.6 9.6 17.4 12 20 M12 4 C14.4 6.6 14.4 17.4 12 20" />
));
export const Info = make('info', () => (
  <>
    <path d="M12 3.8 C16.6 3.8 20.2 7.4 20.2 12 C20.2 16.6 16.6 20.2 12 20.2 C7.4 20.2 3.8 16.6 3.8 12 C3.8 7.4 7.4 3.8 12 3.8 Z M12 11 V16.4" />
    <circle cx="12" cy="7.8" r="0.9" fill="currentColor" />
  </>
));
export const Delete = make('delete', () => (
  <path d="M20.2 6 H9 L3.6 12 L9 18 H20.2 C20.6 14 20.6 10 20.2 6 Z M11.6 9.6 L16.4 14.4 M16.4 9.6 L11.6 14.4" />
));
export const BarChart3 = make('bar-chart', () => <path d="M4.4 19.6 C9.4 19.4 14.6 19.4 19.6 19.6 M7.4 16.6 V11.2 M12 16.6 V6.4 M16.6 16.6 V9.2" />);
export const Download = make('download', () => <path d="M12 4 C12.2 8 11.8 11.6 12 15 M7.6 10.8 C9 12.2 10.6 13.8 12 15.2 C13.4 13.8 15 12.2 16.4 10.8 M4.6 15.6 V18.6 C4.6 19.4 5.2 19.8 6 19.8 H18 C18.8 19.8 19.4 19.4 19.4 18.6 V15.6" />);
export const Upload = make('upload', () => <path d="M12 15.2 C11.8 11.2 12.2 7.6 12 4.2 M7.6 8.4 C9 7 10.6 5.4 12 4 C13.4 5.4 15 7 16.4 8.4 M4.6 15.6 V18.6 C4.6 19.4 5.2 19.8 6 19.8 H18 C18.8 19.8 19.4 19.4 19.4 18.6 V15.6" />);
export const Question = make('question', () => (
  <>
    <path d="M12 4.4 C16.6 4.3 20 7.4 19.9 11.4 C20 15.4 16.6 18.4 12 18.4 C10.9 18.4 9.9 18.2 9 17.9 L4.6 19.6 L5.8 15.6 C4.7 14.4 4.1 13 4.1 11.4 C4 7.4 7.4 4.3 12 4.4 Z" />
    <path d="M9.8 9.6 C9.9 8.2 11 7.6 12.1 7.6 C13.4 7.6 14.3 8.4 14.3 9.5 C14.3 11 12.2 11.2 12.1 12.8" />
    <circle cx="12.1" cy="15" r="0.9" fill="currentColor" />
  </>
));
export const Clock = make('clock', () => (
  <path d="M12 3.8 C16.6 3.8 20.2 7.4 20.2 12 C20.2 16.6 16.6 20.2 12 20.2 C7.4 20.2 3.8 16.6 3.8 12 C3.8 7.4 7.4 3.8 12 3.8 Z M12 7.4 C12.1 9.2 11.9 10.6 12 12.2 L15.2 14" />
));
export const Camera = make('camera', () => (
  <>
    <path d="M4.2 8.6 C4.2 7.8 4.8 7.2 5.6 7.2 H8.2 L9.6 5 H14.4 L15.8 7.2 H18.4 C19.2 7.2 19.8 7.8 19.8 8.6 V17.4 C19.8 18.2 19.2 18.8 18.4 18.8 H5.6 C4.8 18.8 4.2 18.2 4.2 17.4 Z" />
    <path d="M12 9.6 C14 9.5 15.4 11 15.4 12.9 C15.4 14.8 14 16.2 12 16.2 C10 16.2 8.6 14.8 8.6 12.9 C8.6 11 10 9.5 12 9.6 Z" />
  </>
));
