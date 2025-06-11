import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: true,
    lib: {
      entry: "src/index.ts",
      name: "@byomakase/omakase-react-components",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "@byomakase/omakase-player"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@byomakase/omakase-player": "OmakasePlayer",
        },
      },
    },
  },
  //   resolve: {
  //     alias: {
  //       "@byomakase/time-range-selector": path.resolve(
  //         __dirname,
  //         "../../plugins/time-range-selector/src"
  //       ),
  //     },
  //   },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
