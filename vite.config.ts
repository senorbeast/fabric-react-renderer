import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Set the root to your examples folder where App.tsx resides
  root: "./examples",
  plugins: [react()],
  build: {
    outDir: "./examples/dist", // optional: output build files to a different directory
  },
});
