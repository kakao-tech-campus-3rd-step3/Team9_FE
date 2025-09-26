interface LoadingSpinnerProps {
  // 로딩 메시지 (옵션)
  message?: string;
  // 전체 화면 여부 (기본값: false)
  fullScreen?: boolean;
  // 스피너 크기 (기본값: medium)
  size?: 'small' | 'medium' | 'large';
  // 컨테이너 클래스명 (옵션)
  className?: string;
}

/**
 * 로딩 스피너 컴포넌트
 */
const LoadingSpinner = ({
  message,
  fullScreen = false,
  size = 'medium',
  className = '',
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8',
  };

  const containerClasses = fullScreen
    ? 'flex items-center justify-center min-h-screen bg-background'
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className='flex flex-col items-center space-y-4'>
        <div
          className={`inline-block animate-spin rounded-full border-2 border-primary border-t-transparent align-[-0.125em] ${sizeClasses[size]}`}
          aria-label={message || '로딩 중'}
        />
        {message && (
          <p className='text-sm text-muted-foreground font-medium'>{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
