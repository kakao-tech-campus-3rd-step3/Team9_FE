// 라우터에서 사용하는 동적 파라미터 키 상수
export const ROUTE_PARAMS = {
  studyId: 'study_id',
  materialId: 'document_id',
} as const;

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
    DETAIL: `:${ROUTE_PARAMS.studyId}`,
    DASHBOARD: 'dashboard',
    DOCUMENT: {
      ROOT: 'document',
      ADD: 'add',
      DETAIL: `:${ROUTE_PARAMS.materialId}`,
      EDIT: `:${ROUTE_PARAMS.materialId}/edit`,
    },
    PROGRESS: 'progress',
    SCHEDULE: 'schedule',
    QUIZ: 'quiz',
    RETRO: 'retro',
    ADMIN: {
      ROOT: 'admin',
      MEMBERS: 'members',
      APPLICANTS: 'applicants',
      STUDY_INFO: 'study-info',
    },
  },
  SCHEDULE: {
    ROOT: '/schedule',
    MANAGE: 'manage',
    TUNE: 'tune',
  },
} as const;

// 경로 빌더 (중앙에서 경로 생성 일원화)
export const ROUTE_BUILDERS = {
  study: {
    root: (studyId: string | number) => `/${ROUTES.STUDY.ROOT}/${studyId}`,
    document: {
      list: (studyId: string | number) =>
        `/${ROUTES.STUDY.ROOT}/${studyId}/${ROUTES.STUDY.DOCUMENT.ROOT}`,
      add: (studyId: string | number) =>
        `/${ROUTES.STUDY.ROOT}/${studyId}/${ROUTES.STUDY.DOCUMENT.ROOT}/${ROUTES.STUDY.DOCUMENT.ADD}`,
      detail: (studyId: string | number, materialId: string | number) =>
        `/${ROUTES.STUDY.ROOT}/${studyId}/${ROUTES.STUDY.DOCUMENT.ROOT}/${materialId}`,
      edit: (studyId: string | number, materialId: string | number) =>
        `/${ROUTES.STUDY.ROOT}/${studyId}/${ROUTES.STUDY.DOCUMENT.ROOT}/${materialId}/edit`,
    },
  },
} as const;
