import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { getAccessToken, removeAccessToken } from '@/utils';
import { ROUTES } from '@/constants';

// API 클라이언트 설정
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 인증 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터 - 에러 처리 및 토큰 관리
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message: string }>) => {
    // 토스트 표시 억제 플래그 확인
    const suppressToast = error.config?.headers?.['x-suppress-toast'] === '1';

    // 네트워크 오류 처리
    if (!error.response) {
      if (!suppressToast) {
        toast.error('네트워크 연결을 확인해주세요.');
      }
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const message = data?.message || '요청 중 오류가 발생했습니다.';

    // 401 인증 실패 처리
    if (status === 401) {
      removeAccessToken();
      const authMessage =
        data?.message || '인증이 만료되었습니다. 다시 로그인해주세요.';
      if (!suppressToast) {
        toast.error(authMessage);
      }
      window.location.href = ROUTES.LOGIN;
    } else {
      // 기타 에러 처리
      if (!suppressToast) {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
