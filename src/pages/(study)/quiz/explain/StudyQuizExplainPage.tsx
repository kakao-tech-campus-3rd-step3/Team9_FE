import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_PARAMS } from '@/constants';
import { useQuizResult } from './hooks/useQuizResult';

type ChoiceResult = {
  choice_id: number;
  choice_text: string;
  is_correct_answer: boolean;
  was_user_choice: boolean;
};

type QuestionResult = {
  question_id: number;
  question_type: string;
  question_text: string;
  is_correct: boolean;
  user_answer: string;
  correct_answer?: string;
  explanation?: string;
  choices?: ChoiceResult[];
};

type Submission = {
  submission_id?: number;
  score: number;
  total_questions: number;
  results: QuestionResult[];
};

const sample: Submission = {
  submission_id: 1,
  score: 7,
  total_questions: 10,
  results: [
    {
      question_id: 1,
      question_type: 'SHORT_ANSWER',
      question_text: '자바에서 상속을 지원하는 키워드는?',
      is_correct: true,
      user_answer: '8',
      correct_answer: 'extends',
      explanation: '자바에서는 extends 키워드를 사용하여 상속합니다.',
      choices: [
        {
          choice_id: 1,
          choice_text: 'extends',
          is_correct_answer: true,
          was_user_choice: true,
        },
      ],
    },
  ],
};

const StudyQuizExplainPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const studyId = params[ROUTE_PARAMS.studyId] as string | undefined;
  // route may provide submission id under different param names depending on route config
  const submissionParam = params[ROUTE_PARAMS.submissionId] ?? params['id'];
  const submissionId = submissionParam as string | undefined;
  const { data: submission } = useQuizResult({
    submission_id: Number(submissionId),
  });

  const payload =
    (submission as Submission) ||
    ((location.state &&
      (location.state as unknown as { submission?: Submission })
        .submission) as Submission) ||
    sample;

  return (
    <div className='h-full flex flex-col bg-background'>
      <div className='flex items-center justify-between px-6 py-6 border-b border-border bg-background'>
        <h1 className='text-2xl font-bold text-primary'>퀴즈 해설</h1>
        <div>
          <button
            className='text-sm text-primary underline'
            onClick={() => {
              if (!studyId) return;
              navigate(
                `/${ROUTES.STUDY.ROOT}/${studyId}/${ROUTES.STUDY.QUIZ.ROOT}`,
                { replace: true },
              );
            }}
          >
            퀴즈 페이지로
          </button>
        </div>
      </div>

      <div className='p-6'>
        <div className='mb-4 text-right'>
          <strong>점수:</strong> {payload.score} / {payload.total_questions}
        </div>

        <div className='space-y-4 '>
          {payload.results.map((r: QuestionResult, i: number) => (
            <div
              key={r.question_id}
              className='p-6 border border-border rounded bg-white'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-medium'>
                    문제 {i + 1}. {r.question_text}
                  </h3>
                </div>
                <span
                  className={`shrink-0 text-sm font-medium ${r.is_correct ? 'text-green-600' : 'text-red-600'}`}
                >
                  {r.is_correct ? '정답' : '오답'}
                </span>
              </div>

              {r.choices && r.choices.length > 0 && (
                <ul className='mt-3 grid grid-cols-1 gap-2'>
                  {r.choices.map((c: ChoiceResult, ci: number) => {
                    const isUserWrong =
                      c.was_user_choice && !c.is_correct_answer;
                    const liClass = `p-3 rounded border ${c.is_correct_answer ? 'border-green-400 bg-green-50' : isUserWrong ? 'border-red-400 bg-red-50' : 'border-border bg-white'}`;
                    const badgeClass = `text-sm ${c.was_user_choice ? (c.is_correct_answer ? 'text-green-600' : 'text-red-600') : 'text-muted'}`;

                    return (
                      <li key={c.choice_id} className={liClass}>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm'>
                            {ci + 1}. {c.choice_text}
                          </span>
                          <span className={badgeClass}>
                            {c.was_user_choice ? '내 답안' : ''}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className='mt-3 text-sm'>
                {r.question_type === 'SHORT_ANSWER' && (
                  <div>
                    <p>
                      <strong>내 답안:</strong> {r.user_answer}
                    </p>
                    <p>
                      <strong>정답:</strong>{' '}
                      {r.correct_answer ? r.correct_answer : '없음'}
                    </p>
                  </div>
                )}
                {r.explanation && (
                  <div className='mt-2 text-sm'>
                    <strong>해설:</strong> {r.explanation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyQuizExplainPage;
