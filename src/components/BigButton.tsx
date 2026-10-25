import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'sage' | 'soft';
type Size = 'md' | 'lg' | 'icon';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-oak text-cream',
  sage: 'bg-sage text-bark',
  soft: 'bg-cream text-bark ring-2 ring-bark/10',
};

const SIZES: Record<Size, string> = {
  // 문구가 길어져도 깨지지 않게 높이는 최소값만 정하고 줄바꿈을 허용한다
  md: 'min-h-[56px] px-5 py-2 text-xl',
  lg: 'min-h-[72px] px-8 py-3 text-2xl',
  icon: 'h-14 w-14 shrink-0 text-xl',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

// 아이가 누르기 쉬운 큰 버튼 (높이 최소 56px). 누르면 살짝 내려간다.
export default function BigButton({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-3xl text-center font-semibold leading-tight shadow-pop transition-transform duration-100 active:translate-y-1 active:shadow-pop-sm disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
