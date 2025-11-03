/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      mobile: { max: "767px", min: "100px" },
      tablet: { min: "768px", max: "1199px" },
      desktop: { min: "1200px" },
    },
    extend: {
      fontFamily: {
        br: ["var(--font-br)", "sans-serif"],
        noto: ["var(--font-noto)", "sans-serif"],
      },
      colors: {
        black: "var(--color-black)",
        white: "var(--color-white)",
        gray: {
          100: "var(--color-gray-100)",
          200: "var(--color-gray-200)",
          300: "var(--color-gray-300)",
          400: "var(--color-gray-400)",
          500: "var(--color-gray-500)",
        },
        red: "var(--color-red)",
        blue: "var(--color-blue)",
        purple: "var(--color-purple)",
        pink: "var(--color-pink)",
        main: "var(--color-main)",
        "noti-read": "var(--color-noti-read)",
        "noti-unread": "var(--color-noti-unread)",
      },

      fontSize: {
        "br-3xl": ["62px", { fontFamily: "var(--font-br)" }],
        "br-2xl": ["48px", { fontFamily: "var(--font-br)" }],
        "br-lg": ["20px", { fontFamily: "var(--font-br)" }],
        "br-md": ["18px", { fontFamily: "var(--font-br)" }],
        "br-sm": ["16px", { fontFamily: "var(--font-br)" }],
        "noto-3xl": ["62px", { fontFamily: "var(--font-noto)" }],
        "noto-2xl": ["48px", { fontFamily: "var(--font-noto)" }],
        "noto-xl": ["40px", { fontFamily: "var(--font-noto)" }],
        "noto-lg": ["36px", { fontFamily: "var(--font-noto)" }],
        "noto-md": ["32px", { fontFamily: "var(--font-noto)" }],
        "noto-base": ["24px", { fontFamily: "var(--font-noto)" }],
        "noto-sm": ["20px", { fontFamily: "var(--font-noto)" }],
        "noto-xs": ["18px", { fontFamily: "var(--font-noto)" }],
      },

      // spacing 키를 짧은 이름으로 정의 (이제 p-lg, mb-lg 사용 가능)
      spacing: {
        "x-mobile": "15px",
        "x-tablet": "20px",
        "x-desktop": "220px",

        "2xs": "var(--spacing-xs)",
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
        "3xl": "var(--spacing-3xl)",
      },

      // h-lg, w-lg 등 사용할 수 있도록 size 매핑 추가
      height: {
        "2xs": "var(--size-spacing-xs)",
        xs: "var(--size-spacing-xs)",
        sm: "var(--size-spacing-sm)",
        md: "var(--size-spacing-md)",
        lg: "var(--size-spacing-lg)",
        xl: "var(--size-spacing-xl)",
        "2xl": "var(--size-spacing-2xl)",
        "3xl": "var(--size-spacing-3xl)",
      },
      width: {
        "2xs": "var(--size-spacing-xs)",
        xs: "var(--size-spacing-xs)",
        sm: "var(--size-spacing-sm)",
        md: "var(--size-spacing-md)",
        lg: "var(--size-spacing-lg)",
        xl: "var(--size-spacing-xl)",
        "2xl": "var(--size-spacing-2xl)",
        "3xl": "var(--size-spacing-3xl)",
      },
    },
  },
  plugins: [],
};
