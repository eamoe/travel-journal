import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
// Use a relative base so the static build works under any subpath (e.g. GitHub Pages).
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
})
