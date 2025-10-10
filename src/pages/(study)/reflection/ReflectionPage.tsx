import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import { REFLECTION_TEXTS } from './constants';
import { mockReflections } from './mock';
import type { ReflectionListItem } from './types';

/**
 * 회고 목록 페이지
 */
const ReflectionPage = () => {
  const navigate = useNavigate();
  const [showMyReflectionsOnly, setShowMyReflectionsOnly] = useState(false);
  const [reflections] = useState<ReflectionListItem[]>(mockReflections);

  const handleWriteReflection = () => {
    navigate('/study/reflection/write');
  };

  const handleReflectionClick = (reflectionId: number) => {
    navigate(`/study/reflection/${reflectionId}`);
  };

  const filteredReflections = showMyReflectionsOnly
    ? reflections.filter((reflection) => reflection.author === '김경대') // 실제로는 현재 사용자와 비교
    : reflections;

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
            <span>{REFLECTION_TEXTS.MY_REFLECTIONS_ONLY}</span>
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
        <div className='space-y-4'>
          {filteredReflections.length === 0 ? (
            <div className='text-center py-12 text-muted-foreground'>
              작성된 회고가 없습니다.
            </div>
          ) : (
            filteredReflections.map((reflection) => (
              <div
                key={reflection.id}
                onClick={() => handleReflectionClick(reflection.id)}
                className='bg-card rounded-lg border border-border p-6 cursor-pointer hover:shadow-md transition-shadow'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-foreground mb-2'>
                      {reflection.title}
                    </h3>

                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
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
            ))
          )}
        </div>
      </div>

      {/* 플로팅 액션 버튼 */}
      <button
        onClick={handleWriteReflection}
        className='fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary-hover transition-colors flex items-center justify-center'
      >
        <Plus className='w-6 h-6' />
      </button>
    </div>
  );
};

export default ReflectionPage;
