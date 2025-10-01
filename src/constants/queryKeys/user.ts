/**
 * 사용자 관련 queryKey
 */
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
} as const;
