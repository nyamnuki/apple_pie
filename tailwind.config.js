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
