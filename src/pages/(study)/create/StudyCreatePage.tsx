/**
 * 스터디 생성 페이지
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useStudyCreate } from './hooks';
import { StudyCreateSidebar, StudyCreateForm } from './components';
import { STUDY_CREATE_CATEGORIES, MAX_MEMBER_OPTIONS } from './constants';
import { StudyCreateCompleteModal } from '../components';
import { ROUTES } from '@/constants';

const StudyCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    // 상태
    selectedCategories,
    imagePreview,
    isCompleteModalOpen,
    currentStudyTitle,
    createdStudyData,

    // React Query 상태
    isCreating,
    createError,

    // 핸들러
    handleCategoryToggle,
    handleImageUpload,
    handleCompleteModalClose,
    handleSubmit,
    setImagePreview,
  } = useStudyCreate();

  const handleCompleteModalCloseWithNavigation = () => {
    handleCompleteModalClose();

    if (!createdStudyData) return;

    // 스터디 탐색 페이지로 이동 (새로 생성한 스터디 정보 포함)
    // 로컬 스토리지에 스터디 데이터 저장 (이미지 포함)
    const studyData = {
      title: createdStudyData.title,
      category: selectedCategories[0] || '기타', // 첫 번째 카테고리 (호환성)
      interests: selectedCategories, // 모든 선택된 카테고리
      description: createdStudyData.description,
      shortDescription: createdStudyData.shortDescription,
      region: createdStudyData.region,
      maxMembers: createdStudyData.maxMembers,
      schedule: createdStudyData.schedule,
      conditions: createdStudyData.conditions,
      imageUrl: imagePreview || '',
    };

    console.log('저장할 이미지 데이터:', imagePreview);
    console.log('저장할 스터디 데이터:', studyData);

    localStorage.setItem('newlyCreatedStudy', JSON.stringify(studyData));

    const params = new URLSearchParams({
      newStudy: 'true',
    });

    navigate(
      `/${ROUTES.STUDY.ROOT}/${ROUTES.STUDY.EXPLORE}?${params.toString()}`,
    );
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
            onShowToast={(message, type) => {
              if (type === 'error') {
                toast.error(message);
              } else {
                toast.success(message);
              }
            }}
            isCreating={isCreating}
            createError={createError}
          />
        </div>
      </div>

      {/* 스터디 생성 완료 모달 */}
      <StudyCreateCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={handleCompleteModalCloseWithNavigation}
        studyTitle={currentStudyTitle}
      />
    </div>
  );
};

export default StudyCreatePage;
