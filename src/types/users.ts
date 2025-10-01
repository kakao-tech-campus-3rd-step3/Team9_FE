// 사용자 도메인 공용 타입

export interface UserProfile {
  nickname: string;
  image_key: string;
}

export type StudyRole = 'LEADER' | 'MEMBER';

export interface UserStudyInfo extends UserProfile {
  title: string;
  role: StudyRole;
}

export interface UserProfileDetail extends UserProfile {
  interests: string[];
  location: string;
}
