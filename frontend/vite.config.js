import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // In dev, /api calls go to the Express server (same-origin cookies, no CORS pain)
    proxy: { "/api": { target: "http://localhost:3000", changeOrigin: true } },
  },
});
