/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // 밝고 따뜻한 파스텔 팔레트
      colors: {
        cream: '#FFF8EC',
        peach: { 100: '#FFE9DC', 200: '#FFD3BA', 400: '#FFA97A', 600: '#E9773F' },
        butter: { 100: '#FFF6CF', 200: '#FFEC99', 400: '#FFD84D', 600: '#D9A900' },
        mint: { 100: '#E3F8EE', 200: '#BDEFD6', 400: '#6FD6A6', 600: '#2FA875' },
        sky: { 100: '#E3F2FF', 200: '#BFE0FF', 400: '#7CC0FF', 600: '#3B8FE0' },
        lilac: { 100: '#F1EAFF', 200: '#DCCBFF', 400: '#B394FF', 600: '#7D5BD6' },
        rose: { 100: '#FFE8EF', 200: '#FFC9D9', 400: '#FF8FB0', 600: '#E0557F' },
        cocoa: { 400: '#9C7A5B', 700: '#5B3F2A', 900: '#3A281B' },
        night: { 700: '#24285B', 900: '#141638' },
      },
      fontFamily: {
        // 굵고 둥근 한글·영문 폰트 (index.html 에서 Google Fonts 로 불러온다)
        display: ['"Jua"', '"Fredoka"', 'system-ui', 'sans-serif'],
        body: ['"Fredoka"', '"Jua"', 'system-ui', 'sans-serif'],
      },
      minHeight: { touch: '48px' },
      minWidth: { touch: '48px' },
      boxShadow: {
        // 눌리는 느낌의 입체 버튼 그림자
        pop: '0 6px 0 0 rgba(91, 63, 42, 0.25)',
        'pop-sm': '0 3px 0 0 rgba(91, 63, 42, 0.25)',
        card: '0 10px 30px -10px rgba(91, 63, 42, 0.35)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        pop: { '0%': { transform: 'scale(0.6)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        twinkle: { '0%,100%': { opacity: '0.3' }, '50%': { opacity: '1' } },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        pop: 'pop 0.35s ease-out both',
        twinkle: 'twinkle 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
