import { BookOpen } from 'lucide-react';
import { SectionCard } from './common';

interface RetrospectSectionProps {
  onClick: () => void;
}

const RetrospectSection = ({ onClick }: RetrospectSectionProps) => {
  return (
    <SectionCard icon={BookOpen} title='회고' onClick={onClick}>
      <div className='text-center py-8'></div>
    </SectionCard>
  );
};

export default RetrospectSection;
