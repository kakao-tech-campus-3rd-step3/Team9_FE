import { useMutation } from '@tanstack/react-query';
import { submitQuizResults } from '@/services/quizzes';
import type { QuizSubmissionPayload } from '@/pages/(study)/quiz/types/submission';

type SubmitVariables = {
  studyId: string | number;
  quizId: string | number;
  payload: QuizSubmissionPayload;
};

/**
 * Hook: submit quiz results mutation
 * Usage:
 * const mutation = useSubmitQuizMutation();
 * mutation.mutate({ studyId, quizId, payload });
 */
export const useSubmitQuizMutation = () => {
  return useMutation({
    mutationFn: ({ studyId, quizId, payload }: SubmitVariables) =>
      submitQuizResults(studyId, quizId, payload),
  });
};

export default useSubmitQuizMutation;
