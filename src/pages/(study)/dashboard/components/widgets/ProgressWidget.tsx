import {
  TrendingUp,
  CalendarCheck2,
  HelpCircle,
  BookOpen,
  Clock,
} from 'lucide-react';
import { SectionCard, SkeletonBlock } from '../common';
import type { ProgressData } from '../../types';
import { cn } from '../../utils';

interface ProgressWidgetProps {
  data?: ProgressData;
  isLoading?: boolean;
  isError?: boolean;
  onClick?: () => void;
}

/**
 * 진척도 위젯 컴포넌트
 * - 참석/퀴즈/회고 지표를 시각화
 */
const ProgressWidget = ({
  data,
  isLoading = false,
  isError,
  onClick,
}: ProgressWidgetProps) => {
  if (isLoading) {
    return (
      <SectionCard icon={TrendingUp} title='진척도' onClick={onClick}>
        <SkeletonBlock minHeightClass='min-h-[160px]' />
      </SectionCard>
    );
  }

  if (isError) {
    return (
      <SectionCard icon={TrendingUp} title='진척도' onClick={onClick}>
        <div className='text-center py-8'>
          <p className='text-destructive font-medium'>
            진척도를 불러오지 못했어요.
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
      <SectionCard icon={TrendingUp} title='진척도' onClick={onClick}>
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>진척도 데이터가 없습니다.</p>
        </div>
      </SectionCard>
    );
  }

  const progressItems = [
    {
      label: '참석',
      current: data.attendance.current,
      total: data.attendance.total,
      percentage: data.attendance.percentage,
      icon: CalendarCheck2,
      color: 'bg-primary',
      textColor: 'text-primary',
    },
    {
      label: '퀴즈',
      current: data.quiz.current,
      total: data.quiz.total,
      percentage: data.quiz.percentage,
      icon: HelpCircle,
      color: 'bg-success',
      textColor: 'text-success',
    },
    {
      label: '회고',
      current: data.reflection.current,
      total: data.reflection.total,
      percentage: data.reflection.percentage,
      icon: BookOpen,
      color: 'bg-warning',
      textColor: 'text-warning',
    },
  ];

  return (
    <SectionCard icon={TrendingUp} title='진척도' onClick={onClick}>
      <div className='space-y-4'>
        {progressItems.map((item) => {
          const Icon = item.icon;
          const isComplete = item.current === item.total && item.total > 0;
          const isEmpty = item.total === 0;

          return (
            <div key={item.label} className='space-y-2'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Icon
                    className={cn(
                      'w-4 h-4',
                      isComplete ? item.textColor : 'text-muted-foreground',
                    )}
                  />
                  <span className='text-sm font-medium text-foreground'>
                    {item.label}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span
                    className={cn(
                      'text-sm font-bold',
                      isComplete ? item.textColor : 'text-foreground',
                    )}
                  >
                    {item.current}/{item.total}
                  </span>
                  {isEmpty ? (
                    <Clock className='w-3 h-3 text-muted-foreground' />
                  ) : (
                    <span
                      className={cn(
                        'text-xs font-medium',
                        isComplete ? item.textColor : 'text-muted-foreground',
                      )}
                    >
                      {item.percentage}%
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {!isEmpty && (
                <div className='w-full h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      item.color,
                      isComplete ? 'opacity-100' : 'opacity-70',
                    )}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              )}

              {isEmpty && <div className='w-full h-2 bg-muted rounded-full' />}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default ProgressWidget;
