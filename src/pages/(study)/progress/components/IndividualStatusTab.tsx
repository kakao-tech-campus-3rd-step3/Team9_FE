import { FileText, ClipboardList, Calendar, User } from 'lucide-react';
import { useStudyMemberStatusQuery } from '../hooks';
import { LoadingSpinner } from '@/components';
import type { ProgressMemberStatus } from '../types';

interface IndividualStatusTabProps {
  studyId: number;
}

/**
 * 개인별 현황판 탭 컴포넌트
 * - 참여자별 진척도를 테이블 형태로 표시
 * - 출석, 퀴즈, 회고 메트릭 추적
 */
export const IndividualStatusTab = ({ studyId }: IndividualStatusTabProps) => {
  const { data, isLoading, error } = useStudyMemberStatusQuery(studyId);

  const participants: ProgressMemberStatus[] =
    data?.progressMemberStatusDto || [];

  if (isLoading) {
    return (
      <div className='p-6 flex items-center justify-center h-full'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6 text-center'>
        <p className='text-destructive'>
          현황판을 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  return (
    <div className='p-6'>
      {/* 헤더 */}
      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-foreground mb-4'>
          개인별 현황판
        </h2>

        {/* 메트릭 헤더 */}
        <div className='grid grid-cols-4 text-sm font-medium text-muted-foreground border-b border-border pb-3'>
          <div className='flex items-center gap-2'>
            <User className='w-4 h-4' />
            참여자
          </div>
          <div className='text-center'>
            <div className='flex items-center justify-center gap-2'>
              <Calendar className='w-4 h-4' />
              출석
            </div>
          </div>
          <div className='text-center'>
            <div className='flex items-center justify-center gap-2'>
              <FileText className='w-4 h-4' />
              퀴즈
            </div>
          </div>
          <div className='text-center'>
            <div className='flex items-center justify-center gap-2'>
              <ClipboardList className='w-4 h-4' />
              회고
            </div>
          </div>
        </div>
      </div>

      {/* 참여자 목록 */}
      <div className='space-y-3'>
        {participants.length === 0 ? (
          <div className='text-center py-12 text-muted-foreground'>
            <User className='w-12 h-12 mx-auto mb-4 opacity-50' />
            <p className='text-lg font-medium'>참여자가 없습니다</p>
          </div>
        ) : (
          participants.map((participant, index) => (
            <div
              key={`${participant.nickname}-${index}`}
              className='grid grid-cols-4 py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors'
            >
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-muted rounded-full flex items-center justify-center'>
                  <User className='w-4 h-4 text-muted-foreground' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-medium text-foreground'>
                    {participant.nickname}
                  </span>
                  {participant.role === 'Leader' && (
                    <span className='text-xs text-primary'>리더</span>
                  )}
                </div>
              </div>
              <div className='text-center text-foreground'>
                {participant.attendance_count}회
              </div>
              <div className='text-center text-foreground'>
                {participant.quiz_count}
              </div>
              <div className='text-center text-foreground'>
                {participant.reflection_count ?? 0}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
