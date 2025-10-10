// 자료관리 엔드포인트 상수
export const MATERIAL_ENDPOINTS = {
  CREATE: (study_id: number) => `/api/studies/${study_id}/materials`,
  LIST: (study_id: number) => `/api/studies/${study_id}/materials`,
  DETAIL: (material_id: number) => `/api/materials/${material_id}`,
  UPDATE: (material_id: number) => `/api/materials/${material_id}`,
  DELETE_MANY: () => `/api/materials`,
  RECENT: (study_id: number) => `/api/studies/${study_id}/material/recent`,
} as const;

export type MaterialEndpointKey = keyof typeof MATERIAL_ENDPOINTS;
