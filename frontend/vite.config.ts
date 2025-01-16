import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server : {
    port: 3000,
    host: true, // This exposes the server to the network
    open: true, // Optional: opens the browser automatically
    strictPort: true, // Optional: fails if port 3000 is in use
    watch: {
      usePolling: true, // Needed for some systems, especially in VMs or containers
    },
  }

});
