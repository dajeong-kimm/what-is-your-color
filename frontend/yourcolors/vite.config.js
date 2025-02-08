import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // 🔥 명시적으로 빌드 출력 폴더 설정
  },
});
