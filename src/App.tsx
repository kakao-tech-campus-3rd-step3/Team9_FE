import { Router } from '@/routes';
import ErrorBoundary from '@/components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}

export default App;
