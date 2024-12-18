import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import eslintPlugin from "vite-plugin-eslint";
import { PluginOption, ViteDevServer } from "vite";

export default defineConfig(async () => {
  const tsconfigPaths = (await import("vite-tsconfig-paths")).default;

  return {
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
      "process.env.PUBLIC_URL": JSON.stringify("/"),
    },
    plugins: [
      react(),
      svgr(),
      tsconfigPaths(),
      eslintPlugin({
        cache: false,
        include: ["src/**/*.js", "src/**/*.jsx", "src/**/*.ts", "src/**/*.tsx"],
        exclude: ["node_modules"],
      }),
      {
        name: "vite-plugin-cache-control",
        configureServer(server: ViteDevServer) {
          server.middlewares.use((req, res, next) => {
            res.setHeader("Cache-Control", "public, max-age=2592000");
            next();
          });
        },
      } as PluginOption,
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      port: 3000,
      open: true,
      historyApiFallback: true,
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
    esbuild: {
      // Дополнительные настройки для esbuild
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  };
});
