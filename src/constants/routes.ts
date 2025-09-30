// 라우터에서 사용하는 동적 파라미터 키 상수
export const ROUTE_PARAMS = {
  studyId: 'study_id',
  materialId: 'id',
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
    DOCUMENT: 'document',
    DOCUMENT_ADD: 'document/add',
    DOCUMENT_DETAIL: `document/:${ROUTE_PARAMS.materialId}`,
    DOCUMENT_EDIT: `document/:${ROUTE_PARAMS.materialId}/edit`,
    PROGRESS: 'progress',
    SCHEDULE: 'schedule',
    QUIZ: 'quiz',
    RETRO: 'retro',
    ADMIN: {
      ROOT: 'admin',
      MEMBERS: 'admin/members',
      APPLICANTS: 'admin/applicants',
      STUDY_INFO: 'admin/study-info',
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
        `/${ROUTES.STUDY.ROOT}/${studyId}/${ROUTES.STUDY.DOCUMENT}`,
      add: (studyId: string | number) =>
        `/${ROUTES.STUDY.ROOT}/${studyId}/${ROUTES.STUDY.DOCUMENT_ADD}`,
      detail: (studyId: string | number, materialId: string | number) =>
        `/${ROUTES.STUDY.ROOT}/${studyId}/document/${materialId}`,
      edit: (studyId: string | number, materialId: string | number) =>
        `/${ROUTES.STUDY.ROOT}/${studyId}/document/${materialId}/edit`,
    },
  },
} as const;
