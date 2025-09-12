import type { z } from 'zod';
import { signupSchema } from '../schemas';
import type { GenderKey, RegionKey } from '@/constants';

export type SignupFormData = z.infer<typeof signupSchema>;

export type SignupStep = 1 | 2;

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
