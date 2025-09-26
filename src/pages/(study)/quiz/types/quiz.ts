export type QuizType = 'CREATING' | 'READY' | 'FAILED' | 'COMPLETED';

export type Quiz = {
  quizId: number;
  title: string;
  description: string;
  timeLimit: number;
  status: QuizType;
  score: number | null;
  quizCount: number | null;
};

export type TotalCount = number;
