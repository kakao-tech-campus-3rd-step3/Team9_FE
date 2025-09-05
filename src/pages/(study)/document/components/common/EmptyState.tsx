import { FileText } from 'lucide-react';
import { cn } from '@/pages/(study)/dashboard/utils';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * 빈 상태 컴포넌트
 */
const EmptyState = ({
  icon: Icon = FileText,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className,
      )}
    >
      <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4'>
        <Icon className='w-8 h-8 text-muted-foreground' />
      </div>
      <h3 className='text-lg font-semibold text-foreground mb-2'>{title}</h3>
      <p className='text-muted-foreground mb-6 max-w-md'>{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
