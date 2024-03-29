import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "lib",
    emptyOutDir: true,
    lib: {
      entry: "./src/index.js",
      name: "Humming",
      formats: ["es", "umd"],
      fileName: (format) => `${format}/index.js`,
    },
    rollupOptions: {
      output: {
        compact: true,
      },
    },
  },
  plugins: [
    svelte({
      compilerOptions: {
        enableSourcemap: false
      },
      emitCss: false,
    }),
  ],
});
