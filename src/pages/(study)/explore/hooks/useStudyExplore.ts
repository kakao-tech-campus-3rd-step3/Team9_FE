/**
 * 스터디 탐색 페이지 로직을 관리하는 훅
 */

import { useState } from 'react';
import type { Study, ToastState } from '../types';
import { MOCK_STUDIES, CATEGORIES } from '../constants';

export const useStudyExplore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    '전체',
  ]);
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    type: 'success',
    message: '',
  });

  // 필터링된 스터디 목록
  const filteredStudies = MOCK_STUDIES.filter((study: Study) => {
    // 카테고리 필터
    if (
      !selectedCategories.includes('전체') &&
      !selectedCategories.includes(study.category)
    ) {
      return false;
    }
    // 지역 필터
    if (selectedRegion !== '전체' && study.region !== selectedRegion) {
      return false;
    }
    // 검색어 필터
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      return (
        study.title.toLowerCase().includes(searchLower) ||
        study.description.toLowerCase().includes(searchLower) ||
        study.category.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // 핸들러 함수들
  const handleApplyClick = (study: Study) => {
    setSelectedStudy(study);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStudy(null);
  };

  const handleCardClick = (study: Study) => {
    setSelectedStudy(study);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedStudy(null);
  };

  const handleDetailApply = (study: Study) => {
    setIsDetailModalOpen(false);
    setSelectedStudy(study);
    setIsModalOpen(true);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      if (category === '전체') {
        return ['전체'];
      }
      if (prev.includes(category)) {
        const newCategories = prev.filter((c) => c !== category);
        return newCategories.length === 0 ? ['전체'] : newCategories;
      } else {
        const newCategories = [...prev.filter((c) => c !== '전체'), category];
        return newCategories;
      }
    });
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return {
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
    categories: CATEGORIES,

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
  };
};
