import { z } from 'zod';

// 로그인 폼 스키마 정의
export const loginSchema = z.object({
  // 이메일
  email: z
    .email({ message: '이메일 형식이 올바르지 않습니다.' })
    .min(1, { message: '이메일을 입력해주세요.' })
    .transform((email) => email.toLowerCase()),

  // 비밀번호
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(8, '비밀번호는 8자 이상이어야 합니다.'),
});

export type LoginPayload = z.infer<typeof loginSchema>;
