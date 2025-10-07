/**
 * 스터디 탐색 페이지 로직을 관리하는 훅
 */

import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import type { Study } from '../types';
import { studyExploreService } from '../services';
import { MOCK_STUDIES, CATEGORIES } from '../constants';

type ModalType = 'apply' | 'detail' | 'region' | null;

export const useStudyExplore = (searchTerm: string) => {
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    '전체',
  ]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['전체']);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [newlyCreatedStudies, setNewlyCreatedStudies] = useState<Study[]>([]);
  const [hasProcessedNewStudy, setHasProcessedNewStudy] = useState(false);

  // React Query로 스터디 목록 조회
  const {
    data: studies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['studies', searchTerm, selectedCategories, selectedRegions],
    queryFn: () => {
      // 실제 API 호출
      return studyExploreService.getStudies({
        keyword: searchTerm,
        interests: selectedCategories.includes('전체')
          ? undefined
          : selectedCategories,
        locations: selectedRegions.includes('전체')
          ? undefined
          : selectedRegions,
      });
    },
    // TODO: 실제 서버 연동 시 아래 주석 해제
    // enabled: true,
    // 실제 서버 연동 전까지는 목업 데이터 사용
    enabled: true,
  });

  // 필터링된 스터디 목록 (클라이언트 사이드 필터링은 유지)
  // 새로 생성한 스터디를 맨 앞에 추가
  // localStorage에서 영구 저장된 스터디들 불러오기
  const persistentStudies = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('persistentStudies') || '[]');
    } catch (error) {
      console.error('영구 저장된 스터디 로드 실패:', error);
      return [];
    }
  }, []);

  const allStudies = [
    ...newlyCreatedStudies,
    ...persistentStudies,
    ...(studies.length > 0 ? studies : MOCK_STUDIES),
  ];

  const filteredStudies = allStudies.filter((study: Study) => {
    // 카테고리 필터
    if (!selectedCategories.includes('전체')) {
      // interests 배열이 있으면 interests로 필터링, 없으면 category로 필터링
      const studyCategories =
        study.interests && study.interests.length > 0
          ? study.interests
          : [study.category];

      // 선택된 카테고리 중 하나라도 스터디의 카테고리/관심사와 일치하는지 확인
      const hasMatchingCategory = selectedCategories.some((selectedCategory) =>
        studyCategories.includes(selectedCategory),
      );

      if (!hasMatchingCategory) {
        return false;
      }
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

  // 스터디 신청 Mutation
  const applyStudyMutation = useMutation({
    mutationFn: async ({
      studyId,
      message,
    }: {
      studyId: number;
      message: string;
    }) => {
      return studyExploreService.applyStudy({
        study_id: studyId,
        message,
      });
    },
    onSuccess: () => {
      toast.success('스터디 신청이 완료되었습니다!');
      setActiveModal(null);
      setSelectedStudy(null);
    },
    onError: (error) => {
      console.error('스터디 신청 실패:', error);
      // 에러는 기존 apiClient에서 토스트로 처리됨
    },
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

  // 로컬 스토리지에서 새로 생성한 스터디 정보 읽기
  useEffect(() => {
    const newStudy = searchParams.get('newStudy');

    if (newStudy === 'true' && !hasProcessedNewStudy) {
      // 중복 추가 방지
      setHasProcessedNewStudy(true);

      // 로컬 스토리지에서 스터디 데이터 읽기
      const storedStudyData = localStorage.getItem('newlyCreatedStudy');

      if (storedStudyData) {
        try {
          const studyData = JSON.parse(storedStudyData);

          console.log('로컬 스토리지에서 읽은 데이터:', studyData);
          console.log('이미지 URL:', studyData.imageUrl);

          const newStudyData: Study = {
            id: Date.now(), // 간단한 ID
            title: studyData.title,
            category: studyData.category,
            interests: studyData.interests || [studyData.category], // interests 배열이 있으면 사용, 없으면 category를 배열로 변환
            region: studyData.region || '온라인',
            description: studyData.description || '새로 생성된 스터디입니다.',
            shortDescription: studyData.shortDescription || undefined,
            detailedDescription: studyData.description || undefined,
            schedule: studyData.schedule || undefined,
            requirements: studyData.conditions || [],
            maxMembers: studyData.maxMembers || 4,
            currentMembers: 1,
            imageUrl: studyData.imageUrl || '/api/placeholder/300/200',
          };

          console.log('생성된 스터디 데이터:', newStudyData);
          setNewlyCreatedStudies((prev) => [newStudyData, ...prev]);

          // localStorage에 영구 저장 (새로고침해도 유지)
          const existingStudies = JSON.parse(
            localStorage.getItem('persistentStudies') || '[]',
          );
          const updatedStudies = [newStudyData, ...existingStudies];
          localStorage.setItem(
            'persistentStudies',
            JSON.stringify(updatedStudies),
          );

          // 로컬 스토리지에서 데이터 제거 (중복 방지)
          localStorage.removeItem('newlyCreatedStudy');
        } catch (error) {
          console.error('스터디 데이터 파싱 실패:', error);
        }
      }

      // URL 파라미터 제거 (새로고침 시 중복 추가 방지)
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('newStudy');

      const newUrl = `${window.location.pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams, hasProcessedNewStudy]);

  // 새로 생성한 스터디 추가 함수
  const addNewlyCreatedStudy = (study: Study) => {
    setNewlyCreatedStudies((prev) => [study, ...prev]);
  };

  return {
    // 상태
    selectedCategories,
    selectedRegions,
    activeModal,
    selectedStudy,
    filteredStudies,
    categories: CATEGORIES,

    // React Query 상태
    isLoading,
    error,
    isApplying: applyStudyMutation.isPending,

    // 핸들러
    handleApplyClick,
    handleModalClose,
    handleCardClick,
    handleDetailModalClose,
    handleDetailApply,
    handleCategoryToggle,
    handleRegionToggle,
    setActiveModal,

    // 신청 관련
    applyStudy: (studyId: number, message: string) => {
      applyStudyMutation.mutate({ studyId, message });
    },

    // 새로 생성한 스터디 추가
    addNewlyCreatedStudy,
  };
};
