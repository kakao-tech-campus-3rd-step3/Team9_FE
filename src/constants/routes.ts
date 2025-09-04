// 애플리케이션 라우트 경로 상수
export const ROUTES = {
  HOME: '/',
  EXAMPLE: '/example',
  LOGIN: '/login',
  SIGNUP: '/signup',
  STUDY: {
    EXPLORE: '/study/explore',
    CREATE: '/study/create',
    DETAIL: '/study/:id',
    DASHBOARD: '/study/dashboard',
  },
} as const;
