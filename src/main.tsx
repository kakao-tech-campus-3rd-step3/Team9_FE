import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';

import '@/styles/index.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';

// React Query 클라이언트 생성 - 필수 최적화 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 캐시 시간: 5분 (API 중복 요청 방지)
      staleTime: 5 * 60 * 1000,
      // 백그라운드에서 데이터 갱신 시간: 10분
      gcTime: 10 * 60 * 1000,
      // 윈도우 포커스 시 자동 리페치 비활성화 (auth 폼에서는 불필요)
      refetchOnWindowFocus: false,
      // 네트워크 재연결 시 자동 리페치 활성화
      refetchOnReconnect: true,
    },
    mutations: {
      // 뮤테이션 재시도: 1회 (로그인/회원가입에서는 1회만)
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        theme='colored'
      />
    </QueryClientProvider>
  </StrictMode>,
);
