/**
 * 회고 관련 queryKey
 */
export const reflectionKeys = {
  // 회고 목록 조회
  list: (
    study_id: number,
    params?: {
      author?: string;
      page?: number;
      size?: number;
      sort?: string[];
    },
  ) => ['reflection-list', study_id, params] as const,
  // 회고 상세 조회
  detail: (study_id: number, reflection_id: number) =>
    ['reflection-detail', study_id, reflection_id] as const,
} as const;
