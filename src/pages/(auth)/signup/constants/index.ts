import { AUTH_TEXTS } from '../../constants';
import type {
  GenderOption,
  RegionOption,
  InterestOption,
  Region,
} from '../types';

// 성별 옵션
export const GENDER_OPTIONS: GenderOption[] = [
  { value: 'male', label: AUTH_TEXTS.SIGNUP.STEP2.GENDER_MALE },
  { value: 'female', label: AUTH_TEXTS.SIGNUP.STEP2.GENDER_FEMALE },
];

// 지역 옵션
export const REGION_OPTIONS: RegionOption[] = Object.entries(
  AUTH_TEXTS.SIGNUP.STEP2.REGIONS,
).map(([key, value]) => ({ value: key as Region, label: value }));

// 관심 분야 옵션
export const INTEREST_OPTIONS: InterestOption[] = Object.entries(
  AUTH_TEXTS.SIGNUP.STEP2.INTERESTS,
).map(([key, value]) => ({ key, label: value }));

// 공통 스타일 클래스
export const BUTTON_BASE_STYLES =
  'py-2 px-3 rounded-lg border-2 transition-colors text-sm cursor-pointer';

export const BUTTON_SELECTED_STYLES =
  'border-primary bg-accent text-accent-foreground';

export const BUTTON_UNSELECTED_STYLES = 'border-input hover:border-primary';

// 폼 기본값
export const DEFAULT_FORM_VALUES = {
  email: '',
  verifyCode: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  gender: '' as const,
  interests: [],
  region: '' as const,
  profileImage: null,
};
