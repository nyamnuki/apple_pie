import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'sage' | 'soft';
type Size = 'md' | 'lg' | 'icon';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-wood text-cream',
  sage: 'bg-sage text-bark',
  soft: 'bg-cream text-bark ring-2 ring-bark/10',
};

const SIZES: Record<Size, string> = {
  // 문구가 길어져도 깨지지 않게 높이는 최소값만 정하고 줄바꿈을 허용한다
  md: 'min-h-[56px] px-5 py-2 text-xl',
  lg: 'min-h-[72px] px-8 py-3 text-2xl',
  icon: 'h-14 w-14 shrink-0 text-xl',
};

// 누를 수 없는 버튼: 흐리게만 하지 않고 평평한 회갈색 + 점선 테두리로 바꾼다 (색만으로 알리지 않게).
// 글자는 진하게 남겨서 '다음' 같은 문구를 계속 읽을 수 있다.
const DISABLED =
  'disabled:cursor-not-allowed disabled:bg-bark/10 disabled:text-bark/80 disabled:shadow-none disabled:outline-dashed disabled:outline-2 disabled:outline-bark/40 disabled:outline-offset-[-5px] disabled:active:translate-y-0';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

// 아이가 누르기 쉬운 큰 버튼 (높이 최소 56px). 누르면 살짝 내려간다.
// 쓰임: primary(진한 나무색) = 그 화면에서 가장 중요한 한 가지 / sage(초록) = 놀이·이동 / soft(크림) = 그만두기·뒤로 같은 보조 동작
export default function BigButton({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-3xl text-center font-semibold leading-tight shadow-pop transition-transform duration-100 active:translate-y-1 active:shadow-pop-sm ${VARIANTS[variant]} ${DISABLED} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
