import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTES, ROUTE_BUILDERS, ROUTE_PARAMS } from '@/constants';
import { REFLECTION_TEXTS, SCORE_LABELS, SCORE_RANGE } from './constants';
import { ScoreSlider, ScheduleDropdown } from './components';
import {
  useReflectionForm,
  useReflectionDetailQuery,
  useCreateReflectionMutation,
  useUpdateReflectionMutation,
} from './hooks';
import { useSchedulePastQuery } from './hooks/useSchedulePastQuery';
import { LoadingSpinner } from '@/components/common';
import type { ReflectionFormData } from './schemas';

/**
 * 회고 작성/수정 페이지
 */
const ReflectionDetailPage = () => {
  const navigate = useNavigate();
  const { [ROUTE_PARAMS.reflectionId]: reflection_id, study_id } = useParams();
  const isEdit = Boolean(reflection_id);

  const studyId = study_id ? Number(study_id) : 0;
  const reflectionId = reflection_id ? Number(reflection_id) : 0;

  // 회고 작성 가능한 과거 스터디 일정 조회
  const { data: schedules = [], isLoading: isLoadingSchedules } =
    useSchedulePastQuery(studyId);

  // 폼 상태 관리
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    formValues,
    handleScoreChange,
    handleScheduleChange,
    resetForm,
  } = useReflectionForm();

  // 수정 모드일 때 기존 데이터 조회
  const { data: existingReflection, isLoading: isLoadingDetail } =
    useReflectionDetailQuery(studyId, reflectionId);

  // 작성/수정 Mutation
  const createMutation = useCreateReflectionMutation(studyId);
  const updateMutation = useUpdateReflectionMutation(studyId, reflectionId);

  // 수정 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (isEdit && existingReflection) {
      resetForm({
        schedule_id: existingReflection.schedule_id,
        title: existingReflection.title,
        satisfaction_score: existingReflection.satisfaction_score,
        understanding_score: existingReflection.understanding_score,
        participation_score: existingReflection.participation_score,
        learned_content: existingReflection.learned_content,
        improvement: existingReflection.improvement,
      });
    }
  }, [isEdit, existingReflection, resetForm]);

  // 폼 제출 핸들러
  const onSubmit = (data: ReflectionFormData) => {
    if (!study_id) return;

    if (isEdit) {
      // 수정
      updateMutation.mutate(data, {
        onSuccess: () => {
          navigate(
            `${ROUTE_BUILDERS.study.root(study_id)}/${ROUTES.STUDY.REFLECTION}`,
          );
        },
      });
    } else {
      // 작성
      createMutation.mutate(data, {
        onSuccess: () => {
          navigate(
            `${ROUTE_BUILDERS.study.root(study_id)}/${ROUTES.STUDY.REFLECTION}`,
          );
        },
      });
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (!study_id) return;
    navigate(
      `${ROUTE_BUILDERS.study.root(study_id)}/${ROUTES.STUDY.REFLECTION}`,
    );
  };

  const isLoading = isEdit && isLoadingDetail;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // 수정 모드에서 데이터 로딩 중 또는 스케줄 로딩 중
  if (isLoading || isLoadingSchedules) {
    return (
      <div className='h-full flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col bg-background'>
      {/* 헤더 */}
      <div className='px-6 py-6 border-b border-border bg-background'>
        <div className='flex items-center gap-3'>
          <button
            onClick={handleCancel}
            className='p-2 hover:bg-accent rounded-lg transition-colors'
          >
            <ArrowLeft className='w-5 h-5 text-foreground' />
          </button>
          <h1 className='text-2xl font-bold text-primary'>
            {isEdit ? '회고 수정' : REFLECTION_TEXTS.DETAIL_TITLE}
          </h1>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex-1 overflow-y-auto bg-background p-6'
      >
        <div className='max-w-4xl mx-auto space-y-6'>
          {/* 제목 입력 */}
          <div className='bg-card rounded-lg border border-border p-6'>
            <label
              htmlFor='title'
              className='block text-lg font-semibold text-foreground mb-4'
            >
              제목
            </label>
            <input
              id='title'
              type='text'
              {...register('title')}
              placeholder='회고 제목을 입력해주세요'
              className='w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            />
            {errors.title && (
              <p className='mt-2 text-sm text-destructive'>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* 스케줄 선택 */}
          <div className='bg-card rounded-lg border border-border p-6'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              연관된 스터디 일정
            </h3>
            <ScheduleDropdown
              schedules={schedules}
              selectedScheduleId={formValues.schedule_id ?? null}
              onScheduleChange={handleScheduleChange}
              placeholder={REFLECTION_TEXTS.SELECT_SCHEDULE_PLACEHOLDER}
            />
            {errors.schedule_id && (
              <p className='mt-2 text-sm text-destructive'>
                {errors.schedule_id.message}
              </p>
            )}
          </div>

          {/* 점수 평가 */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-foreground'>평가</h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <ScoreSlider
                  label={SCORE_LABELS.SATISFACTION}
                  value={formValues.satisfaction_score}
                  onChange={(value) =>
                    handleScoreChange('satisfaction_score', value)
                  }
                  min={SCORE_RANGE.MIN}
                  max={SCORE_RANGE.MAX}
                />
                {errors.satisfaction_score && (
                  <p className='mt-2 text-sm text-destructive'>
                    {errors.satisfaction_score.message}
                  </p>
                )}
              </div>

              <div>
                <ScoreSlider
                  label={SCORE_LABELS.UNDERSTANDING}
                  value={formValues.understanding_score}
                  onChange={(value) =>
                    handleScoreChange('understanding_score', value)
                  }
                  min={SCORE_RANGE.MIN}
                  max={SCORE_RANGE.MAX}
                />
                {errors.understanding_score && (
                  <p className='mt-2 text-sm text-destructive'>
                    {errors.understanding_score.message}
                  </p>
                )}
              </div>

              <div>
                <ScoreSlider
                  label={SCORE_LABELS.PARTICIPATION}
                  value={formValues.participation_score}
                  onChange={(value) =>
                    handleScoreChange('participation_score', value)
                  }
                  min={SCORE_RANGE.MIN}
                  max={SCORE_RANGE.MAX}
                />
                {errors.participation_score && (
                  <p className='mt-2 text-sm text-destructive'>
                    {errors.participation_score.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 학습 내용 */}
          <div className='bg-card rounded-lg border border-border p-6'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              {REFLECTION_TEXTS.LEARNED_CONTENT_QUESTION}
            </h3>
            <textarea
              {...register('learned_content')}
              placeholder='이번 스터디에서 배운 내용과 느낀 점을 자유롭게 작성해주세요'
              className='w-full h-32 px-4 py-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            />
            {errors.learned_content && (
              <p className='mt-2 text-sm text-destructive'>
                {errors.learned_content.message}
              </p>
            )}
          </div>

          {/* 개선점 */}
          <div className='bg-card rounded-lg border border-border p-6'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              {REFLECTION_TEXTS.IMPROVEMENT_QUESTION}
            </h3>
            <textarea
              {...register('improvement')}
              placeholder='다음 스터디에서 개선하고 싶은 점이나 제안사항을 작성해주세요'
              className='w-full h-32 px-4 py-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            />
            {errors.improvement && (
              <p className='mt-2 text-sm text-destructive'>
                {errors.improvement.message}
              </p>
            )}
          </div>

          {/* 하단 버튼들 */}
          <div className='flex justify-end gap-3 pt-6'>
            <button
              type='button'
              onClick={handleCancel}
              className='px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors font-semibold'
            >
              취소
            </button>
            <button
              type='submit'
              disabled={!isValid || isSubmitting}
              className='px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? '처리 중...' : isEdit ? '수정 완료' : '작성 완료'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReflectionDetailPage;
