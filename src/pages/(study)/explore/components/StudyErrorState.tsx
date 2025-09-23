import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface StudyErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

/**
 * 스터디 목록 에러 상태 컴포넌트
 */
const StudyErrorState: React.FC<StudyErrorStateProps> = ({
  error,
  onRetry,
}) => {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <AlertCircle className='h-12 w-12 text-destructive mb-4' />
      <h3 className='text-lg font-semibold text-foreground mb-2'>
        스터디 목록을 불러올 수 없습니다
      </h3>
      <p className='text-sm text-muted-foreground mb-4'>
        {error.message || '일시적인 오류가 발생했습니다.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors'
        >
          <RefreshCw className='h-4 w-4 mr-2' />
          다시 시도
        </button>
      )}
    </div>
  );
};

export default StudyErrorState;
