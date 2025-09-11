import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

// API 기본 설정
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: API 요청을 보내기 전에 실행
apiClient.interceptors.request.use(
  (config) => {
    // 로컬 스토리지 등에서 토큰을 가져옵니다.
    const accessToken = localStorage.getItem('accessToken');

    // 토큰이 있다면 헤더에 추가합니다.
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // 요청 설정 중 에러가 발생했을 때 처리
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터: API 응답을 받은 후 실행
apiClient.interceptors.response.use(
  // 성공적인 응답은 그대로 반환
  (response) => response,
  // 에러가 발생한 응답을 처리
  (error: AxiosError<{ message: string }>) => {
    // 네트워크 오류 등 응답을 받지 못한 경우
    if (!error.response) {
      toast.error('네트워크 연결을 확인해주세요.');
      return Promise.reject(error);
    }

    // 서버로부터 받은 에러 메시지를 우선적으로 사용
    const message =
      error.response.data?.message || '요청 중 오류가 발생했습니다.';

    // HTTP 상태 코드에 따라 분기 처리
    switch (error.response.status) {
      case 401:
        // 예: 토큰 만료 시 로그인 페이지로 리다이렉트
        toast.error('인증이 만료되었습니다. 다시 로그인해주세요.');
        // window.location.href = '/login';
        // 여기서 토큰 갱신 로직을 추가할 수도 있습니다.
        break;
      case 403:
        toast.error('해당 작업에 대한 권한이 없습니다.');
        break;
      case 500:
        toast.error('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        break;
      default:
        // 400, 404 등 그 외의 에러는 서버 메시지를 그대로 보여줌
        toast.error(message);
        break;
    }

    return Promise.reject(error);
  },
);

export default apiClient;
