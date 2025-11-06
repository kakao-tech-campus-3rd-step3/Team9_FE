import { HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { SectionCard, DashboardEmpty, SkeletonBlock } from '../common';
import type { QuizData } from '../../types';

interface QuizWidgetProps {
  data?: QuizData;
  isLoading?: boolean;
  onClick?: () => void;
}

/**
 * 퀴즈 위젯 컴포넌트
 * - 미응시(안 푼) 퀴즈 개수 표시
 * - 없으면 "모두 완료" 상태 표시
 */
const QuizWidget = ({ data, isLoading = false, onClick }: QuizWidgetProps) => {
  // 로딩: 일관된 스켈레톤 UI
  if (isLoading) {
    return (
      <SectionCard icon={HelpCircle} title='퀴즈' onClick={onClick}>
        <SkeletonBlock minHeightClass='min-h-[140px]' />
      </SectionCard>
    );
  }

  // 빈 데이터: 회고 위젯과 유사한 친화적 빈 상태
  if (!data) {
    return (
      <SectionCard icon={HelpCircle} title='퀴즈' onClick={onClick}>
        <DashboardEmpty
          icon={HelpCircle}
          title='퀴즈 항목 없음'
          description='현재 표시할 퀴즈가 없습니다'
          minHeightClass='min-h-[140px]'
          iconClassName='text-primary'
          iconWrapperClassName='bg-primary/20'
        />
      </SectionCard>
    );
  }

  const { pendingCount, totalCount } = data;
  const isAllComplete = totalCount > 0 && pendingCount === 0;

  // 총 퀴즈가 0개인 경우: 다른 위젯과 동일하게 아이콘 포함 빈 상태 표시
  if (totalCount === 0) {
    return (
      <SectionCard icon={HelpCircle} title='퀴즈' onClick={onClick}>
        <DashboardEmpty
          icon={HelpCircle}
          title='퀴즈 항목 없음'
          description='현재 표시할 퀴즈가 없습니다'
          minHeightClass='min-h-[140px]'
          iconClassName='text-primary'
          iconWrapperClassName='bg-primary/20'
        />
      </SectionCard>
    );
  }

  // 모두 완료된 경우
  if (isAllComplete) {
    return (
      <SectionCard icon={HelpCircle} title='퀴즈' onClick={onClick}>
        <div className='text-center py-8 space-y-3'>
          <div className='flex justify-center'>
            <div className='w-16 h-16 bg-success/20 rounded-full flex items-center justify-center'>
              <CheckCircle2 className='w-8 h-8 text-success' />
            </div>
          </div>
          <div>
            <p className='text-lg font-semibold text-foreground mb-1'>
              모두 완료
            </p>
            <p className='text-sm text-muted-foreground'>
              모든 퀴즈를 완료했습니다
            </p>
          </div>
        </div>
      </SectionCard>
    );
  }

  // 미응시 퀴즈가 있는 경우
  return (
    <SectionCard icon={HelpCircle} title='퀴즈' onClick={onClick}>
      <div className='text-center py-8 space-y-4'>
        <div className='flex justify-center'>
          <div className='w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center'>
            <AlertCircle className='w-10 h-10 text-warning' />
          </div>
        </div>
        <div>
          <p className='text-4xl font-bold text-warning mb-2'>{pendingCount}</p>
          <p className='text-lg font-semibold text-foreground mb-1'>
            미응시 퀴즈
          </p>
          <p className='text-sm text-muted-foreground'>
            {totalCount > 0 && `총 ${totalCount}개 중 ${pendingCount}개 남음`}
          </p>
        </div>
      </div>
    </SectionCard>
  );
};

export default QuizWidget;
