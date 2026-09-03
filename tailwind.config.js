/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Baloo 2'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        pastelPink: "#FF8AC0",
        pastelBlue: "#5FBBFA",
        pastelLavender: "#8B85F5",
        pastelMint: "#A8E6CF",
        pastelPeach: "#FFD4B8",
        pastelYellow: "#FFF3B0",
        pink: "#FF6FB0",
        pinkDim: "#E888BC",
        cyan: "#7FCBF5",
        ink: "#E8DFF0",
        inkSoft: "#C0B0D0",
        inkDim: "#9A8AAA",
        ok: "#A8E6CF",
        okDark: "#6BC48D",
      },
      borderRadius: {
        xl2: "1.1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        bump: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.18) rotate(-4deg)" },
          "100%": { transform: "scale(1)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(3deg)" },
        },
        "float-fast": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-5px) rotate(-2deg)" },
        },
        sparkle: {
          "0%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
          "50%": { opacity: 1, transform: "scale(1.2)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: 0.6 },
          "50%": { opacity: 1 },
        },
        "slide-up": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: 0, transform: "scale(0.5)" },
          "70%": { transform: "scale(1.1)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        bump: "bump 0.4s ease",
        "float-slow": "float-slow 4s ease-in-out infinite",
        "float-fast": "float-fast 3s ease-in-out infinite",
        sparkle: "sparkle 2s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "pop-in": "pop-in 0.4s ease-out",
        wiggle: "wiggle 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
