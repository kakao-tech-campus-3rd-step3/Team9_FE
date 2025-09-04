/**
 * 스터디 생성 페이지 로직을 관리하는 훅
 */

import { useState } from 'react';
import type { StudyFormData, ToastState } from '../types';

export const useStudyCreate = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [currentStudyTitle, setCurrentStudyTitle] = useState<string>('');
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    type: 'success',
    message: '',
  });

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ isVisible: true, type, message });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleCompleteModalClose = () => {
    setIsCompleteModalOpen(false);
    // 폼 리셋
    setSelectedCategories([]);
    setImagePreview(null);
    setCurrentStudyTitle('');
  };

  const handleSubmit = (data: StudyFormData) => {
    if (selectedCategories.length === 0) {
      showToast('error', '최소 하나의 카테고리를 선택해주세요.');
      return;
    }

    // 현재 스터디 제목 저장
    setCurrentStudyTitle(data.title);

    console.log('스터디 생성 데이터:', {
      ...data,
      categories: selectedCategories,
    });

    // 완료 모달 열기
    setIsCompleteModalOpen(true);
  };

  return {
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
  };
};
