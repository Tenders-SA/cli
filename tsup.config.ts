import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["esm"],
  target: "es2022",
  clean: true,
  sourcemap: true,
  bundle: true,
  platform: "node",
  outDir: "dist",
});
