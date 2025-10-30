import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

/**
 * 에러 바운더리 컴포넌트
 * - React Query의 에러와 일반적인 React 에러를 처리
 */
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            resetError={this.resetError}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error!}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * 기본 에러 폴백 컴포넌트
 */
const DefaultErrorFallback: React.FC<{
  error: Error;
  resetError: () => void;
}> = ({ error, resetError }) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[200px] p-6 text-center'>
      <AlertTriangle className='w-12 h-12 text-destructive mb-4' />
      <h3 className='text-lg font-semibold text-foreground mb-2'>
        문제가 발생했습니다
      </h3>
      <p className='text-sm text-muted-foreground mb-4 max-w-md'>
        {error.message || '예상치 못한 오류가 발생했습니다.'}
      </p>
      <button
        onClick={resetError}
        className='inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
      >
        <RefreshCw className='w-4 h-4' />
        다시 시도
      </button>
    </div>
  );
};

export default ErrorBoundary;
