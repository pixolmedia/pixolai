import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#06100d",
        paper: "#f4f8f5",
        pixol: "#7dff9b",
        aqua: "#55d8ff",
        ember: "#ffc45d",
        coral: "#ff6f61"
      },
      boxShadow: {
        panel: "0 24px 80px rgba(0,0,0,0.18)"
      }
    }
  },
  plugins: []
} satisfies Config;
