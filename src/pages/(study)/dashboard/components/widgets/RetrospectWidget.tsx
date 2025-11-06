import { BookOpen, Calendar } from 'lucide-react';
import { SectionCard, DashboardEmpty, SkeletonBlock } from '../common';
import type { RetrospectData } from '../../types';

interface RetrospectWidgetProps {
  data?: RetrospectData;
  isLoading?: boolean;
  isError?: boolean;
  onClick?: () => void;
}

/**
 * 회고 위젯 컴포넌트
 * - 회고 작성 가능 일정 개수 표시
 * - 1개 이상이면 목록 노출, 없으면 "모두 완료" 표시
 */
const RetrospectWidget = ({
  data,
  isLoading = false,
  isError,
  onClick,
}: RetrospectWidgetProps) => {
  if (isLoading) {
    return (
      <SectionCard icon={BookOpen} title='회고' onClick={onClick}>
        <SkeletonBlock minHeightClass='min-h-[140px]' />
      </SectionCard>
    );
  }

  if (isError) {
    return (
      <SectionCard icon={BookOpen} title='회고' onClick={onClick}>
        <div className='text-center py-8'>
          <p className='text-destructive font-medium'>
            회고 일정을 불러오지 못했어요.
          </p>
          <p className='text-xs text-muted-foreground mt-1'>
            잠시 후 다시 시도해 주세요.
          </p>
        </div>
      </SectionCard>
    );
  }

  if (!data) {
    return (
      <SectionCard icon={BookOpen} title='회고' onClick={onClick}>
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>회고 데이터가 없습니다.</p>
        </div>
      </SectionCard>
    );
  }

  const { pendingSchedules } = data;
  const hasPending = pendingSchedules && pendingSchedules.length > 0;

  // 모두 완료된 경우
  if (!hasPending) {
    return (
      <SectionCard icon={BookOpen} title='회고' onClick={onClick}>
        <DashboardEmpty
          icon={BookOpen}
          title='모두 완료'
          description='작성할 회고가 없습니다'
          minHeightClass='min-h-[140px]'
          iconClassName='text-success'
          iconWrapperClassName='bg-success/20'
        />
      </SectionCard>
    );
  }

  // 회고 작성 가능 일정이 있는 경우
  const displaySchedules = pendingSchedules.slice(0, 3); // 최대 3개만 표시

  return (
    <SectionCard icon={BookOpen} title='회고' onClick={onClick}>
      <div className='space-y-4'>
        {/* 헤더 */}
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-lg font-bold text-foreground'>
              {pendingSchedules.length}개 남음
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              작성 가능한 회고
            </p>
          </div>
        </div>

        {/* 일정 목록 */}
        <div className='space-y-2'>
          {displaySchedules.map((schedule) => (
            <div
              key={schedule.id}
              className='flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors'
            >
              <div className='flex-shrink-0 mt-0.5'>
                <Calendar className='w-4 h-4 text-primary' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-foreground line-clamp-1'>
                  {schedule.title}
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  {schedule.date}
                </p>
              </div>
            </div>
          ))}

          {/* 더 많은 일정이 있는 경우 */}
          {pendingSchedules.length > 3 && (
            <div className='text-center pt-2'>
              <p className='text-xs text-muted-foreground'>
                +{pendingSchedules.length - 3}개 더 보기
              </p>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
};

export default RetrospectWidget;
