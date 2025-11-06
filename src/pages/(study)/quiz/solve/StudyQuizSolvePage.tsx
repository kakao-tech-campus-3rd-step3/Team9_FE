import { SidebarHeader } from '../../components/layout/sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_PARAMS } from '@/constants';
// import type {
//   QuestionResult,
//   QuizSubmissionPayload,
// } from '../types/submission';

const TOTAL_QUESTIONS = 20;

const StudyQuizSolvePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const studyId = params[ROUTE_PARAMS.studyId] as string | undefined;
  const rawId = params['id'];

  // URL 파라미터 id가 없으면 초기값 1로 리다이렉트(대체)
  const current = rawId ? Number(rawId) || 1 : 1;

  const goToQuestion = (qNumber: number) => {
    if (!studyId) return;
    // replace: true로 history 쌓이지 않게 함
    navigate(
      `/${ROUTES.STUDY.ROOT}/${studyId}/${ROUTES.STUDY.QUIZ.ROOT}/solve/${qNumber}`,
      { replace: true },
    );
  };

  const handleSubmit = () => {
    if (!studyId) return;

    // TODO: replace this with real answers collected from form state
    // const results: QuestionResult[] = Array.from({
    //   length: TOTAL_QUESTIONS,
    // }).map((_, idx) => ({
    //   question_id: idx + 1,
    //   question_type: 'SHORT_ANSWER',
    //   question_text: `문제 ${idx + 1}`,
    //   is_correct: false,
    //   user_answer: '',
    //   correct_answer: undefined,
    //   explanation: undefined,
    //   choices: [],
    // }));

    // const payload: QuizSubmissionPayload = {
    //   // submission_id는 서버에서 발급될 수 있으므로 선택적
    //   score: 0,
    //   total_questions: TOTAL_QUESTIONS,
    //   results,
    // };

    // // NOTE: quizId is not present in current route structure; using '1' as placeholder.
    // // Adjust to actual quiz id if you have it in route or state.
    // submitMutation.mutate(
    //   { studyId, quizId: '1', payload },
    //   {
    //     onSuccess: () => {
    //       // 제출 후 메인 퀴즈 페이지로 이동
    //       navigate(
    //         `/${ROUTES.STUDY.ROOT}/${studyId}/${ROUTES.STUDY.QUIZ.ROOT}`,
    //         { replace: true },
    //       );
    //     },
    //   },
    // );
  };

  return (
    <div className='flex h-full'>
      <aside className='w-64 shrink-0 h-full bg-card border-r border-border overflow-y-auto'>
        <aside className='w-full bg-background border-r-2 border-border-primary relative z-20 flex flex-col h-full shadow-xl/40 overflow-x-hidden'>
          <div className='flex flex-col h-full'>
            <div className='flex-1 overflow-y-auto'>
              <SidebarHeader />
              <div className='p-4 grid grid-cols-5 gap-2 mt-8'>
                {Array.from({ length: TOTAL_QUESTIONS }).map((_, index) => {
                  const num = index + 1;
                  const isActive = num === current;
                  return (
                    <button
                      key={num}
                      type='button'
                      onClick={() => goToQuestion(num)}
                      className={`flex items-center justify-center p-1 cursor-pointer rounded-lg border ${
                        isActive
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-primary border-primary'
                      }`}
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
                className='w-full cursor-pointer font-medium px-4 py-2 bg-primary text-white rounded-lg'
                onClick={handleSubmit}
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
          <p className='mb-4'>현재 문제: {current}번</p>
          <div className='border border-border rounded p-4 bg-white'>
            <p>여기에 {current}번 문제 내용을 렌더하세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyQuizSolvePage;
