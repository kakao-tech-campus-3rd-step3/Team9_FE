/**
 * 스터디 탐색 페이지
 */

import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudyExplore } from './hooks';
import type { Study } from './types';
import {
  StudyExploreHeader,
  StudyExploreSidebar,
  StudyCard,
} from './components';
import {
  StudyApplyModal,
  StudyDetailModal,
  RegionSelectModal,
} from '../components';
import Toast from '@/components/common/Toast';
import { ROUTES } from '@/constants';

const StudyExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    // 상태
    searchTerm,
    setSearchTerm,
    selectedCategories,
    selectedRegion,
    isModalOpen,
    isDetailModalOpen,
    isRegionModalOpen,
    selectedStudy,
    toast,
    filteredStudies,
    categories,

    // 핸들러
    handleApplyClick,
    handleModalClose,
    handleCardClick,
    handleDetailModalClose,
    handleDetailApply,
    handleCategoryToggle,
    handleRegionSelect,
    hideToast,
    setIsRegionModalOpen,
  } = useStudyExplore();

  const handleCreateStudy = () => {
    navigate(ROUTES.STUDY.CREATE);
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* 헤더 */}
      <StudyExploreHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className='flex pt-16'>
        {/* 사이드바 */}
        <StudyExploreSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
        />

        {/* 메인 콘텐츠 */}
        <div className='flex-1 p-6'>
          <div className='max-w-6xl mx-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h1 className='text-xl font-semibold text-foreground'>
                {selectedRegion === '전체' ? '전체 지역' : selectedRegion} 근처
                스터디
              </h1>
              <button
                onClick={() => setIsRegionModalOpen(true)}
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
                  onCardClick={handleCardClick}
                  onApplyClick={handleApplyClick}
                />
              ))}
            </div>

            {filteredStudies.length === 0 && (
              <div className='text-center py-12'>
                <p className='text-muted-foreground'>검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 플로팅 액션 버튼 */}
      <button
        onClick={handleCreateStudy}
        className='fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary-hover transition-colors flex items-center justify-center'
      >
        <Plus className='h-6 w-6' />
      </button>

      {/* 스터디 신청 모달 */}
      <StudyApplyModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        studyTitle={selectedStudy?.title || ''}
      />

      {/* 스터디 상세 모달 */}
      <StudyDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleDetailModalClose}
        study={selectedStudy}
        onApply={handleDetailApply}
      />

      {/* 지역 선택 모달 */}
      <RegionSelectModal
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        selectedRegion={selectedRegion}
        onRegionSelect={handleRegionSelect}
      />

      {/* 토스트 알림 */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default StudyExplorePage;
