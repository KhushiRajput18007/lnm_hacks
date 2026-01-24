import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F14", // Dark navy/black
        surface: "#151A21", // Slightly lighter for cards
        primary: "#3b82f6", // Electric Blue
        secondary: "#ef4444", // Red
        accent: "#00FF94", // Neon Green
        win: "#00FF94",
        loss: "#FF2E2E",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-glow": "radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
