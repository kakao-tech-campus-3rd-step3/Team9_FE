export const QUERY_KEYS = {
  materials: (studyId: number, params?: unknown) =>
    ['materials', studyId, params ?? null] as const,
  materialDetail: (materialId: number) => ['material', materialId] as const,
  recentMaterials: (studyId: number) => ['recentMaterials', studyId] as const,
} as const;
