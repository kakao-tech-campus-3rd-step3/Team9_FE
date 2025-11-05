import { useState } from 'react';
import { Plus, Edit, Trash2, Check, Clock } from 'lucide-react';
import { useCurrentStudy } from '@/hooks/study/useCurrentStudy';
import {
  useStudyRoadmapQuery,
  useAddChapterMutation,
  useUpdateChapterMutation,
  useCompleteChapterMutation,
  useDeleteChapterMutation,
} from '../hooks';
import type { Chapter } from '../types';
import { LoadingSpinner } from '@/components';

interface StudyRoadmapTabProps {
  studyId: number;
}

/**
 * 스터디 로드맵 탭 컴포넌트
 * - 차시별 스터디 진행 상황을 타임라인 형태로 표시
 * - 차시 추가, 수정, 삭제, 완료 기능 제공 (스터디 리더만 가능)
 */
export const StudyRoadmapTab = ({ studyId }: StudyRoadmapTabProps) => {
  const { data: studyInfo } = useCurrentStudy(studyId);
  const isLeader = studyInfo?.role === 'LEADER';

  const { data: roadmapData, isLoading, error } = useStudyRoadmapQuery(studyId);
  const addChapterMutation = useAddChapterMutation(studyId);
  const updateChapterMutation = useUpdateChapterMutation(studyId);
  const completeChapterMutation = useCompleteChapterMutation(studyId);
  const deleteChapterMutation = useDeleteChapterMutation(studyId);

  // API 응답의 chapter를 정규화 (id 또는 chapter_id 모두 처리)
  const chapters: Chapter[] = (roadmapData?.chapters || []).map(
    (chapter, index) => {
      // API 응답에 id가 없을 경우를 대비한 디버깅
      if (!chapter.id && !chapter.chapter_id) {
        console.warn('Chapter에 id가 없습니다:', chapter, 'index:', index);
      }
      return {
        ...chapter,
        id: chapter.id || chapter.chapter_id,
      };
    },
  );

  const [isAddingSession, setIsAddingSession] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSession = async () => {
    if (
      newContent.trim() &&
      isLeader &&
      !addChapterMutation.isPending &&
      !isSubmitting
    ) {
      setIsSubmitting(true);
      try {
        await addChapterMutation.mutateAsync({ content: newContent.trim() });
        setNewContent('');
        setIsAddingSession(false);
      } catch {
        // 에러는 mutation에서 토스트 처리
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleStartAdd = () => {
    if (!isLeader) return;
    setIsAddingSession(true);
    setNewContent('');
  };

  const handleCancelAdd = () => {
    setIsAddingSession(false);
    setNewContent('');
  };

  const handleCompleteSession = async (chapterId: number) => {
    if (!isLeader) return;
    try {
      await completeChapterMutation.mutateAsync(chapterId);
    } catch {
      // 에러는 mutation에서 토스트 처리
    }
  };

  const handleDeleteSession = async (chapterId: number) => {
    if (!isLeader) return;
    if (confirm('정말 이 차시를 삭제하시겠습니까?')) {
      try {
        await deleteChapterMutation.mutateAsync(chapterId);
      } catch {
        // 에러는 mutation에서 토스트 처리
      }
    }
  };

  const handleStartEdit = (chapter: Chapter) => {
    if (!isLeader || !chapter.id) return;
    setEditingChapterId(chapter.id);
    setEditingContent(chapter.content);
  };

  const handleSaveEdit = async () => {
    if (editingChapterId && editingContent.trim() && isLeader) {
      try {
        await updateChapterMutation.mutateAsync({
          chapterId: editingChapterId,
          payload: { content: editingContent.trim() },
        });
        setEditingChapterId(null);
        setEditingContent('');
      } catch {
        // 에러는 mutation에서 토스트 처리
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingChapterId(null);
    setEditingContent('');
  };

  if (isLoading) {
    return (
      <div className='p-6 flex items-center justify-center h-full'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6 text-center'>
        <p className='text-destructive'>
          로드맵을 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  return (
    <div className='p-6'>
      {/* 헤더 */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-xl font-semibold text-foreground'>
            스터디 로드맵
          </h2>
          <p className='text-sm text-muted-foreground mt-1'>
            총 {chapters.length}개 차시 • 완료{' '}
            {chapters.filter((c) => c.completed).length}개
          </p>
        </div>
        {isLeader && (
          <button
            onClick={handleStartAdd}
            className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
          >
            <Plus className='w-4 h-4' />
            차시 추가하기
          </button>
        )}
      </div>

      {/* 타임라인 */}
      <div className='space-y-6'>
        {/* 인라인 추가 폼 */}
        {isAddingSession && (
          <div className='flex items-start gap-4'>
            <div className='flex flex-col items-center'>
              <div className='w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium'>
                +
              </div>
            </div>
            <div className='flex-1 bg-muted border border-border rounded-lg p-4'>
              <div className='space-y-2'>
                <input
                  type='text'
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddSession();
                    }
                  }}
                  className='w-full px-2 py-1 text-sm border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
                  placeholder='차시 내용을 입력하세요'
                  autoFocus
                  disabled={addChapterMutation.isPending || isSubmitting}
                />
                <div className='flex gap-2'>
                  <button
                    type='button'
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddSession();
                    }}
                    disabled={addChapterMutation.isPending || isSubmitting}
                    className='px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50'
                  >
                    {addChapterMutation.isPending || isSubmitting
                      ? '추가 중...'
                      : '추가하기'}
                  </button>
                  <button
                    type='button'
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancelAdd();
                    }}
                    disabled={addChapterMutation.isPending || isSubmitting}
                    className='px-3 py-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50'
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {chapters.length === 0 && !isAddingSession ? (
          <div className='text-center py-12 text-muted-foreground'>
            <Clock className='w-12 h-12 mx-auto mb-4 opacity-50' />
            <p className='text-lg font-medium'>아직 등록된 차시가 없습니다</p>
            {isLeader && (
              <p className='text-sm'>첫 번째 차시를 추가해보세요!</p>
            )}
          </div>
        ) : (
          chapters.map((chapter, index) => (
            <div key={chapter.id || index} className='flex items-start gap-4'>
              {/* 차시 번호 */}
              <div className='flex flex-col items-center'>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    chapter.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {chapter.completed ? (
                    <Check className='w-5 h-5' />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < chapters.length - 1 && (
                  <div className='w-0.5 h-20 bg-border mt-2'></div>
                )}
              </div>

              {/* 차시 내용 */}
              <div
                className={`flex-1 border rounded-lg p-4 transition-colors ${
                  chapter.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-background border-border'
                }`}
              >
                <div className='flex justify-between items-start mb-3'>
                  <div className='flex-1'>
                    {editingChapterId === chapter.id ? (
                      <div className='space-y-2'>
                        <input
                          type='text'
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveEdit();
                            }
                          }}
                          className='w-full px-2 py-1 text-sm border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
                          placeholder='차시 내용'
                          disabled={updateChapterMutation.isPending}
                        />
                        <div className='flex gap-2'>
                          <button
                            onClick={handleSaveEdit}
                            disabled={updateChapterMutation.isPending}
                            className='px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50'
                          >
                            {updateChapterMutation.isPending
                              ? '저장 중...'
                              : '저장'}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={updateChapterMutation.isPending}
                            className='px-2 py-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50'
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3
                          className={`text-sm font-medium ${
                            chapter.completed
                              ? 'text-green-800 line-through'
                              : 'text-foreground'
                          }`}
                        >
                          {chapter.content}
                        </h3>
                      </>
                    )}
                  </div>
                  {editingChapterId !== chapter.id && isLeader && (
                    <div className='flex gap-2 ml-4'>
                      {chapter.id && (
                        <>
                          <button
                            onClick={() => handleStartEdit(chapter)}
                            className='p-1 text-muted-foreground hover:text-foreground transition-colors'
                            title='수정'
                          >
                            <Edit className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => handleDeleteSession(chapter.id!)}
                            disabled={deleteChapterMutation.isPending}
                            className='p-1 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50'
                            title='삭제'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {editingChapterId !== chapter.id && isLeader && chapter.id && (
                  <div className='flex justify-end'>
                    <button
                      onClick={() => handleCompleteSession(chapter.id!)}
                      disabled={completeChapterMutation.isPending}
                      className={`px-3 py-1 text-xs rounded-md transition-colors disabled:opacity-50 ${
                        chapter.completed
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      {completeChapterMutation.isPending
                        ? '처리 중...'
                        : chapter.completed
                          ? '완료됨'
                          : '완료하기'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
