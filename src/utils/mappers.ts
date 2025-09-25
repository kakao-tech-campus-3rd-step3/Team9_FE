import type { UserProfile, StudyRole, UserRole } from '@/types';

// 프로필 → 스토어 사용자 매핑
export const mapUserProfileToAuthUser = (profile: UserProfile) => ({
  nickname: profile.nickname ?? '',
  imageKey: profile.image_key ?? '',
});

// 스터디 역할 → 글로벌 역할 매핑 (재사용)
export const mapStudyRoleToUserRole = (role: StudyRole): UserRole =>
  role === 'LEADER' ? 'STUDY_LEADER' : 'STUDY_MEMBER';
