export type SubmissionStatus = 'NOT_TAKEN' | 'IN_PROGRESS' | 'COMPLETED';
export type QuizType = 'ACTIVE' | 'GENERATING' | 'FAILED';

export type Quiz = {
  quiz_id: number;
  title: string;
  description: string;
  created_by: string;
  question_count: number;
  time_limit_seconds: number;
  quiz_status: QuizType;
  submission_status: SubmissionStatus;
  score: number | null;
  submission_id: number;
};

export type TotalCount = number;
