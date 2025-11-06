export const chatKeys = {
  all: ['chat'] as const,
  histories: () => [...chatKeys.all, 'history'] as const,
  history: (studyId: string) => [...chatKeys.histories(), studyId] as const,
  historyWithCursor: (studyId: string, cursor?: string) =>
    [...chatKeys.history(studyId), cursor] as const,
} as const;
