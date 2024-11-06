/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        scaleInOut: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
      },
      animation: {
        scaleInOut: "scaleInOut 2s ease-in-out infinite",
      },
      colors: {
        background: "var(--bg-color)",
        main: "var(--main-color)",
        sub: "var(--sub-color)",
        subAlt: "var(--sub-alt-color)",
        text: "var(--text-color)",
        // error: "var(--error-color)",
        error: "rgb(220 38 38 )",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
