// 애플리케이션 라우트 경로 상수
export const ROUTES = {
  HOME: '/',
  EXAMPLE: '/example',
  STUDY: {
    EXPLORE: '/study/explore',
    CREATE: '/study/create',
    DETAIL: '/study/:id',
  },
} as const;
