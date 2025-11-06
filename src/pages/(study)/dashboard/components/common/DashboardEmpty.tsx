import type { LucideIcon } from 'lucide-react';

interface DashboardEmptyProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  minHeightClass?: string; // 예: min-h-[140px]
  iconClassName?: string; // 예: text-primary
  iconWrapperClassName?: string; // 예: bg-primary/20
}

const DashboardEmpty = ({
  icon: Icon,
  title,
  description,
  minHeightClass,
  iconClassName,
  iconWrapperClassName,
}: DashboardEmptyProps) => {
  return (
    <div className={`text-center py-8 space-y-3 ${minHeightClass ?? ''}`}>
      <div className='flex justify-center'>
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            iconWrapperClassName ?? 'bg-accent/20'
          }`}
        >
          <Icon
            className={`w-8 h-8 ${iconClassName ?? 'text-muted-foreground'}`}
          />
        </div>
      </div>
      <div>
        <p className='text-lg font-semibold text-foreground mb-1'>{title}</p>
        {description && (
          <p className='text-sm text-muted-foreground'>{description}</p>
        )}
      </div>
    </div>
  );
};

export default DashboardEmpty;
