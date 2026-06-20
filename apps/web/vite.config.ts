import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@effects": path.resolve(__dirname, "./src/effects"),
    },
  },

  optimizeDeps: {
    exclude: ["lucide-react"],
  },

  // 개발 서버 설정
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
    fs: {
      allow: ["..", "../..", "../../..", "../../my-effects"],
    },
  },

  // 빌드 설정
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) {
            return "vendor-three";
          }
          if (
            id.includes("node_modules/@react-three/fiber") ||
            id.includes("node_modules/@react-three/drei")
          ) {
            return "vendor-r3f";
          }
        },
      },
      // 외부 효과 모듈을 동적으로 로드할 수 있도록 설정
      external: (id) => {
        // /effects/ 경로로 시작하는 모듈은 외부로 처리
        if (id.startsWith("/effects/")) {
          return true;
        }
        return false;
      },
    },
  },
});
