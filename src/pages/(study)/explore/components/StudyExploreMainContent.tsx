/**
 * 스터디 탐색 페이지 메인 콘텐츠 컴포넌트
 * - 스터디 카드 그리드와 지역 선택 버튼 포함
 */

import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StudyCard } from './';
import { ROUTES } from '@/constants';
import type { Study } from '../types';

interface StudyExploreMainContentProps {
  filteredStudies: Study[];
  selectedRegion: string;
  onCardClick: (study: Study) => void;
  onApplyClick: (study: Study) => void;
  onRegionSelectClick: () => void;
}

const StudyExploreMainContent: React.FC<StudyExploreMainContentProps> = ({
  filteredStudies,
  selectedRegion,
  onCardClick,
  onApplyClick,
  onRegionSelectClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className='flex-1 p-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-xl font-semibold text-foreground'>
            {selectedRegion === '전체' ? '전체 지역' : selectedRegion} 근처
            스터디
          </h1>
          <button
            onClick={onRegionSelectClick}
            className='px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary border border-border rounded-lg hover:bg-secondary-hover transition-colors'
          >
            지역 선택
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredStudies.map((study: Study) => (
            <StudyCard
              key={study.id}
              study={study}
              onCardClick={onCardClick}
              onApplyClick={onApplyClick}
            />
          ))}
        </div>

        {filteredStudies.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-muted-foreground text-lg'>
              해당 조건에 맞는 스터디가 없습니다.
            </p>
            <p className='text-muted-foreground text-sm mt-2'>
              다른 지역이나 카테고리를 선택해보세요.
            </p>
          </div>
        )}
      </div>

      {/* 스터디 생성 버튼 */}
      <button
        onClick={() => navigate(ROUTES.STUDY.CREATE)}
        className='fixed bottom-8 right-8 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-40'
        aria-label='스터디 생성'
      >
        <Plus className='h-6 w-6' />
      </button>
    </div>
  );
};

export default StudyExploreMainContent;
