import type { StudyRole } from '@/types/users';

export type StudyMe = {
  study_id: number;
  title: string;
  role: StudyRole;
};
