import type { Config } from "tailwindcss";

export default {
  content: ["./frontend/src/**/*.{ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        ink: "#09090B",
        elevated: "#111113",
        panel: "#18181B",
        amber: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
