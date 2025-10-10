import { z } from 'zod';
import { REGIONS, GENDERS } from '@/constants';
import type { RegionKey, GenderKey } from '@/constants';

// 성별 스키마
const genderSchema = z
  .string()
  .min(1, { message: '성별을 선택해주세요.' })
  .refine((v) => v in GENDERS, {
    message: '유효한 성별을 선택해주세요.',
  }) as z.ZodType<GenderKey>;

// 지역 스키마
const regionSchema = z
  .string()
  .min(1, { message: '지역을 선택해주세요.' })
  .refine((v) => v in REGIONS, {
    message: '유효한 지역을 선택해주세요.',
  }) as z.ZodType<RegionKey>;

// 회원가입 폼 스키마 정의
export const signupSchema = z
  .object({
    // 이메일
    email: z
      .email({ message: '이메일 형식이 올바르지 않습니다.' })
      .min(1, { message: '이메일을 입력해주세요.' })
      .transform((email) => email.toLowerCase()),

    // 인증번호 (필수, 6자리 숫자)
    verifyCode: z
      .string()
      .min(1, { message: '인증번호를 입력해주세요.' })
      .regex(/^\d{6}$/, { message: '숫자 6자리여야 합니다.' }),

    // 비밀번호
    password: z
      .string()
      .min(1, { message: '비밀번호를 입력해주세요.' })
      .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
      .max(64, { message: '비밀번호는 최대 64자까지 가능합니다.' }),

    // 비밀번호 확인
    confirmPassword: z
      .string()
      .min(1, { message: '비밀번호 확인을 입력해주세요.' })
      .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
      .max(64, { message: '비밀번호는 최대 64자까지 가능합니다.' }),

    // 닉네임
    nickname: z
      .string()
      .min(1, { message: '닉네임을 입력해주세요.' })
      .min(2, { message: '닉네임은 2자 이상이어야 합니다.' })
      .max(20, { message: '닉네임은 20자 이하여야 합니다.' }),

    // 성별
    gender: genderSchema,

    // 관심 분야
    interests: z
      .array(z.string())
      .min(1, { message: '관심 분야를 최소 1개 이상 선택해주세요.' }),

    // 지역
    region: regionSchema,

    // 프로필 이미지
    profileImage: z
      .instanceof(File)
      .refine(
        (file) =>
          ['image/jpeg', 'image/png', 'image/gif'].includes(file.type) ||
          file === null,
        { message: '이미지 파일은 jpg, png, gif 형식만 가능합니다.' },
      )
      .refine((file) => (file ? file.size <= 5 * 1024 * 1024 : true), {
        message: '이미지 파일은 5MB 이하만 가능합니다.',
      })
      .nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
