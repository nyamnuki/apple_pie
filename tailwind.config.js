/** @type {import('tailwindcss').Config} */
// 색상 값은 src/styles/index.css 의 CSS 변수에 있다. 여기서는 이름만 연결한다.
const v = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: v('sage'),
        moss: v('moss'),
        cream: v('cream'),
        oak: v('oak'),
        wood: v('wood'), // 글자·버튼용 진한 나무색
        petal: v('petal'),
        apricot: v('apricot'),
        mist: v('mist'),
        lavender: v('lavender'),
        bark: v('text'),
      },
      fontFamily: {
        // 영문은 Fredoka, 한글은 Jua 로 표시된다 (index.html 에서 불러온다)
        display: ['Fredoka', 'Jua', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        // 숫자 배지가 톡 나타나는 짧은 효과
        pop: { '0%': { transform: 'scale(0.4)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        // 캐릭터가 살짝 위아래로 숨 쉬듯 움직이기
        bob: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
        // 가구가 방에 톡 내려앉기
        settle: { '0%': { transform: 'translateY(-10px) scale(0.94)', opacity: '0' }, '100%': { transform: 'translateY(0) scale(1)', opacity: '1' } },
        // 보상 재료가 아래에서 살며시 나타나기
        rise: { '0%': { transform: 'translateY(8px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        // 찾는 도형이 아닐 때 살짝 좌우로 흔들기 (벌칙이 아니라 '그건 아니야' 신호)
        shake: { '0%, 100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-5px)' }, '75%': { transform: 'translateX(5px)' } },
      },
      animation: {
        pop: 'pop 0.25s ease-out both',
        bob: 'bob 2.8s ease-in-out infinite',
        settle: 'settle 0.3s ease-out both',
        rise: 'rise 0.35s ease-out both',
        shake: 'shake 0.4s ease-in-out',
      },
      boxShadow: {
        // 눌리는 느낌의 입체 버튼 그림자
        pop: '0 5px 0 0 rgb(var(--color-text) / 0.18)',
        'pop-sm': '0 2px 0 0 rgb(var(--color-text) / 0.18)',
        soft: '0 10px 30px -12px rgb(var(--color-text) / 0.35)',
      },
    },
  },
  plugins: [],
};
