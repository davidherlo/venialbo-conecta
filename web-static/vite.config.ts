import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages publica en https://<usuario>.github.io/<repo>/
  // Con dominio propio o en la raíz: BASE_PATH=/ npm run build
  base: process.env.BASE_PATH ?? "/venialbo-conecta/",
  server: {
    // WSL2 + /mnt/c (filesystem Windows): inotify no detecta cambios.
    // Polling es la única manera fiable de hacer HMR en este entorno.
    watch: {
      usePolling: true,
      interval: 500,
    },
  },
});
