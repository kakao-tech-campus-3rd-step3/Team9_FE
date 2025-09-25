import { Folder, FileText, ClipboardList, User } from 'lucide-react';

/**
 * 개인별 현황판 탭 컴포넌트
 * - 참여자별 진척도를 테이블 형태로 표시
 * - 스터디 자료, 출석, 퀴즈, 회고 메트릭 추적
 */
export const IndividualStatusTab = () => {
  // TODO: 실제 데이터로 교체 예정
  const participants = [
    {
      id: 1,
      name: '김경대',
      materials: 4,
      attendance: 5,
      quiz: { completed: 4, total: 10 },
      retrospective: { completed: 1, total: 2 },
    },
    {
      id: 2,
      name: '이영희',
      materials: 3,
      attendance: 4,
      quiz: { completed: 3, total: 10 },
      retrospective: { completed: 2, total: 2 },
    },
    {
      id: 3,
      name: '박민수',
      materials: 5,
      attendance: 6,
      quiz: { completed: 7, total: 10 },
      retrospective: { completed: 1, total: 2 },
    },
    {
      id: 4,
      name: '최지영',
      materials: 2,
      attendance: 3,
      quiz: { completed: 2, total: 10 },
      retrospective: { completed: 0, total: 2 },
    },
  ];

  return (
    <div className='p-6'>
      {/* 헤더 */}
      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-foreground mb-4'>
          개인별 현황판
        </h2>

        {/* 메트릭 헤더 */}
        <div className='grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground border-b border-border pb-3'>
          <div className='flex items-center gap-2'>
            <User className='w-4 h-4' />
            참여자
          </div>
          <div className='flex items-center gap-2'>
            <Folder className='w-4 h-4' />
            스터디 자료
          </div>
          <div className='flex items-center gap-2'>
            <Folder className='w-4 h-4' />
            출석
          </div>
          <div className='flex items-center gap-2'>
            <FileText className='w-4 h-4' />
            퀴즈
          </div>
          <div className='flex items-center gap-2'>
            <ClipboardList className='w-4 h-4' />
            회고
          </div>
        </div>
      </div>

      {/* 참여자 목록 */}
      <div className='space-y-3'>
        {participants.map((participant) => (
          <div
            key={participant.id}
            className='grid grid-cols-5 gap-4 py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer'
          >
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-muted rounded-full flex items-center justify-center'>
                <User className='w-4 h-4 text-muted-foreground' />
              </div>
              <span className='font-medium text-foreground'>
                {participant.name}
              </span>
            </div>
            <div className='flex items-center text-foreground'>
              {participant.materials}개
            </div>
            <div className='flex items-center text-foreground'>
              {participant.attendance}회
            </div>
            <div className='flex items-center text-foreground'>
              {participant.quiz.completed}/{participant.quiz.total}
            </div>
            <div className='flex items-center text-foreground'>
              {participant.retrospective.completed}/
              {participant.retrospective.total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
