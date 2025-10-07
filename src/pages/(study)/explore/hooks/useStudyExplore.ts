/**
 * 스터디 탐색 페이지 로직을 관리하는 훅
 */

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { Study } from '../types';
import { studyExploreService } from '../services';
import { MOCK_STUDIES, CATEGORIES } from '../constants';

type ModalType = 'apply' | 'detail' | 'region' | null;

export const useStudyExplore = (searchTerm: string) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    '전체',
  ]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['전체']);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);

  // React Query로 스터디 목록 조회
  const {
    data: studies = [],
    isLoading,
    error,
    refetch,
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

  // 스터디 생성 이벤트 리스너
  React.useEffect(() => {
    const handleStudyCreated = () => {
      console.log('스터디 생성 이벤트 감지 - 데이터 새로고침');
      refetch(); // 백엔드 데이터 새로고침
    };

    window.addEventListener('studyCreated', handleStudyCreated);
    return () => window.removeEventListener('studyCreated', handleStudyCreated);
  }, [refetch]);

  // 필터링된 스터디 목록 (클라이언트 사이드 필터링은 유지)
  // 새로 생성한 스터디를 맨 앞에 추가
  // localStorage에서 영구 저장된 스터디들 불러오기
  const persistentStudies = useMemo(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem('persistentStudies') || '[]',
      );
      // 목데이터 "독서 모임" 제거
      return stored.filter((study: Study) => study.title !== '독서 모임');
    } catch (error) {
      console.error('영구 저장된 스터디 로드 실패:', error);
      return [];
    }
  }, []);

  // API 연결 상태 확인 (에러가 없으면 연결됨, 데이터 유무와 상관없이)
  const isApiConnected = !error;

  // 디버깅용 로그
  console.log('API 상태:', {
    error,
    studiesLength: studies.length,
    isApiConnected,
    selectedCategories,
    selectedRegions,
    persistentStudies,
    backendStudies: studies,
  });

  // 중복 제거를 위한 헬퍼 함수 (ID 기반)
  const removeDuplicates = (studies: Study[]) => {
    const seen = new Set();
    return studies.filter((study) => {
      // ID가 있으면 ID로, 없으면 제목+설명+카테고리로 중복 판단
      const key = study.id
        ? `id-${study.id}`
        : `${study.title}-${study.description}-${study.category}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  const allStudies = removeDuplicates([
    // API 연결됐으면 백엔드 데이터만 사용
    ...(isApiConnected
      ? studies
      : [
          // API 연결 안됐을 때만 로컬 데이터 사용
          ...persistentStudies, // localStorage 데이터 (백엔드 실패 시 저장됨)
          ...MOCK_STUDIES, // 목데이터
        ]),
  ]);

  // 최신순으로 정렬 (ID 기준 내림차순)
  const sortedStudies = allStudies.sort((a, b) => b.id - a.id);

  const filteredStudies = sortedStudies.filter((study: Study) => {
    // 카테고리 필터
    if (!selectedCategories.includes('전체')) {
      // interests 배열이 있으면 interests로 필터링, 없으면 category로 필터링
      const studyCategories =
        study.interests && study.interests.length > 0
          ? study.interests
          : [study.category];

      // 카테고리 매핑 (백엔드 DB의 category를 프론트엔드 카테고리로 변환)
      const categoryMapping: { [key: string]: string } = {
        개발: '프로그래밍',
        어학: '어학',
        취업: '취업',
        '고시/공무원': '고시/공무원',
        '취미/교양': '취미/교양',
        '자율/기타': '자율/기타',
      };

      // interests가 있으면 이미 프론트엔드 카테고리이므로 매핑 불필요
      // interests가 없으면 백엔드 category를 프론트엔드 카테고리로 변환
      const mappedCategories =
        study.interests && study.interests.length > 0
          ? studyCategories // 이미 프론트엔드 카테고리
          : studyCategories.map((cat) => categoryMapping[cat] || cat);

      // 선택된 카테고리 중 하나라도 스터디의 카테고리/관심사와 일치하는지 확인
      const hasMatchingCategory = selectedCategories.some((selectedCategory) =>
        mappedCategories.includes(selectedCategory),
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

  // 새로 생성한 스터디 추가 함수

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
  };
};
