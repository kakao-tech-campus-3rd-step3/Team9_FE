import { GENDERS, INTERESTS, REGIONS } from '@/constants';
import type { GenderKey, RegionKey } from '@/constants';
import type { GenderOption, RegionOption, InterestOption } from '../types';

// 성별 옵션
export const GENDER_OPTIONS: GenderOption[] = Object.entries(GENDERS).map(
  ([key, label]) => ({ value: key as GenderKey, label }),
);

// 지역 옵션
export const REGION_OPTIONS: RegionOption[] = Object.entries(REGIONS).map(
  ([key, value]) => ({ value: key as RegionKey, label: value }),
);

// 관심 분야 옵션
export const INTEREST_OPTIONS: InterestOption[] = Object.entries(INTERESTS).map(
  ([key, value]) => ({ key, label: value }),
);

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
