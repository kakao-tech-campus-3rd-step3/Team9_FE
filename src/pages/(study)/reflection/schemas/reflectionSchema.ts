import { z } from 'zod';
import { SCORE_RANGE } from '../constants';

// 회고 폼 스키마 정의
export const reflectionSchema = z.object({
  // 스케줄 ID (선택사항)
  schedule_id: z.number().nullable().optional(),

  // 제목
  title: z
    .string()
    .min(1, { message: '제목을 입력해주세요.' })
    .max(100, { message: '제목은 100자 이하로 입력해주세요.' }),

  // 만족도 점수
  satisfaction_score: z
    .number()
    .min(SCORE_RANGE.MIN, {
      message: `만족도는 ${SCORE_RANGE.MIN}점 이상이어야 합니다.`,
    })
    .max(SCORE_RANGE.MAX, {
      message: `만족도는 ${SCORE_RANGE.MAX}점 이하여야 합니다.`,
    }),

  // 이해도 점수
  understanding_score: z
    .number()
    .min(SCORE_RANGE.MIN, {
      message: `이해도는 ${SCORE_RANGE.MIN}점 이상이어야 합니다.`,
    })
    .max(SCORE_RANGE.MAX, {
      message: `이해도는 ${SCORE_RANGE.MAX}점 이하여야 합니다.`,
    }),

  // 참여도 점수
  participation_score: z
    .number()
    .min(SCORE_RANGE.MIN, {
      message: `참여도는 ${SCORE_RANGE.MIN}점 이상이어야 합니다.`,
    })
    .max(SCORE_RANGE.MAX, {
      message: `참여도는 ${SCORE_RANGE.MAX}점 이하여야 합니다.`,
    }),

  // 학습 내용
  learned_content: z
    .string()
    .min(1, { message: '학습 내용을 입력해주세요.' })
    .max(1000, { message: '학습 내용은 1000자 이하로 입력해주세요.' }),

  // 개선점
  improvement: z
    .string()
    .min(1, { message: '개선점을 입력해주세요.' })
    .max(1000, { message: '개선점은 1000자 이하로 입력해주세요.' }),
});

export type ReflectionFormData = z.infer<typeof reflectionSchema>;
