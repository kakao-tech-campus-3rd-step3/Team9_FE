import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  reflectionSchema,
  type ReflectionFormData,
} from '../schemas/reflectionSchema';

// 기본 폼 값
const DEFAULT_REFLECTION_FORM_VALUES: ReflectionFormData = {
  schedule_id: null,
  title: '',
  satisfaction_score: 5,
  understanding_score: 5,
  participation_score: 5,
  learned_content: '',
  improvement: '',
};

/**
 * 회고 폼 관리 훅
 * - React Hook Form을 사용한 회고 폼 상태 관리
 * - 폼 유효성 검증 및 제출 처리
 */
export const useReflectionForm = (
  initialData?: Partial<ReflectionFormData>,
) => {
  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<ReflectionFormData>({
    defaultValues: {
      ...DEFAULT_REFLECTION_FORM_VALUES,
      ...initialData,
    },
    resolver: zodResolver(reflectionSchema),
    mode: 'onTouched', // blur 시 최초 검증 이후 실시간 검증
  });

  // 현재 폼 값들
  const formValues = watch();

  // 점수 변경 핸들러
  const handleScoreChange = (
    field: keyof Pick<
      ReflectionFormData,
      'satisfaction_score' | 'understanding_score' | 'participation_score'
    >,
    value: number,
  ) => {
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
  };

  // 스케줄 변경 핸들러
  const handleScheduleChange = (scheduleId: number | null) => {
    setValue('schedule_id', scheduleId, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // 폼 리셋 (useCallback으로 메모이제이션하여 무한 렌더링 방지)
  const resetForm = useCallback(
    (newData?: Partial<ReflectionFormData>) => {
      reset({
        ...DEFAULT_REFLECTION_FORM_VALUES,
        ...newData,
      });
    },
    [reset],
  );

  return {
    // React Hook Form
    register,
    handleSubmit,
    errors,
    isValid,
    isDirty,
    formValues,

    // 핸들러
    handleScoreChange,
    handleScheduleChange,
    resetForm,

    // 유틸리티
    setValue,
  };
};
