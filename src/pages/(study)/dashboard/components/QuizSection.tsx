import { HelpCircle } from 'lucide-react';
import { SectionCard } from './common';

interface QuizSectionProps {
  onClick: () => void;
}

const QuizSection = ({ onClick }: QuizSectionProps) => {
  return (
    <SectionCard icon={HelpCircle} title='퀴즈' onClick={onClick}>
      <div className='text-center py-8'></div>
    </SectionCard>
  );
};

export default QuizSection;
