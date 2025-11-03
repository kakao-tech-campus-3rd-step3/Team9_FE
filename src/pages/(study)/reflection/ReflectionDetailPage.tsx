import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES, ROUTE_BUILDERS, ROUTE_PARAMS } from '@/constants';
import { REFLECTION_TEXTS, SCORE_LABELS, SCORE_RANGE } from './constants';
import { mockSchedules, mockReflectionDetails } from './mock';
import { ScoreSlider, ScheduleDropdown } from './components';
import { useReflectionForm } from './hooks';
import type { Schedule } from './types';
import type { ReflectionFormData } from './schemas';

/**
 * 회고 작성/수정 페이지
 */
const ReflectionDetailPage = () => {
  const navigate = useNavigate();
  const { [ROUTE_PARAMS.reflectionId]: reflection_id, study_id } = useParams();
  const isEdit = Boolean(reflection_id);

  // 스케줄 목록
  const [schedules] = useState<Schedule[]>(mockSchedules);

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

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEdit && reflection_id) {
      // 실제로는 API 호출로 데이터를 가져와야 함
      const existingData = mockReflectionDetails.find(
        (r) => r.id === parseInt(reflection_id),
      );
      if (existingData) {
        resetForm({
          schedule_id: existingData.schedule_id,
          title: existingData.title,
          satisfaction_score: existingData.satisfaction_score,
          understanding_score: existingData.understanding_score,
          participation_score: existingData.participation_score,
          learned_content: existingData.learned_content,
          improvement: existingData.improvement,
        });
      }
    }
  }, [isEdit, reflection_id, resetForm]);

  // 폼 제출 핸들러
  const onSubmit = (data: ReflectionFormData) => {
    // 실제로는 API 호출
    console.log('저장할 데이터:', data);
    // 성공 시 목록으로 이동
    if (!study_id) return;
    navigate(
      `${ROUTE_BUILDERS.study.root(study_id)}/${ROUTES.STUDY.REFLECTION}`,
    );
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (!study_id) return;
    navigate(
      `${ROUTE_BUILDERS.study.root(study_id)}/${ROUTES.STUDY.REFLECTION}`,
    );
  };

  return (
    <div className='h-full flex flex-col bg-background'>
      {/* 헤더 */}
      <div className='px-6 py-6 border-b border-border bg-background'>
        <h1 className='text-2xl font-bold text-primary'>
          {isEdit ? '회고 수정' : REFLECTION_TEXTS.DETAIL_TITLE}
        </h1>
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
              disabled={!isValid}
              className='px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isEdit ? '수정 완료' : '작성 완료'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReflectionDetailPage;
