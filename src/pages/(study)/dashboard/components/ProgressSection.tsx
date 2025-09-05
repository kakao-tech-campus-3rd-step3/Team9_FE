import { TrendingUp } from 'lucide-react';
import { SectionCard } from './common';

interface ProgressSectionProps {
  onClick: () => void;
}

const ProgressSection = ({ onClick }: ProgressSectionProps) => {
  return (
    <SectionCard icon={TrendingUp} title='진척도' onClick={onClick}>
      <div className='text-center py-8'></div>
    </SectionCard>
  );
};

export default ProgressSection;
