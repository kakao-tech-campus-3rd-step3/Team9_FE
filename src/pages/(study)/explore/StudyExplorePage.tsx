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
import { Layout } from '@/components';

const StudyExplorePage: React.FC = () => {
  const {
    // 상태
    searchTerm,
    setSearchTerm,
    selectedCategories,
    selectedRegions,
    activeModal,
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
    handleRegionToggle,
    hideToast,
    setActiveModal,
  } = useStudyExplore();

  return (
    <Layout
      layoutType='header-only'
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    >
      <div className='min-h-screen bg-background'>
        <div className='flex'>
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

        {/* 토스트 알림 */}
        <Toast
          type={toast.type}
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    </Layout>
  );
};

export default StudyExplorePage;
