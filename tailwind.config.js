/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // 예시: mobile:w-[200px] , tablet:w-[200px]
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
        "noti-read": "var(--color-noti-read)",
        "noti-unread": "var(--color-noti-unread)",
      },
      fontSize: {
        // 예시: text-br-3xl, text-noto-2xl

        // 베라 폰트 : 사이즈
        "br-3xl": ["62px", { fontFamily: "var(--font-br)" }],
        "br-2xl": ["48px", { fontFamily: "var(--font-br)" }],
        "br-lg": ["20px", { fontFamily: "var(--font-br)" }],
        "br-md": ["18px", { fontFamily: "var(--font-br)" }],
        "br-sm": ["16px", { fontFamily: "var(--font-br)" }],
        // noto 폰트 : 사이즈
        "noto-3xl": ["62px", { fontFamily: "var(--font-noto)" }],
        "noto-2xl": ["48px", { fontFamily: "var(--font-noto)" }],
        "noto-xl": ["40px", { fontFamily: "var(--font-noto)" }],
        "noto-lg": ["36px", { fontFamily: "var(--font-noto)" }],
        "noto-md": ["32px", { fontFamily: "var(--font-noto)" }],
        "noto-base": ["24px", { fontFamily: "var(--font-noto)" }],
        "noto-sm": ["20px", { fontFamily: "var(--font-noto)" }],
        "noto-xs": ["18px", { fontFamily: "var(--font-noto)" }],
        "noto-2xs": ["16px", { fontFamily: "var(--font-noto)" }],
        "noto-3xs": ["14px", { fontFamily: "var(--font-noto)" }],
        "noto-4xs": ["12px", { fontFamily: "var(--font-noto)" }],
        "noto-5xs": ["10px", { fontFamily: "var(--font-noto)" }],
      },

      spacing: {
        // 반응형 컨테이너 패딩 시스템
        // 예시:  px-container-mobile, px-container-tablet, px-container-desktop
        "container-mobile": "15px",
        "container-tablet": "20px",
        "container-desktop": "220px",
        // 축약형으로도 사용 가능
        // 예시: px-x-mobile, px-x-tablet, px-x-desktop
        "x-mobile": "15px",
        "x-tablet": "20px",
        "x-desktop": "220px",
      },
    },
  },
  plugins: [],
};
