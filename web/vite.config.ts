import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // WSL2 + /mnt/c (filesystem Windows): inotify no detecta cambios.
    // Polling es la única manera fiable de hacer HMR en este entorno.
    watch: {
      usePolling: true,
      interval: 500,
    },
  },
});
