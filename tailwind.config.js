/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // mobile: 100px ~ 767px
      mobile: { max: "767px", min: "100px" },
      // tablet: 768px ~ 1199px (이미지의 1200px은 desktop 시작점으로 둠)
      tablet: { min: "768px", max: "1199px" },
      // desktop(PC): 1200px 이상
      desktop: { min: "1200px" },
    },
    extend: {
      fontFamily: {
        // 예시: font-br, font-noto
        br: ["var(--font-br)", "sans-serif"],
        noto: ["var(--font-noto)", "sans-serif"],
      },
      colors: {
        // 예시: bg-black, text-white, bg-main, text-gray-100
        black: "var(--color-black)", // #0f0f0f
        white: "var(--color-white)", // #ffffff
        gray: {
          100: "var(--color-gray-100)", // #eeeeee
          200: "var(--color-gray-200)", // #dddddd
          300: "var(--color-gray-300)", // #a4a4a4
          400: "var(--color-gray-400)", // #5a5a5a
          500: "var(--color-gray-500)", // #161616
        },
        red: "var(--color-red)", // #ff483d
        blue: "var(--color-blue)", // #29c9f9;
        purple: "var(--color-purple)", // #a77eff
        pink: "var(--color-pink)", // #ff2a6a
        main: "var(--color-main)", // #efff04
      },
    },
  },
  plugins: [],
};
