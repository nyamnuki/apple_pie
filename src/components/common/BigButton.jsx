import { sfx } from '../../utils/sound.js';

// 색상별 스타일
const VARIANTS = {
  primary: 'bg-peach-400 text-white',
  mint: 'bg-mint-400 text-white',
  sky: 'bg-sky-400 text-white',
  lilac: 'bg-lilac-400 text-white',
  soft: 'bg-white text-cocoa-700',
};

const SIZES = {
  md: 'min-h-[56px] px-5 text-xl',
  lg: 'min-h-[72px] px-8 text-2xl',
  icon: 'h-14 w-14 text-xl', // 아이콘 하나짜리 정사각형 버튼
};

// 아이가 누르기 쉬운 큰 버튼 (최소 48px 이상, 누르면 톡 소리)
export default function BigButton({ children, variant = 'primary', size = 'md', className = '', onClick, disabled, silent, ...rest }) {
  const handleClick = (e) => {
    if (disabled) return;
    if (!silent) sfx.tap();
    onClick?.(e);
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`btn-pop inline-flex items-center justify-center gap-2 rounded-3xl font-display ${VARIANTS[variant]} ${SIZES[size]} disabled:opacity-50 disabled:active:translate-y-0 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
