/**
 * 스터디 탐색 페이지 로직을 관리하는 훅
 */

import { useState } from 'react';
import type { Study } from '../types';
import { MOCK_STUDIES, CATEGORIES } from '../constants';

type ModalType = 'apply' | 'detail' | 'region' | null;

export const useStudyExplore = (searchTerm: string) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    '전체',
  ]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['전체']);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);

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
    if (
      !selectedRegions.includes('전체') &&
      !selectedRegions.includes(study.region)
    ) {
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
    setActiveModal('apply');
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedStudy(null);
  };

  const handleCardClick = (study: Study) => {
    setSelectedStudy(study);
    setActiveModal('detail');
  };

  const handleDetailModalClose = () => {
    setActiveModal(null);
    setSelectedStudy(null);
  };

  const handleDetailApply = (study: Study) => {
    setSelectedStudy(study);
    setActiveModal('apply');
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

  const handleRegionToggle = (region: string) => {
    setSelectedRegions((prev) => {
      if (region === '전체') {
        return ['전체'];
      }
      if (prev.includes(region)) {
        const newRegions = prev.filter((r) => r !== region);
        return newRegions.length === 0 ? ['전체'] : newRegions;
      } else {
        const newRegions = [...prev.filter((r) => r !== '전체'), region];
        return newRegions;
      }
    });
  };

  return {
    // 상태
    selectedCategories,
    selectedRegions,
    activeModal,
    selectedStudy,
    filteredStudies,
    categories: CATEGORIES,

    // 핸들러
    handleApplyClick,
    handleModalClose,
    handleCardClick,
    handleDetailModalClose,
    handleDetailApply,
    handleCategoryToggle,
    handleRegionToggle,
    setActiveModal,
  };
};
