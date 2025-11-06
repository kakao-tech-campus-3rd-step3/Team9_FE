/**
 * 진척도 관련 queryKey
 */
export const progressKeys = {
  all: ['progress'] as const,
  roadmap: (studyId: number) =>
    [...progressKeys.all, 'roadmap', studyId] as const,
  memberStatus: (studyId: number) =>
    [...progressKeys.all, 'member-status', studyId] as const,
  myStatus: (studyId: number) =>
    [...progressKeys.all, 'my-status', studyId] as const,
} as const;
