/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Baloo 2'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        blush: "#FFF0F5",
        sky: "#E8F4FD",
        cream: "#FFFAF0",
        panel: "#FFFFFF",
        panelSoft: "#FFF8FA",
        panelBlue: "#F0F8FF",
        border: "#F0D4E8",
        borderBlue: "#D4E8F7",
        pastelPink: "#FFB6D9",
        pastelBlue: "#A8D8EA",
        pastelLavender: "#D4A5FF",
        pastelMint: "#B8E6C8",
        pastelPeach: "#FFD4B8",
        pastelYellow: "#FFF3B0",
        pink: "#FF8FC7",
        pinkDim: "#E8A0C8",
        cyan: "#A8D8EA",
        ink: "#4A3B5C",
        inkSoft: "#7B6B8A",
        inkDim: "#A89BB8",
        ok: "#B8E6C8",
        okDark: "#6BC48D",
      },
      darkColors: {
        ink: "#E8DFF0",
        inkSoft: "#C0B0D0",
        inkDim: "#8A7A9A",
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
