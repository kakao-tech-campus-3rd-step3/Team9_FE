// 클래스명 조합 유틸리티
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface SkeletonProps {
  /** 스켈레톤의 클래스명 */
  className?: string;
}

/**
 * 기본 스켈레톤 컴포넌트
 */
export const Skeleton = ({ className }: SkeletonProps) => {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />;
};

/**
 * 텍스트 스켈레톤
 */
export const SkeletonText = ({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  );
};

/**
 * 카드 스켈레톤
 */
export const SkeletonCard = ({ className }: SkeletonProps) => {
  return (
    <div className={cn('rounded-lg border p-4 space-y-3', className)}>
      <Skeleton className='h-4 w-1/2' />
      <SkeletonText lines={2} />
      <div className='flex items-center space-x-2'>
        <Skeleton className='h-8 w-8 rounded-full' />
        <Skeleton className='h-4 w-20' />
      </div>
    </div>
  );
};

/**
 * 아바타 스켈레톤
 */
export const SkeletonAvatar = ({
  size = 'medium',
  className,
}: {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-10 w-10',
    large: 'h-12 w-12',
  };

  return (
    <Skeleton className={cn('rounded-full', sizeClasses[size], className)} />
  );
};

/**
 * 테이블 스켈레톤
 */
export const SkeletonTable = ({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* 헤더 */}
      <div className='flex space-x-4'>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className='h-4 flex-1' />
        ))}
      </div>

      {/* 행들 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className='flex space-x-4'>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn('h-4', colIndex === 0 ? 'w-16' : 'flex-1')}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * 리스트 아이템 스켈레톤
 */
export const SkeletonListItem = ({ className }: SkeletonProps) => {
  return (
    <div className={cn('flex items-center space-x-3 p-3', className)}>
      <SkeletonAvatar size='medium' />
      <div className='flex-1 space-y-2'>
        <Skeleton className='h-4 w-1/3' />
        <Skeleton className='h-3 w-1/2' />
      </div>
    </div>
  );
};
