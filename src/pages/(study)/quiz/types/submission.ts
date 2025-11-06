export type ChoiceResult = {
  choice_id: number;
  choice_text: string;
  is_correct_answer: boolean;
  was_user_choice: boolean;
};

export type QuestionResult = {
  question_id: number;
  question_type: string; // e.g. 'SHORT_ANSWER', 'MULTIPLE_CHOICE'
  question_text: string;
  is_correct: boolean;
  user_answer: string;
  correct_answer?: string;
  explanation?: string;
  choices?: ChoiceResult[];
};

export type QuizSubmissionPayload = {
  submission_id?: number; // optional when creating
  score: number;
  total_questions: number;
  results: QuestionResult[];
};
