import { Router } from '@/routes';
import { AuthInitializer } from '@/components';

function App() {
  return (
    <AuthInitializer>
      <Router />
    </AuthInitializer>
  );
}

export default App;
