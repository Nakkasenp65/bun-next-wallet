import scrollbarHide from "tailwind-scrollbar-hide";

const config = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}", "./public/**/*.html"],

  theme: {
    extend: {
      colors: {
        "primary-pink": "#FF2D96",
        "light-pink-bg": "#fff2f8",
      },
      boxShadow: {
        "pink-glow": "0 0 20px rgba(255, 45, 150, 0.3), var(--neon-pink)",
      },
      keyframes: {
        pulseBorder: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 45, 150, 0.3)" },
          "70%": { boxShadow: "0 0 0 15px rgba(255, 45, 150, 0)" },
        },
        "scan-line-anim": {
          "0%": { top: "1.25rem" },
          "50%": { top: "calc(100% - 1.25rem)" },
          "100%": { top: "1.25rem" },
        },
      },
      animation: {
        "pulse-border": "pulseBorder 2s infinite",
        "scan-line": "scan-line-anim 2.5s infinite linear",
      },
    },
  },
  plugins: [scrollbarHide],
};

export default config;
