import { Calendar, Timer } from 'lucide-react';
import type { QuizType, SubmissionStatus } from '../types';
import QuizCardReady from './QuizCardReady';
import QuizCardCompleted from './QuizCardCompleted';
import QuizCardCreating from './QuizCardCreating';
import QuizCardFailed from './QuizCardFailed';

type QuizCardProps = {
  quizId: number;
  title: string;
  timeLimit: number;
  quiz_status: QuizType;
  submissionStatus: SubmissionStatus;
  score: number | null;
  quizCount: number | null;
};

const QuizCard = ({
  quizId,
  title,
  timeLimit,
  quiz_status,
  submissionStatus,
  score,
  quizCount,
}: QuizCardProps) => {
  if (quiz_status == 'GENERATING') {
    return <QuizCardCreating title={title} />;
  }
  if (quiz_status == 'FAILED') {
    return <QuizCardFailed title={title} />;
  }

  return (
    <div className='w-full p-4'>
      <div className='flex justify-between px-6 py-4 border border-primary rounded-lg  gap-3 bg-white'>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <h3 className='text-2xl text-primary font-bold'>{title}</h3>
          </div>
          <div className='flex gap-4'>
            <p className='flex gap-1 text-sm text-muted-foreground'>
              <Timer size={20} />
              {timeLimit}초
            </p>
            <p className='flex gap-1 text-sm text-muted-foreground'>
              <Calendar size={20} />
              2025-08-10
            </p>
          </div>
        </div>

        <div className='flex items-center'>
          {submissionStatus === 'NOT_TAKEN' && (
            <QuizCardReady quizId={quizId.toString()} />
          )}
          {submissionStatus === 'COMPLETED' &&
            score !== null &&
            quizCount !== null && (
              <QuizCardCompleted
                quizId={quizId}
                score={score}
                quizCount={quizCount}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
