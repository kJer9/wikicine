import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0B0D10",
        surface: "#14171C",
        elevated: "#1B1F26",
        rail: "#2A2F38",
        ink: {
          DEFAULT: "#EDEEF0",
          muted: "#8B92A0",
          faint: "#5B6270",
        },
        corail: {
          DEFAULT: "#FF6B45",
          soft: "#FF8563",
          dim: "#7A3623",
        },
        gold: {
          DEFAULT: "#D9A857",
          soft: "#E8C588",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        poster: "0.04em",
        chip: "0.12em",
      },
      backgroundImage: {
        "sprocket-rail":
          "repeating-linear-gradient(90deg, #2A2F38 0px, #2A2F38 6px, transparent 6px, transparent 18px)",
        vignette:
          "radial-gradient(120% 100% at 50% 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
