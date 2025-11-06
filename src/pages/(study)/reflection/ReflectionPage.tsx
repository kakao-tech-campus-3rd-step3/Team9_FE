import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES, ROUTE_BUILDERS } from '@/constants';
import { Plus, Filter } from 'lucide-react';
import { REFLECTION_TEXTS } from './constants';
import { useReflectionsQuery } from './hooks';
import { LoadingSpinner } from '@/components/common';
import type { ReflectionListItem } from './types';

/**
 * 회고 목록 페이지
 */
const ReflectionPage = () => {
  const navigate = useNavigate();
  const [showMyReflectionsOnly, setShowMyReflectionsOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [allReflections, setAllReflections] = useState<ReflectionListItem[]>(
    [],
  );
  const { study_id } = useParams<{ study_id: string }>();
  const studyId = study_id ? Number(study_id) : 0;

  // API로 회고 목록 조회
  const {
    data: reflectionData,
    isLoading,
    error,
  } = useReflectionsQuery(studyId, {
    author: showMyReflectionsOnly ? 'me' : undefined,
    page,
    size: 10,
  });

  // 필터 변경 시 페이지 리셋 및 목록 초기화
  useEffect(() => {
    setPage(0);
    setAllReflections([]);
  }, [showMyReflectionsOnly]);

  // 새 데이터가 오면 목록에 추가 (누적)
  useEffect(() => {
    if (reflectionData?.reflections) {
      if (page === 0) {
        // 첫 페이지면 전체 교체
        setAllReflections(reflectionData.reflections);
      } else {
        // 이후 페이지면 추가
        setAllReflections((prev) => [...prev, ...reflectionData.reflections]);
      }
    }
  }, [reflectionData, page]);

  const hasNext = reflectionData?.hasNext ?? false;

  const handleWriteReflection = () => {
    if (!study_id) return;
    navigate(
      `${ROUTE_BUILDERS.study.root(study_id)}/${ROUTES.STUDY.REFLECTION}/write`,
    );
  };

  const handleReflectionClick = (reflectionId: number) => {
    if (!study_id) return;
    navigate(
      `${ROUTE_BUILDERS.study.root(study_id)}/${ROUTES.STUDY.REFLECTION}/${reflectionId}`,
    );
  };

  const handleLoadMore = () => {
    if (hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className='h-full flex flex-col bg-background'>
      {/* 헤더 */}
      <div className='flex items-center justify-between px-6 py-6 border-b border-border bg-background'>
        <div>
          <h1 className='text-2xl font-bold text-primary'>
            {REFLECTION_TEXTS.PAGE_TITLE}
          </h1>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={() => setShowMyReflectionsOnly(!showMyReflectionsOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors font-semibold ${
              showMyReflectionsOnly
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary-hover'
            }`}
          >
            <Filter className='w-4 h-4' />
            <span>
              {showMyReflectionsOnly
                ? '모든 회고 보기'
                : REFLECTION_TEXTS.MY_REFLECTIONS_ONLY}
            </span>
          </button>

          <button
            onClick={handleWriteReflection}
            className='flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary-hover transition-colors font-semibold'
          >
            <Plus className='w-4 h-4' />
            <span>{REFLECTION_TEXTS.WRITE_BUTTON}</span>
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className='flex-1 overflow-y-auto bg-background p-6'>
        {isLoading && page === 0 ? (
          <div className='flex justify-center items-center py-12'>
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className='text-center py-12 text-destructive'>
            회고 목록을 불러오는 중 오류가 발생했습니다.
          </div>
        ) : allReflections.length === 0 ? (
          <div className='text-center py-12 text-muted-foreground'>
            작성된 회고가 없습니다.
          </div>
        ) : (
          <div className='space-y-4'>
            {allReflections.map((reflection) => {
              return (
                <div
                  key={reflection.id}
                  onClick={() => handleReflectionClick(reflection.id)}
                  className='bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow cursor-pointer'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <h3 className='text-lg font-semibold text-foreground mb-2'>
                        {reflection.title}
                      </h3>

                      <div className='flex items-center gap-4 text-sm text-muted-foreground mt-2'>
                        <div className='flex items-center gap-1'>
                          <span>작성자: {reflection.author}</span>
                        </div>

                        {reflection.schedule_title && (
                          <div className='flex items-center gap-1'>
                            <span>
                              연관된 스터디: {reflection.schedule_title}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='text-sm text-muted-foreground'>
                      {new Date(reflection.updated_at).toLocaleDateString(
                        'ko-KR',
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 더보기 버튼 */}
            {hasNext && (
              <div className='flex justify-center pt-4'>
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className='px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? '로딩 중...' : '더보기'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionPage;
