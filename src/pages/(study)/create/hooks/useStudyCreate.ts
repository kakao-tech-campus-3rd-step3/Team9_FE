/**
 * 스터디 생성 페이지 로직을 관리하는 훅
 */

import { useState } from 'react';
import type { StudyFormData, ToastState } from '../types';

export const useStudyCreate = () => {
  const [formData, setFormData] = useState<StudyFormData>({
    title: '',
    shortDescription: '',
    description: '',
    category: '',
    maxMembers: 2,
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    type: 'success',
    message: '',
  });

  const handleInputChange = (
    field: keyof StudyFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
    setFormData({
      title: '',
      shortDescription: '',
      description: '',
      category: '',
      maxMembers: 2,
    });
    setSelectedCategories([]);
    setImagePreview(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedCategories.length === 0) {
      showToast('error', '최소 하나의 카테고리를 선택해주세요.');
      return;
    }

    if (!formData.title.trim()) {
      showToast('error', '스터디 이름을 입력해주세요.');
      return;
    }

    if (!formData.shortDescription.trim()) {
      showToast('error', '스터디 한 줄 소개를 입력해주세요.');
      return;
    }

    console.log('스터디 생성 데이터:', {
      ...formData,
      categories: selectedCategories,
    });

    // 완료 모달 열기
    setIsCompleteModalOpen(true);
  };

  return {
    // 상태
    formData,
    selectedCategories,
    imagePreview,
    isCompleteModalOpen,
    toast,

    // 핸들러
    handleInputChange,
    handleCategoryToggle,
    handleImageUpload,
    showToast,
    hideToast,
    handleCompleteModalClose,
    handleSubmit,
    setImagePreview,
  };
};
