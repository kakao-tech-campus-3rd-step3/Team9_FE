import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES, ROUTE_BUILDERS, ROUTE_PARAMS } from '@/constants';
import { ArrowLeft, Edit, Calendar, User, Trash2 } from 'lucide-react';
import {
  useReflectionDetailQuery,
  useDeleteReflectionMutation,
  useReflectionsQuery,
} from './hooks';
import { LoadingSpinner } from '@/components/common';
import { useAuthUserSuspense } from '@/hooks/useAuthUserSuspense';
import ConfirmDialog from '@/pages/(study)/document/components/ConfirmDialog';

/**
 * 회고 읽기 전용 상세보기 페이지
 */
const ReflectionViewPage = () => {
  const navigate = useNavigate();
  const { [ROUTE_PARAMS.reflectionId]: reflection_id, study_id } = useParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const studyId = study_id ? Number(study_id) : 0;
  const reflectionId = reflection_id ? Number(reflection_id) : 0;

  // API로 회고 상세 조회
  const {
    data: reflection,
    isLoading,
    error,
  } = useReflectionDetailQuery(studyId, reflectionId);

  // 목록 조회로 작성자 이름 가져오기 (캐시 활용)
  const { data: reflectionsList } = useReflectionsQuery(studyId, {
    page: 0,
    size: 100, // 충분히 큰 수로 설정하여 해당 회고를 찾을 수 있도록
  });

  // 작성자 이름 찾기
  const authorName = useMemo(() => {
    if (!reflectionsList?.reflections || !reflectionId) return null;
    const found = reflectionsList.reflections.find(
      (r) => r.id === reflectionId,
    );
    return found?.author || null;
  }, [reflectionsList, reflectionId]);

  // 삭제 Mutation
  const deleteMutation = useDeleteReflectionMutation(studyId);

  // 현재 사용자 정보
  const { user } = useAuthUserSuspense();

  // 작성자 확인 (작성자 이름과 현재 사용자 닉네임 비교)
  const isAuthor = useMemo(() => {
    if (!authorName || !user?.nickname) return false;
    return authorName === user.nickname;
  }, [authorName, user?.nickname]);

  const handleEdit = () => {
    if (!study_id || !reflection_id) return;
    navigate(
      `${ROUTE_BUILDERS.study.root(study_id)}/${ROUTES.STUDY.REFLECTION}/${reflection_id}/edit`,
    );
  };

  const handleBack = () => {
    if (!study_id) return;
    navigate(
      `${ROUTE_BUILDERS.study.root(study_id)}/${ROUTES.STUDY.REFLECTION}`,
    );
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(reflectionId, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        handleBack();
      },
    });
  };

  if (isLoading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !reflection) {
    return (
      <div className='h-full flex flex-col items-center justify-center'>
        <div className='text-destructive'>
          회고를 불러오는 중 오류가 발생했습니다.
        </div>
        <button
          onClick={handleBack}
          className='mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors'
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col bg-background'>
      {/* 헤더 */}
      <div className='px-6 py-6 border-b border-border bg-background'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <button
              onClick={handleBack}
              className='p-2 hover:bg-accent rounded-lg transition-colors'
            >
              <ArrowLeft className='w-5 h-5 text-foreground' />
            </button>
            <h1 className='text-2xl font-bold text-primary'>회고 상세</h1>
          </div>

          {isAuthor && (
            <div className='flex items-center gap-2'>
              <button
                onClick={handleEdit}
                className='flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary-hover transition-colors font-semibold'
              >
                <Edit className='w-4 h-4' />
                <span>수정</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className='flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-sm hover:bg-destructive-hover transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <Trash2 className='w-4 h-4' />
                <span>삭제</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className='flex-1 overflow-y-auto bg-background p-6'>
        <div className='max-w-4xl mx-auto space-y-6'>
          {/* 제목 */}
          <div className='bg-card rounded-lg border border-border p-6'>
            <h2 className='text-xl font-bold text-foreground mb-2'>
              {reflection.title}
            </h2>

            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
              <div className='flex items-center gap-1'>
                <User className='w-4 h-4' />
                <span>
                  작성자: {authorName || `ID: ${reflection.study_member_id}`}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <Calendar className='w-4 h-4' />
                <span>
                  {new Date(reflection.updated_at).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          </div>

          {/* 점수 평가 */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-foreground'>평가</h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-card rounded-lg border border-border p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h4 className='text-lg font-semibold text-foreground'>
                    전체 만족도
                  </h4>
                  <span className='text-2xl font-bold text-primary'>
                    {reflection.satisfaction_score}/10
                  </span>
                </div>
                <div className='w-full bg-secondary rounded-full h-2'>
                  <div
                    className='bg-primary h-2 rounded-full transition-all'
                    style={{
                      width: `${(reflection.satisfaction_score / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className='bg-card rounded-lg border border-border p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h4 className='text-lg font-semibold text-foreground'>
                    내용 이해도
                  </h4>
                  <span className='text-2xl font-bold text-primary'>
                    {reflection.understanding_score}/10
                  </span>
                </div>
                <div className='w-full bg-secondary rounded-full h-2'>
                  <div
                    className='bg-primary h-2 rounded-full transition-all'
                    style={{
                      width: `${(reflection.understanding_score / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className='bg-card rounded-lg border border-border p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h4 className='text-lg font-semibold text-foreground'>
                    참여도
                  </h4>
                  <span className='text-2xl font-bold text-primary'>
                    {reflection.participation_score}/10
                  </span>
                </div>
                <div className='w-full bg-secondary rounded-full h-2'>
                  <div
                    className='bg-primary h-2 rounded-full transition-all'
                    style={{
                      width: `${(reflection.participation_score / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 학습 내용 */}
          <div className='bg-card rounded-lg border border-border p-6'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              이번 스터디에서 공부한 점과 느낀점은 무엇인가요?
            </h3>
            <div className='bg-background border border-border rounded-lg p-4 min-h-[120px]'>
              <p className='text-foreground whitespace-pre-wrap'>
                {reflection.learned_content}
              </p>
            </div>
          </div>

          {/* 개선점 */}
          <div className='bg-card rounded-lg border border-border p-6'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              다음 스터디에서 개선할 점은 무엇인가요?
            </h3>
            <div className='bg-background border border-border rounded-lg p-4 min-h-[120px]'>
              <p className='text-foreground whitespace-pre-wrap'>
                {reflection.improvement}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      {showDeleteDialog && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          title='회고 삭제'
          message='정말 이 회고를 삭제하시겠습니까? 삭제된 회고는 복구할 수 없습니다.'
          confirmText='삭제'
          cancelText='취소'
          type='danger'
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
};

export default ReflectionViewPage;
