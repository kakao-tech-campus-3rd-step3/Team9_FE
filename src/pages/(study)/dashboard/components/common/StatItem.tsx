import { cn } from '../../utils';

interface StatItemProps {
  value: string | number;
  label: string;
  className?: string;
}

/**
 * 통계 아이템을 표시하는 공통 컴포넌트
 */
const StatItem = ({ value, label, className }: StatItemProps) => {
  return (
    <div className={cn('text-center', className)}>
      <div className='flex items-center justify-center gap-2 mb-2'>
        <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center'>
          <span className='text-primary-foreground text-sm font-bold'>
            {value}
          </span>
        </div>
      </div>
      <div className='text-sm text-muted-foreground'>{label}</div>
    </div>
  );
};

export default StatItem;
