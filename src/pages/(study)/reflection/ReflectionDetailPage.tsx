import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { REFLECTION_TEXTS, SCORE_LABELS, SCORE_RANGE } from './constants';
import { mockSchedules, mockReflectionDetails } from './mock';
import { ScoreSlider, ScheduleDropdown } from './components';
import type { ReflectionFormData, Schedule } from './types';

/**
 * 회고 작성/수정 페이지
 */
const ReflectionDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id) && !window.location.pathname.endsWith('/write');

  // 폼 상태
  const [formData, setFormData] = useState<ReflectionFormData>({
    schedule_id: null,
    title: '',
    satisfaction_score: 5,
    understanding_score: 5,
    participation_score: 5,
    learned_content: '',
    improvement: '',
  });

  // 스케줄 목록
  const [schedules] = useState<Schedule[]>(mockSchedules);

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEdit && id) {
      // 실제로는 API 호출로 데이터를 가져와야 함
      const existingData = mockReflectionDetails.find(
        (r) => r.id === parseInt(id),
      );
      if (existingData) {
        setFormData({
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
  }, [isEdit, id]);

  // 입력 핸들러
  const handleInputChange = (
    field: keyof ReflectionFormData,
    value: string | number | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 저장 핸들러
  const handleSave = () => {
    // 실제로는 API 호출
    console.log('저장할 데이터:', formData);
    // 성공 시 목록으로 이동
    navigate('/study/reflection');
  };

  // 취소 핸들러
  const handleCancel = () => {
    navigate('/study/reflection');
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
      <div className='flex-1 overflow-y-auto bg-background p-6'>
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
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder='회고 제목을 입력해주세요'
              className='w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            />
          </div>

          {/* 스케줄 선택 */}
          <div className='bg-card rounded-lg border border-border p-6'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              연관된 스터디 일정
            </h3>
            <ScheduleDropdown
              schedules={schedules}
              selectedScheduleId={formData.schedule_id}
              onScheduleChange={(scheduleId) =>
                handleInputChange('schedule_id', scheduleId)
              }
              placeholder={REFLECTION_TEXTS.SELECT_SCHEDULE_PLACEHOLDER}
            />
          </div>

          {/* 점수 평가 */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-foreground'>평가</h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <ScoreSlider
                label={SCORE_LABELS.SATISFACTION}
                value={formData.satisfaction_score}
                onChange={(value) =>
                  handleInputChange('satisfaction_score', value)
                }
                min={SCORE_RANGE.MIN}
                max={SCORE_RANGE.MAX}
              />

              <ScoreSlider
                label={SCORE_LABELS.UNDERSTANDING}
                value={formData.understanding_score}
                onChange={(value) =>
                  handleInputChange('understanding_score', value)
                }
                min={SCORE_RANGE.MIN}
                max={SCORE_RANGE.MAX}
              />

              <ScoreSlider
                label={SCORE_LABELS.PARTICIPATION}
                value={formData.participation_score}
                onChange={(value) =>
                  handleInputChange('participation_score', value)
                }
                min={SCORE_RANGE.MIN}
                max={SCORE_RANGE.MAX}
              />
            </div>
          </div>

          {/* 학습 내용 */}
          <div className='bg-card rounded-lg border border-border p-6'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              {REFLECTION_TEXTS.LEARNED_CONTENT_QUESTION}
            </h3>
            <textarea
              value={formData.learned_content}
              onChange={(e) =>
                handleInputChange('learned_content', e.target.value)
              }
              placeholder='이번 스터디에서 배운 내용과 느낀 점을 자유롭게 작성해주세요'
              className='w-full h-32 px-4 py-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            />
          </div>

          {/* 개선점 */}
          <div className='bg-card rounded-lg border border-border p-6'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              {REFLECTION_TEXTS.IMPROVEMENT_QUESTION}
            </h3>
            <textarea
              value={formData.improvement}
              onChange={(e) => handleInputChange('improvement', e.target.value)}
              placeholder='다음 스터디에서 개선하고 싶은 점이나 제안사항을 작성해주세요'
              className='w-full h-32 px-4 py-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            />
          </div>

          {/* 하단 버튼들 */}
          <div className='flex justify-end gap-3 pt-6'>
            <button
              onClick={handleCancel}
              className='px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors font-semibold'
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className='px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-semibold'
            >
              {isEdit ? '수정 완료' : '작성 완료'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectionDetailPage;
