import { Plus } from 'lucide-react';

/**
 * 스터디 로드맵 탭 컴포넌트
 * - 차시별 스터디 진행 상황을 타임라인 형태로 표시
 * - 차시 추가, 수정, 삭제, 완료 기능 제공
 */
export const StudyRoadmapTab = () => {
  // TODO: 실제 데이터로 교체 예정
  const sessions = [
    {
      id: 1,
      title: '1차시에 진행할 내용입니다.',
      isCompleted: false,
    },
    {
      id: 2,
      title: '2차시에 진행할 내용입니다.',
      isCompleted: false,
    },
    {
      id: 3,
      title: '3차시에 진행할 내용입니다.',
      isCompleted: false,
    },
    {
      id: 4,
      title: '4차시에 진행할 내용입니다.',
      isCompleted: false,
    },
  ];

  return (
    <div className='p-6'>
      {/* 헤더 */}
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-foreground'>스터디 로드맵</h2>
        <button className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'>
          <Plus className='w-4 h-4' />
          차시 추가하기
        </button>
      </div>

      {/* 타임라인 */}
      <div className='space-y-6'>
        {sessions.map((session, index) => (
          <div key={session.id} className='flex items-start gap-4'>
            {/* 차시 번호 */}
            <div className='flex flex-col items-center'>
              <div className='w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium'>
                {session.id}
              </div>
              {index < sessions.length - 1 && (
                <div className='w-0.5 h-16 bg-border mt-2'></div>
              )}
            </div>

            {/* 차시 내용 */}
            <div className='flex-1 bg-background border border-border rounded-lg p-4'>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='font-medium text-foreground'>{session.title}</h3>
                <div className='flex gap-2'>
                  <button className='text-sm text-muted-foreground hover:text-foreground'>
                    수정
                  </button>
                  <button className='text-sm text-destructive hover:text-destructive/80'>
                    삭제
                  </button>
                </div>
              </div>
              <div className='flex justify-end'>
                <button className='px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors'>
                  완료
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
