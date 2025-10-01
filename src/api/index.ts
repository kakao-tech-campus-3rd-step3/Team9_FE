import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
} from 'axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/auth';
import { TokenManager } from '@/utils/auth';
import { ROUTES } from '@/constants';

// API 클라이언트 설정
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * axios config에 showToast 옵션 추가
 * 토스트를 필요로 하지 않는 요청에는 showToast: false 옵션을 추가하여 토스트를 숨길 수 있음
 *
 * 사용법:
 * - 토스트 표시: apiClient.get('/users')
 * - 토스트 숨김: apiClient.get('/users', { showToast: false })
 */
declare module 'axios' {
  interface AxiosRequestConfig {
    /** 토스트 알림 표시 여부 (기본값: true) */
    showToast?: boolean;
  }
}

// 요청 인터셉터 - 인증 토큰 자동 추가 및 showToast 옵션 처리
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // showToast 옵션을 헤더로 변환 (기본값: true, 명시적으로 false일 때만 숨김)
    config.headers['x-show-toast'] = config.showToast === false ? '0' : '1';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 - 에러 처리 및 토큰 관리
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message: string }>) => {
    // 토스트 표시 여부 확인 (커스텀 헤더 사용, 기본값: true)
    const showToast = error.config?.headers?.['x-show-toast'] === '1';

    // 네트워크 오류 처리
    if (!error.response) {
      if (showToast) {
        toast.error('네트워크 연결을 확인해주세요.');
      }
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const message = data?.message || '요청 중 오류가 발생했습니다.';

    // 401 인증 실패 처리
    if (status === 401) {
      const originalRequest = (error.config || {}) as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // 아직 재시도하지 않았다면 한 번만 재발급 시도
      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // 토큰 재발급 시도
          const newAccessToken = await TokenManager.getNewAccessToken();

          if (newAccessToken) {
            // 새로운 토큰을 store에 저장
            const { setAccessToken } = useAuthStore.getState();
            setAccessToken(newAccessToken);

            // 새로운 토큰으로 원래 요청 재시도
            if (!originalRequest.headers) {
              originalRequest.headers = {} as AxiosRequestHeaders;
            }
            (originalRequest.headers as AxiosRequestHeaders).Authorization =
              `Bearer ${newAccessToken}`;
            return apiClient(originalRequest as AxiosRequestConfig);
          }
        } catch {
          // 재발급 실패 시 아래 공통 처리로 이동
        }
      }

      // 토큰 재발급 실패 시 로그아웃 처리 (명시적 상태 초기화)
      const { reset } = useAuthStore.getState();
      reset();
      const authMessage =
        data?.message || '인증이 만료되었습니다. 다시 로그인해주세요.';
      if (showToast) {
        toast.error(authMessage);
      }
      window.location.href = ROUTES.LOGIN;
    } else {
      // 기타 에러 처리
      if (showToast) {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
export { default as publicClient } from './publicClient';
