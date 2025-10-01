/**
 * TanStack Query queryKey 중앙 관리
 * - 모든 queryKey를 함수 형태로 정의하여 타입 안정성 확보
 * - 중복 방지 및 일관성 유지
 */

/**
 * 사용자 프로필 관련 queryKey
 */
export const userProfileKeys = {
  all: ['userProfile'] as const,
  profile: () => [...userProfileKeys.all] as const,
} as const;

/**
 * 이미지 URL 관련 queryKey
 */
export const imageUrlKeys = {
  all: ['image-url'] as const,
  byKey: (imageKey: string) => [...imageUrlKeys.all, imageKey] as const,
} as const;

/**
 * 스터디 관련 queryKey
 */
export const studyKeys = {
  all: ['study'] as const,
  lists: () => [...studyKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...studyKeys.lists(), filters] as const,
  details: () => [...studyKeys.all, 'detail'] as const,
  detail: (id: string) => [...studyKeys.details(), id] as const,
} as const;

/**
 * 문서 관련 queryKey
 */
export const documentKeys = {
  all: ['document'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (studyId: string) => [...documentKeys.lists(), studyId] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
} as const;

/**
 * 일정 관련 queryKey
 */
export const scheduleKeys = {
  all: ['schedule'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (studyId: string, date?: string) =>
    [...scheduleKeys.lists(), studyId, date] as const,
  details: () => [...scheduleKeys.all, 'detail'] as const,
  detail: (id: string) => [...scheduleKeys.details(), id] as const,
} as const;
