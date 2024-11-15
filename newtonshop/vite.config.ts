import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import eslintPlugin from "vite-plugin-eslint";

export default defineConfig(async () => {
  const tsconfigPaths = await import("vite-tsconfig-paths").then((module) => module.default);

  return {
    plugins: [
      react(),
      svgr(),
      tsconfigPaths(),

    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      port: 3000, // Порт, на котором будет запущен сервер разработки
      open: true, // Автоматически открывать браузер при запуске сервера
      historyApiFallback: true, // позволяет Vite обрабатывать все маршруты React Router
    },
    build: {
      outDir: "dist", // Директория для сборки
      sourcemap: true, // Включить sourcemaps для production сборки
    },
    esbuild: {
      // Дополнительные настройки для esbuild, если нужно
    },
  };
});
