import { GENDERS, INTERESTS, REGIONS } from '@/constants';
import type { GenderKey, RegionKey } from '@/constants';
import type { GenderOption, RegionOption, InterestOption } from '../types';

export const GENDER_OPTIONS: GenderOption[] = Object.entries(GENDERS).map(
  ([key, label]) => ({ value: key as GenderKey, label }),
);

export const REGION_OPTIONS: RegionOption[] = Object.entries(REGIONS).map(
  ([key, value]) => ({ value: key as RegionKey, label: value }),
);

export const INTEREST_OPTIONS: InterestOption[] = Object.entries(INTERESTS).map(
  ([key, value]) => ({ key, label: value }),
);

export const BUTTON_BASE_STYLES =
  'py-2 px-3 rounded-lg border-2 transition-colors text-sm cursor-pointer';

export const BUTTON_SELECTED_STYLES =
  'border-primary bg-accent text-accent-foreground';

export const BUTTON_UNSELECTED_STYLES = 'border-input hover:border-primary';

export const DEFAULT_FORM_VALUES = {
  email: '',
  verifyCode: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  gender: undefined,
  interests: [] as string[],
  region: undefined,
  profileImage: null,
};
