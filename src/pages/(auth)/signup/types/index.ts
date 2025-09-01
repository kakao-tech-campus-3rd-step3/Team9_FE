import { AUTH_TEXTS } from '../../constants';

// 기본 타입 정의
export type Gender = 'male' | 'female';
export type Region = keyof typeof AUTH_TEXTS.SIGNUP.STEP2.REGIONS;

// 폼 데이터 타입
export interface SignupFormData {
  // 1단계 데이터
  email: string;
  verifyCode: string;
  password: string;
  confirmPassword: string;
  // 2단계 데이터
  nickname: string;
  gender: Gender | '';
  interests: string[];
  region: Region | '';
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
  value: Gender;
  label: string;
}

export interface RegionOption {
  value: Region;
  label: string;
}
