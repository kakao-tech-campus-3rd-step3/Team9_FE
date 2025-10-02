/**
 * 스터디 탐색 페이지
 */

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStudyExplore } from './hooks';
import { StudyExploreSidebar, StudyExploreMainContent } from './components';
import {
  StudyApplyModal,
  StudyDetailModal,
  RegionSelectModal,
} from '../components';
import { SearchBar } from '@/components/common';

const StudyExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [inputValue, setInputValue] = React.useState(searchTerm);

  const {
    // 상태
    selectedCategories,
    selectedRegions,
    activeModal,
    selectedStudy,
    filteredStudies,
    categories,

    // 핸들러
    handleApplyClick,
    handleModalClose,
    handleCardClick,
    handleDetailModalClose,
    handleDetailApply,
    handleCategoryToggle,
    handleRegionToggle,
    setActiveModal,
  } = useStudyExplore(searchTerm);

  // URL의 searchTerm이 변경될 때 inputValue 동기화
  React.useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    // URL은 업데이트하지 않음 - Enter나 버튼 클릭 시에만 업데이트
  };

  const handleSearch = () => {
    // Enter나 검색 버튼을 눌렀을 때만 URL 업데이트
    if (inputValue.trim()) {
      setSearchParams({ search: inputValue });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='px-6 py-4 border-b border-border bg-background'>
        <SearchBar
          searchTerm={inputValue}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          placeholder='스터디를 검색해보세요'
        />
      </div>
      <div className='flex h-[calc(100vh-8rem)]'>
        {/* 사이드바 */}
        <StudyExploreSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
        />

        {/* 메인 콘텐츠 */}
        <StudyExploreMainContent
          filteredStudies={filteredStudies}
          selectedRegions={selectedRegions}
          onCardClick={handleCardClick}
          onApplyClick={handleApplyClick}
          onRegionSelectClick={() => setActiveModal('region')}
        />
      </div>

      {/* 스터디 신청 모달 */}
      <StudyApplyModal
        isOpen={activeModal === 'apply'}
        onClose={handleModalClose}
        studyTitle={selectedStudy?.title || ''}
        studyId={selectedStudy?.id || 0}
      />

      {/* 스터디 상세 모달 */}
      <StudyDetailModal
        isOpen={activeModal === 'detail'}
        onClose={handleDetailModalClose}
        study={selectedStudy}
        onApply={handleDetailApply}
      />

      {/* 지역 선택 모달 */}
      <RegionSelectModal
        isOpen={activeModal === 'region'}
        onClose={() => setActiveModal(null)}
        selectedRegions={selectedRegions}
        onRegionToggle={handleRegionToggle}
        multiSelect={true}
      />
    </div>
  );
};

export default StudyExplorePage;
