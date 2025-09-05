import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils';

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
  borderColor?: string;
  className?: string;
}

/**
 * 대시보드 섹션들의 공통 카드 컴포넌트
 */
const SectionCard = ({
  icon: Icon,
  title,
  children,
  onClick,
  borderColor = 'border-border',
  className,
}: SectionCardProps) => {
  const CardComponent = onClick ? 'div' : 'div';
  const cardProps = onClick
    ? {
        onClick,
        className: cn(
          'cursor-pointer group hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 transition-all duration-200 active:scale-[0.98]',
          className,
        ),
      }
    : { className };

  return (
    <CardComponent
      className={cn(
        'bg-card rounded-xl p-5 shadow-sm border-2',
        borderColor,
        cardProps.className,
      )}
      {...(onClick ? { onClick } : {})}
    >
      <div className='flex items-center gap-3 mb-3'>
        <Icon className='w-7 h-7 text-primary' />
        <h3 className='text-2xl font-semibold text-foreground'>{title}</h3>
      </div>
      {children}
    </CardComponent>
  );
};

export default SectionCard;
