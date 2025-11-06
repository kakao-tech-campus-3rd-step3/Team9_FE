import { HelpCircle, Circle, CheckCircle2, Clock } from 'lucide-react';
import { SectionCard, DashboardEmpty } from '../common';
import { ListItemSkeleton } from '@/components/common';
import type { RecentQuizItem } from '@/services/studies/getRecentQuizzes';
import { cn } from '../../utils';

interface QuizWidgetProps {
  data?: RecentQuizItem[];
  isLoading?: boolean;
  onClick?: () => void;
  onItemClick?: (quizId: number) => void;
}

/**
 * 퀴즈 위젯 컴포넌트
 * - 최근 퀴즈 목록을 문서 위젯과 유사하게 표시
 * - 아이콘, 제목, 응시 여부 순으로 배열
 * - submission_status에 따라 상태 표시
 */
const QuizWidget = ({
  data,
  isLoading = false,
  onClick,
  onItemClick,
}: QuizWidgetProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'NOT_TAKEN':
        return {
          icon: Circle,
          text: '미응시',
          className: 'text-warning bg-warning/10 border-warning/20',
          iconClassName: 'text-warning',
        };
      case 'IN_PROGRESS':
        return {
          icon: Clock,
          text: '진행중',
          className: 'text-blue-600 bg-blue-50 border-blue-200',
          iconClassName: 'text-blue-600',
        };
      case 'COMPLETED':
        return {
          icon: CheckCircle2,
          text: '제출완료',
          className: 'text-success bg-success/10 border-success/20',
          iconClassName: 'text-success',
        };
      default:
        return {
          icon: Circle,
          text: '알 수 없음',
          className: 'text-muted-foreground bg-muted/10 border-muted/20',
          iconClassName: 'text-muted-foreground',
        };
    }
  };

  const normalized = (() => {
    if (data && data.length > 0) {
      return data.map((quiz) => ({
        id: quiz.quiz_id,
        title: quiz.quiz_title,
        status: quiz.submission_status,
        statusConfig: getStatusConfig(quiz.submission_status),
      }));
    }
    return [];
  })();

  return (
    <SectionCard icon={HelpCircle} title='퀴즈' onClick={onClick}>
      <div className='space-y-2'>
        {isLoading ? (
          <>
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
          </>
        ) : normalized.length === 0 ? (
          <DashboardEmpty
            icon={HelpCircle}
            title='퀴즈 항목 없음'
            description='현재 표시할 퀴즈가 없습니다'
            minHeightClass='min-h-[140px]'
            iconClassName='text-primary'
            iconWrapperClassName='bg-primary/20'
          />
        ) : (
          normalized.map((item) => {
            const StatusIcon = item.statusConfig.icon;
            return (
              <div
                key={item.id}
                className='flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-all duration-200 border border-border/50 hover:border-border bg-card cursor-pointer group'
                onClick={(e) => {
                  e.stopPropagation();
                  if (onItemClick) onItemClick(Number(item.id));
                }}
              >
                {/* 아이콘 */}
                <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                  <HelpCircle className='w-5 h-5 text-primary' />
                </div>

                {/* 제목 */}
                <div className='flex-1 min-w-0'>
                  <h4 className='font-semibold text-foreground text-sm line-clamp-1 mb-1 tracking-tight'>
                    {item.title}
                  </h4>
                </div>

                {/* 응시 여부 배지 */}
                <div
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium flex-shrink-0',
                    item.statusConfig.className,
                  )}
                >
                  <StatusIcon
                    className={cn(
                      'w-3.5 h-3.5',
                      item.statusConfig.iconClassName,
                    )}
                  />
                  <span>{item.statusConfig.text}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </SectionCard>
  );
};

export default QuizWidget;
