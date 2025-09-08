/**
 * 스터디 생성 페이지
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyCreate } from './hooks';
import { StudyCreateSidebar, StudyCreateForm } from './components';
import { STUDY_CREATE_CATEGORIES, MAX_MEMBER_OPTIONS } from './constants';
import { StudyCreateCompleteModal } from '../components';
import Toast from '@/components/common/Toast';
import { ROUTES } from '@/constants';

const StudyCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    // 상태
    selectedCategories,
    imagePreview,
    isCompleteModalOpen,
    currentStudyTitle,
    toast,

    // 핸들러
    handleCategoryToggle,
    handleImageUpload,
    showToast,
    hideToast,
    handleCompleteModalClose,
    handleSubmit,
    setImagePreview,
  } = useStudyCreate();

  const handleCompleteModalCloseWithNavigation = () => {
    handleCompleteModalClose();
    // 스터디 탐색 페이지로 이동
    navigate(ROUTES.STUDY.EXPLORE);
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='flex'>
        {/* 사이드바 */}
        <StudyCreateSidebar
          categories={STUDY_CREATE_CATEGORIES}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
        />

        {/* 메인 콘텐츠 */}
        <div className='flex-1 p-6'>
          <StudyCreateForm
            selectedCategories={selectedCategories}
            imagePreview={imagePreview}
            categories={STUDY_CREATE_CATEGORIES}
            memberOptions={MAX_MEMBER_OPTIONS}
            onCategoryToggle={handleCategoryToggle}
            onImageUpload={handleImageUpload}
            onImageRemove={() => setImagePreview(null)}
            onSubmit={handleSubmit}
            onShowToast={(message, type) => showToast(type, message)}
          />
        </div>
      </div>

      {/* 스터디 생성 완료 모달 */}
      <StudyCreateCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={handleCompleteModalCloseWithNavigation}
        studyTitle={currentStudyTitle}
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

export default StudyCreatePage;
