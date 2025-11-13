import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@effects': path.resolve(__dirname, './src/effects'),
    },
  },
  
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  
  // 개발 서버 설정
  server: {
    fs: {
      // 프로젝트 루트 외부의 효과 디렉토리 접근 허용
      // 여러 경로를 허용하여 유연성 제공
      allow: [
        '..',                    // 상위 디렉토리
        '../../my-effects',      // 프로젝트 외부 효과 디렉토리 (예시)
        'D:/my-effects',        // 절대 경로 (Windows 예시)
        '/Users/username/my-effects', // 절대 경로 (Mac/Linux 예시)
      ],
    },
    // 외부 효과 디렉토리를 정적 파일로 서빙
    // 예: /my-effects -> ../../my-effects 디렉토리
    // 실제 사용 시 필요한 경로만 추가하세요
  },
  
  // 빌드 설정
  build: {
    rollupOptions: {
      // 외부 효과 모듈을 동적으로 로드할 수 있도록 설정
      external: (id) => {
        // /effects/ 경로로 시작하는 모듈은 외부로 처리
        if (id.startsWith('/effects/')) {
          return true;
        }
        return false;
      },
    },
  },
});
