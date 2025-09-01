import type { GenderKey, RegionKey } from '@/constants';

// 폼 데이터 타입
export interface SignupFormData {
  // 1단계 데이터
  email: string;
  verifyCode: string;
  password: string;
  confirmPassword: string;
  // 2단계 데이터
  nickname: string;
  gender: GenderKey | '';
  interests: string[];
  region: RegionKey | '';
  profileImage: File | null;
}

// 폼 단계 타입
export type SignupStep = 1 | 2;

// 옵션 타입들
export interface InterestOption {
  key: string;
  label: string;
}

export interface GenderOption {
  value: GenderKey;
  label: string;
}

export interface RegionOption {
  value: RegionKey;
  label: string;
}
