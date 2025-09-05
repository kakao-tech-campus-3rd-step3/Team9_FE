import { cn } from '../../utils';

interface DashboardRowProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}

/**
 * 대시보드의 행 레이아웃을 담당하는 컴포넌트
 */
const DashboardRow = ({ children, cols = 1, className }: DashboardRowProps) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={cn('grid gap-4', gridCols[cols], className)}>
      {children}
    </div>
  );
};

export default DashboardRow;
