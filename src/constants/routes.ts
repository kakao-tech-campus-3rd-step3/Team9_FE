// 애플리케이션 라우트 경로 상수
export const ROUTES = {
  HOME: '/',
  EXAMPLE: '/example',
  LOGIN: '/login',
  SIGNUP: '/signup',
  STUDY: {
    ROOT: 'study',
    EXPLORE: 'explore',
    CREATE: 'create',
    DETAIL: ':id',
    DASHBOARD: 'dashboard',
    DOCUMENT: 'document',
    DOCUMENT_ADD: 'document/add',
    DOCUMENT_DETAIL: 'document/:id',
    DOCUMENT_EDIT: 'document/:id/edit',
    PROGRESS: 'progress',
    SCHEDULE: 'schedule',
    QUIZ: 'quiz',
    RETRO: 'retro',
    ADMIN: 'admin',
  },
  SCHEDULE: {
    ROOT: '/schedule',
    MANAGE: 'manage',
    TUNE: 'tune',
  },
} as const;
