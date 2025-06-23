module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {fontFamily: {
        // 'aggro'라는 Tailwind 클래스 이름으로 'SBAggro' 폰트 패밀리를 사용합니다.
        // 'sans-serif'는 대체 폰트입니다.
        aggro: ['SBAggro', 'sans-serif'],
      },
    },
    container: { // container 클래스 중앙 정렬 및 패딩 추가
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
  },
  plugins: [],
}
