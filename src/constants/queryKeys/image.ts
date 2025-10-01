/**
 * 이미지 관련 queryKey
 */
export const imageKeys = {
  all: ['image'] as const,
  urlByKey: (imageKey: string) => [...imageKeys.all, 'url', imageKey] as const,
} as const;
