import scrollbarHide from "tailwind-scrollbar-hide";

const config = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}", // Make sure this covers your files
    "./public/**/*.html", // If your HTML files are in 'public'
    // Add any other paths where you use Tailwind classes
  ],

  theme: {
    extend: {
      // 1. Add your custom colors
      colors: {
        "primary-pink": "#FF2D96", // The color from your rgba(255, 45, 150)
        "light-pink-bg": "#fff2f8",
      },
      // 2. Add the custom box-shadow
      boxShadow: {
        "pink-glow": "0 0 20px rgba(255, 45, 150, 0.3), var(--neon-pink)",
        // NOTE: You'll need to replace `var(--neon-pink)` with its actual value,
        // for example: '0 0 20px rgba(255, 45, 150, 0.3), 0 0 5px #ff00ff'
      },
      // 3. Define the keyframes for the animation
      keyframes: {
        pulseBorder: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 45, 150, 0.3)" },
          "70%": { boxShadow: "0 0 0 15px rgba(255, 45, 150, 0)" },
        },
        "scan-line-anim": {
          "0%": { top: "1.25rem" }, // 20px
          "50%": { top: "calc(100% - 1.25rem)" }, // 20px from bottom
          "100%": { top: "1.25rem" },
        },
      },
      // 4. Create the animation utility that uses the keyframes
      animation: {
        "pulse-border": "pulseBorder 2s infinite",
        "scan-line": "scan-line-anim 2.5s infinite linear",
      },
    },
  },
  plugins: [scrollbarHide],
};

export default config;
