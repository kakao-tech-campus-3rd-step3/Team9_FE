import { SidebarHeader } from '../../components/layout/sidebar';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ROUTES, ROUTE_PARAMS } from '@/constants';
import { useQuizStart } from './hooks/useQuizStart';

import { usePatchAnswer } from '../hooks/usePatchAnswer';
import { useQuizComplete } from '../hooks/useQuizCompete';

const StudyQuizSolvePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // params.id is treated as quiz_id (not question number)
  const quizIdParam = params['id'];
  const quizId = quizIdParam ? Number(quizIdParam) : undefined;

  const { data: quizData } = useQuizStart({ quiz_id: quizId ?? 0 });
  const studyId = params[ROUTE_PARAMS.studyId] as string | undefined;

  const qParam = searchParams.get('quiz');
  const current = qParam ? Number(qParam) || 1 : 1;

  const totalQuestions = quizData?.questions?.length ?? 0;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [remainingTime, setRemainingTime] = useState<number>(() => {
    return quizData?.remaining_seconds ?? quizData?.time_limit_seconds ?? 0;
  });

  useEffect(() => {
    const initial =
      quizData?.remaining_seconds ?? quizData?.time_limit_seconds ?? 0;
    setRemainingTime(initial);

    const id = setInterval(() => {
      setRemainingTime((time) => (time > 0 ? time - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, [quizData?.remaining_seconds, quizData?.time_limit_seconds]);

  const currentQuestion = quizData?.questions?.[current - 1];

  const { mutate: completeQuiz, isPending: isCompleting } = useQuizComplete({
    study_id: Number(studyId),
  });
  const { mutate: patchAnswer } = usePatchAnswer({ study_id: Number(studyId) });

  useEffect(() => {
    return () => {
      const answerPayload = quizData?.questions.map((question) => ({
        question_id: question.question_id,
        user_answer: answers[question.question_id] || '',
      }));
      patchAnswer({
        submissionId: quizData?.submission_id ?? 0,
        answers: answerPayload,
      });
    };
  }, [patchAnswer, quizData?.submission_id, quizData?.questions, answers]);

  const goToQuestion = (qNumber: number) => {
    if (!studyId || !quizIdParam) return;
    // update query param 'quiz' with replace to avoid stacking history
    setSearchParams({ quiz: String(qNumber) }, { replace: true });
  };

  const handleSubmit = () => {
    if (!studyId) return;
    const submission_id = quizData?.submission_id;
    if (!submission_id) {
      alert('제출 정보를 찾을 수 없습니다. 다시 시도해주세요.');
      return;
    }

    const answerPayload = quizData?.questions.map((question) => ({
      question_id: question.question_id,
      user_answer: answers[question.question_id] || '',
    }));

    completeQuiz(
      {
        submission_id,
        answers: answerPayload,
      },
      {
        onSuccess: () => {
          navigate(
            `/${ROUTES.STUDY.ROOT}/${studyId}/${ROUTES.STUDY.QUIZ.ROOT}`,
            {
              replace: true,
            },
          );
        },
      },
    );
  };

  return (
    <div className='flex h-full'>
      <aside className='w-64 shrink-0 h-full bg-card border-r border-border overflow-y-auto'>
        <aside className='w-full bg-background border-r-2 border-border-primary relative z-20 flex flex-col h-full shadow-xl/40 overflow-x-hidden'>
          <div className='flex flex-col h-full'>
            <div className='flex-1 overflow-y-auto'>
              <SidebarHeader />
              <div className='p-4 grid grid-cols-5 gap-2 mt-8'>
                {Array.from({ length: totalQuestions || 1 }).map((_, index) => {
                  const num = index + 1;
                  const isActive = num === current;
                  const question = quizData?.questions?.[index];
                  const questionId = question?.question_id;
                  const isAnswered =
                    questionId !== undefined &&
                    answers[questionId] !== undefined;
                  let btnClass =
                    'flex items-center justify-center p-1 cursor-pointer rounded-lg border ';
                  if (isActive)
                    btnClass += 'bg-primary text-white border-primary';
                  if (isAnswered)
                    btnClass +=
                      'bg-success text-success-foreground border-success';
                  else btnClass += 'bg-white text-primary border-primary';
                  return (
                    <button
                      key={num}
                      type='button'
                      onClick={() => goToQuestion(num)}
                      className={btnClass}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className=' flex items-center justify-center m-4'>
              <button
                type='button'
                className={`w-full cursor-pointer font-medium px-4 py-2 bg-primary text-white rounded-lg ${
                  isCompleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleSubmit}
                disabled={isCompleting}
              >
                제출
              </button>
            </div>
          </div>
        </aside>
      </aside>
      <div className='h-full flex flex-col bg-background flex-1'>
        <div className='flex items-center justify-between px-6 py-6 border-b border-border bg-background'>
          <h1 className='text-2xl font-bold text-primary'>퀴즈</h1>
        </div>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <p className='text-lg font-semibold'>
              {quizData?.quiz_title ?? '퀴즈'}
            </p>
            <p className='text-sm'>남은 시간: {remainingTime}초</p>
          </div>

          <div className='border border-border rounded mt-8 p-4 bg-white'>
            <p className='mb-4 font-bold'>
              {current}. {currentQuestion?.question_text ?? ''}
            </p>

            {currentQuestion?.question_type === 'MULTIPLE_CHOICE' &&
              currentQuestion?.choices &&
              currentQuestion.choices.length > 0 && (
                <div className='grid grid-cols-1 gap-2'>
                  {currentQuestion.choices.map((c, i) => {
                    const selected =
                      answers[currentQuestion.question_id] ===
                      String(c.choice_id);
                    return (
                      <button
                        key={c.choice_id}
                        type='button'
                        onClick={() =>
                          setAnswers((s) => ({
                            ...s,
                            [currentQuestion.question_id]: String(c.choice_id),
                          }))
                        }
                        className={`text-left font-medium p-3 rounded border border-primary ${selected ? 'bg-primary text-white' : 'bg-white'}`}
                      >
                        {i + 1}. {c.choice_text}
                      </button>
                    );
                  })}
                </div>
              )}
            {currentQuestion?.question_type === 'SHORT_ANSWER' && (
              <div>
                <textarea
                  className='w-full border border-border rounded p-3'
                  rows={4}
                  value={answers[currentQuestion.question_id] || ''}
                  onChange={(e) =>
                    setAnswers((s) => ({
                      ...s,
                      [currentQuestion.question_id]: e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyQuizSolvePage;
