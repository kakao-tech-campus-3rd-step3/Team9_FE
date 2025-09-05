import { cn } from '../../utils';

interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 대시보드의 그리드 레이아웃을 담당하는 컴포넌트
 */
const DashboardGrid = ({ children, className }: DashboardGridProps) => {
  return (
    <div className={cn('p-4 max-w-7xl mx-auto space-y-4', className)}>
      {children}
    </div>
  );
};

export default DashboardGrid;
