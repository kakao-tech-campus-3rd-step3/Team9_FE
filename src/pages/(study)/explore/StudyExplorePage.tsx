/**
 * 스터디 탐색 페이지
 */

import React from 'react';
import { useStudyExplore } from './hooks';
import { StudyExploreSidebar, StudyExploreMainContent } from './components';
import {
  StudyApplyModal,
  StudyDetailModal,
  RegionSelectModal,
} from '../components';
import Toast from '@/components/common/Toast';

const StudyExplorePage: React.FC = () => {
  const {
    // 상태
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

  return (
    <div className='min-h-screen bg-background'>
      <div className='flex pt-16'>
        {/* 사이드바 */}
        <StudyExploreSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
        />

        {/* 메인 콘텐츠 */}
        <StudyExploreMainContent
          filteredStudies={filteredStudies}
          selectedRegion={selectedRegion}
          onCardClick={handleCardClick}
          onApplyClick={handleApplyClick}
          onRegionSelectClick={() => setIsRegionModalOpen(true)}
        />
      </div>

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
