import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    build: {
      outDir: "dist",  // 🔥 명시적으로 빌드 출력 폴더 설정
    },
    server: mode === "development" ? {
      proxy: {
        "/api": {
          target: "http://localhost:9000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      },
    } : undefined,
  };
});
