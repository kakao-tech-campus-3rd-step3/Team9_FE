import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';

import '@/styles/index.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import { queryClient } from '@/libs/queryClient';
import { AuthInitializer as AuthUtils } from '@/utils/auth';

// QueryClient는 전역 단일 인스턴스를 사용합니다 (src/libs/queryClient)

// 전역 인증 초기화: 렌더를 막지 않고 비동기로 시작
void AuthUtils.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </QueryClientProvider>
  </StrictMode>,
);
