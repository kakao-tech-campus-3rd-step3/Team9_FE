import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 관련 라이브러리
          'react-vendor': ['react', 'react-dom'],
          // 라우팅 관련 라이브러리
          'router-vendor': ['react-router-dom'],
          // UI 아이콘 라이브러리
          'ui-vendor': ['lucide-react'],
          // 폼 관련 라이브러리
          'form-vendor': ['react-hook-form', 'zod'],
          // 상태 관리 라이브러리
          'state-vendor': ['zustand', '@tanstack/react-query'],
          // 캘린더 관련 라이브러리
          'calendar-vendor': [
            '@fullcalendar/react',
            '@fullcalendar/daygrid',
            '@fullcalendar/interaction',
          ],
        },
      },
    },
  },
});
