import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_PARAMS } from '@/constants';

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
  const submissionId = params[ROUTE_PARAMS.submissionId] as string | undefined;

  const payload =
    ((location.state &&
      (location.state as unknown as { submission?: Submission })
        .submission) as Submission) || sample;

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
        <div className='mb-4'>
          <strong>제출 ID:</strong> {submissionId ?? payload.submission_id}
        </div>
        <div className='mb-4'>
          <strong>점수:</strong> {payload.score} / {payload.total_questions}
        </div>

        <div className='space-y-4'>
          {payload.results.map((r: QuestionResult) => (
            <div
              key={r.question_id}
              className='p-4 border border-border rounded bg-white'
            >
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium text-primary'>
                  문제 {r.question_id}
                </h3>
                <span
                  className={`text-sm font-medium ${r.is_correct ? 'text-green-600' : 'text-red-600'}`}
                >
                  {r.is_correct ? '정답' : '오답'}
                </span>
              </div>
              <p className='mt-2 text-sm'>{r.question_text}</p>

              {r.choices && r.choices.length > 0 && (
                <ul className='mt-3 grid grid-cols-1 gap-2'>
                  {r.choices.map((c: ChoiceResult) => (
                    <li
                      key={c.choice_id}
                      className={`p-2 rounded border ${c.is_correct_answer ? 'border-green-400 bg-green-50' : 'border-border bg-white'}`}
                    >
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>{c.choice_text}</span>
                        <span className='text-xs text-muted'>
                          {c.was_user_choice ? '선택됨' : ''}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className='mt-3 text-sm'>
                <div>
                  <strong>사용자 응답:</strong> {r.user_answer || '-'}
                </div>
                <div>
                  <strong>정답:</strong> {r.correct_answer ?? '-'}
                </div>
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
