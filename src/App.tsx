import { Suspense } from 'react';
import { Router } from '@/routes';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner fullScreen message='로딩 중...' />}>
        <Router />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
