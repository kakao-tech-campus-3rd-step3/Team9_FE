import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, User } from 'lucide-react';
import { mockReflectionDetails, mockSchedules } from './mock';
import type { Reflection, Schedule } from './types';

/**
 * 회고 읽기 전용 상세보기 페이지
 */
const ReflectionViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [schedules] = useState<Schedule[]>(mockSchedules);

  // 현재 사용자 (실제로는 인증 상태에서 가져와야 함)
  const currentUserId = 5; // 김경대 (첫 번째 회고 작성자)

  useEffect(() => {
    if (id) {
      // 실제로는 API 호출로 데이터를 가져와야 함
      const reflectionData = mockReflectionDetails.find(
        (r) => r.id === parseInt(id),
      );
      setReflection(reflectionData || null);
    }
  }, [id]);

  if (!reflection) {
    return <div>로딩 중...</div>;
  }

  const isAuthor = reflection.study_member_id === currentUserId;
  const selectedSchedule = schedules.find(
    (s) => s.schedule_id === reflection.schedule_id,
  );

  // 작성자 이름 매핑
  const getAuthorName = (studyMemberId: number) => {
    const authorMap: { [key: number]: string } = {
      5: '김경대',
      6: '이영희',
      7: '박민수',
    };
    return authorMap[studyMemberId] || '알 수 없음';
  };

  const handleEdit = () => {
    navigate(`/study/reflection/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/study/reflection');
  };

  return (
    <div className='h-full flex flex-col bg-background'>
      {/* 헤더 */}
      <div className='px-6 py-6 border-b border-border bg-background'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <button
              onClick={handleBack}
              className='p-2 hover:bg-accent rounded-lg transition-colors'
            >
              <ArrowLeft className='w-5 h-5 text-foreground' />
            </button>
            <h1 className='text-2xl font-bold text-primary'>회고 상세</h1>
          </div>

          {isAuthor && (
            <button
              onClick={handleEdit}
              className='flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary-hover transition-colors font-semibold'
            >
              <Edit className='w-4 h-4' />
              <span>수정</span>
            </button>
          )}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className='flex-1 overflow-y-auto bg-background p-6'>
        <div className='max-w-4xl mx-auto space-y-6'>
          {/* 제목 */}
          <div className='bg-card rounded-lg border border-border p-6'>
            <h2 className='text-xl font-bold text-foreground mb-2'>
              {reflection.title}
            </h2>

            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
              <div className='flex items-center gap-1'>
                <User className='w-4 h-4' />
                <span>작성자: {getAuthorName(reflection.study_member_id)}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Calendar className='w-4 h-4' />
                <span>
                  {new Date(reflection.updated_at).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          </div>

          {/* 연관된 스터디 일정 */}
          {selectedSchedule && (
            <div className='bg-card rounded-lg border border-border p-6'>
              <h3 className='text-lg font-semibold text-foreground mb-2'>
                연관된 스터디 일정
              </h3>
              <p className='text-foreground'>
                {selectedSchedule.schedule_title}
              </p>
            </div>
          )}

          {/* 점수 평가 */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-foreground'>평가</h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-card rounded-lg border border-border p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h4 className='text-lg font-semibold text-foreground'>
                    전체 만족도
                  </h4>
                  <span className='text-2xl font-bold text-primary'>
                    {reflection.satisfaction_score}/10
                  </span>
                </div>
                <div className='w-full bg-secondary rounded-full h-2'>
                  <div
                    className='bg-primary h-2 rounded-full transition-all'
                    style={{
                      width: `${(reflection.satisfaction_score / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className='bg-card rounded-lg border border-border p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h4 className='text-lg font-semibold text-foreground'>
                    내용 이해도
                  </h4>
                  <span className='text-2xl font-bold text-primary'>
                    {reflection.understanding_score}/10
                  </span>
                </div>
                <div className='w-full bg-secondary rounded-full h-2'>
                  <div
                    className='bg-primary h-2 rounded-full transition-all'
                    style={{
                      width: `${(reflection.understanding_score / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className='bg-card rounded-lg border border-border p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h4 className='text-lg font-semibold text-foreground'>
                    참여도
                  </h4>
                  <span className='text-2xl font-bold text-primary'>
                    {reflection.participation_score}/10
                  </span>
                </div>
                <div className='w-full bg-secondary rounded-full h-2'>
                  <div
                    className='bg-primary h-2 rounded-full transition-all'
                    style={{
                      width: `${(reflection.participation_score / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 학습 내용 */}
          <div className='bg-card rounded-lg border border-border p-6'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              이번 스터디에서 공부한 점과 느낀점은 무엇인가요?
            </h3>
            <div className='bg-background border border-border rounded-lg p-4 min-h-[120px]'>
              <p className='text-foreground whitespace-pre-wrap'>
                {reflection.learned_content}
              </p>
            </div>
          </div>

          {/* 개선점 */}
          <div className='bg-card rounded-lg border border-border p-6'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              다음 스터디에서 개선할 점은 무엇인가요?
            </h3>
            <div className='bg-background border border-border rounded-lg p-4 min-h-[120px]'>
              <p className='text-foreground whitespace-pre-wrap'>
                {reflection.improvement}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectionViewPage;
