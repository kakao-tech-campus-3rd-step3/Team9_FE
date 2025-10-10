import { Filter, Check, X } from 'lucide-react';
import { cn } from '@/pages/(study)/dashboard/utils';
import { formatWeekName } from '../utils';
import type { Material } from '../types';

interface WeekFilterProps {
  materials: Material[];
  selectedWeeks: string[];
  onWeekChange: (weeks: string[]) => void;
}

/**
 * 주차별 다중 선택 필터 컴포넌트
 */
const WeekFilter = ({
  materials,
  selectedWeeks,
  onWeekChange,
}: WeekFilterProps) => {
  const availableWeeks = Array.from(new Set(materials.map((m) => m.week)))
    .sort((a, b) => a - b)
    .map((w) => `week${w}`);

  const getWeekCount = (week: string) => {
    const weekNumber = parseInt(week.replace('week', ''));
    return materials.filter((material) => material.week === weekNumber).length;
  };

  const handleWeekToggle = (week: string) => {
    if (selectedWeeks.includes(week)) {
      onWeekChange(selectedWeeks.filter((w) => w !== week));
    } else {
      onWeekChange([...selectedWeeks, week]);
    }
  };

  const handleSelectAll = () => {
    onWeekChange(
      selectedWeeks.length === availableWeeks.length ? [] : [...availableWeeks],
    );
  };

  const isAllSelected = selectedWeeks.length === availableWeeks.length;
  const isPartiallySelected =
    selectedWeeks.length > 0 && selectedWeeks.length < availableWeeks.length;

  return (
    <div className='w-56 bg-background border-r border-border h-full overflow-y-auto'>
      <div className='p-5 border-b border-border'>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2'>
            <div className='p-1.5 bg-primary/10 rounded-lg'>
              <Filter className='w-4 h-4 text-primary' />
            </div>
            <h3 className='text-base font-bold text-foreground'>주차별 필터</h3>
          </div>
          {selectedWeeks.length > 0 && (
            <button
              onClick={() => onWeekChange([])}
              className='p-1.5 hover:bg-accent rounded-lg transition-colors'
              aria-label='모든 선택 해제'
            >
              <X className='w-4 h-4 text-muted-foreground hover:text-foreground' />
            </button>
          )}
        </div>
        <div className='flex items-center gap-2 text-sm'>
          <span className='text-muted-foreground'>총</span>
          <span className='px-2 py-1 bg-primary/10 text-primary rounded-md font-semibold'>
            {materials.length}개
          </span>
          {selectedWeeks.length > 0 && (
            <>
              <span className='text-muted-foreground'>•</span>
              <span className='px-2 py-1 bg-secondary/20 text-secondary-foreground rounded-md font-semibold'>
                {selectedWeeks.length}개 선택
              </span>
            </>
          )}
        </div>
      </div>

      <div className='p-4 space-y-3'>
        {/* 전체 선택 */}
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200',
            'hover:bg-accent/50 border border-transparent hover:border-accent/30',
            isAllSelected && 'bg-primary/5 border-primary/20',
          )}
          onClick={handleSelectAll}
        >
          <div
            className={cn(
              'w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200',
              isAllSelected
                ? 'bg-primary border-primary shadow-sm'
                : isPartiallySelected
                  ? 'bg-primary/20 border-primary/50'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5',
            )}
          >
            {isAllSelected && (
              <Check className='w-3.5 h-3.5 text-primary-foreground' />
            )}
            {isPartiallySelected && (
              <div className='w-2.5 h-0.5 bg-primary rounded-full' />
            )}
          </div>
          <span
            className={cn(
              'text-sm font-semibold flex-1',
              isAllSelected ? 'text-primary' : 'text-foreground',
            )}
          >
            전체
          </span>
          <span
            className={cn(
              'text-xs px-2.5 py-1 rounded-lg font-semibold',
              isAllSelected
                ? 'bg-primary/10 text-primary'
                : 'bg-muted/50 text-muted-foreground',
            )}
          >
            {materials.length}
          </span>
        </div>

        {/* 주차별 필터 */}
        {availableWeeks.map((week) => {
          const isSelected = selectedWeeks.includes(week);
          return (
            <div
              key={week}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200',
                'hover:bg-accent/50 border border-transparent hover:border-accent/30',
                isSelected && 'bg-primary/5 border-primary/20',
              )}
              onClick={() => handleWeekToggle(week)}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200',
                  isSelected
                    ? 'bg-primary border-primary shadow-sm'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5',
                )}
              >
                {isSelected && (
                  <Check className='w-3.5 h-3.5 text-primary-foreground' />
                )}
              </div>
              <span
                className={cn(
                  'text-sm font-semibold flex-1',
                  isSelected ? 'text-primary' : 'text-foreground',
                )}
              >
                {formatWeekName(week)}
              </span>
              <span
                className={cn(
                  'text-xs px-2.5 py-1 rounded-lg font-semibold',
                  isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted/50 text-muted-foreground',
                )}
              >
                {getWeekCount(week)}
              </span>
            </div>
          );
        })}

        {availableWeeks.length === 0 && (
          <div className='px-3 py-6 text-center text-muted-foreground text-sm'>
            자료가 없습니다
          </div>
        )}
      </div>
    </div>
  );
};

export default WeekFilter;
