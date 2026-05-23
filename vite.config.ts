import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
// Use a relative base so the static build works under any subpath (e.g. GitHub Pages).
export default defineConfig({
  base: "/travel-journal/",
  plugins: [react(), tailwindcss()],
  define: {
    // Stamped at build time so posts.json is re-fetched after every deploy.
    __BUILD_TS__: JSON.stringify(Date.now().toString()),
  },
})
