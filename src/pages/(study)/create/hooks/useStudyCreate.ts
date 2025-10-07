/**
 * 스터디 생성 페이지 로직을 관리하는 훅
 */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { StudyFormData, CreateStudyRequest } from '../types';
import { studyCreateService } from '../services';

export const useStudyCreate = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [currentStudyTitle, setCurrentStudyTitle] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createdStudyData, setCreatedStudyData] =
    useState<StudyFormData | null>(null);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // 이미지 미리보기만 설정 (실제 업로드는 스터디 생성 시)
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // 파일을 상태에 저장 (스터디 생성 시 업로드)
      setSelectedFile(file);
    }
  };

  const handleCompleteModalClose = () => {
    setIsCompleteModalOpen(false);
    // 폼 리셋
    setSelectedCategories([]);
    setImagePreview(null);
    setCurrentStudyTitle('');
    setSelectedFile(null);
    setCreatedStudyData(null);
  };

  // React Query로 스터디 생성
  const createStudyMutation = useMutation({
    mutationFn: async (data: StudyFormData) => {
      if (selectedCategories.length === 0) {
        throw new Error('최소 하나의 카테고리를 선택해주세요.');
      }

      let fileKey: string | undefined = undefined;

      // 이미지가 선택된 경우 업로드
      if (selectedFile) {
        try {
          const uploadResult =
            await studyCreateService.uploadImage(selectedFile);
          fileKey = uploadResult.file_key;
          console.log('이미지 업로드 성공:', fileKey);
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
          throw new Error('이미지 업로드에 실패했습니다.');
        }
      }

      // CreateStudyRequest 형태로 변환
      const requestData: CreateStudyRequest = {
        title: data.title,
        description: data.description,
        short_description: data.shortDescription,
        interests: selectedCategories, // 선택된 모든 카테고리
        max_members: data.maxMembers,
        schedule: data.schedule,
        region: data.region,
        conditions: data.conditions,
        file_key: fileKey, // 업로드된 이미지의 file_key 사용
      };

      // 실제 백엔드 서버로 스터디 생성 요청
      console.log('스터디 생성 요청 데이터:', requestData);
      return studyCreateService.createStudy(requestData);
    },
    onSuccess: (data, variables) => {
      // 현재 스터디 제목 저장
      setCurrentStudyTitle(variables.title);
      // 생성된 스터디 데이터 저장 (탐색 페이지에서 사용)
      setCreatedStudyData(variables);

      console.log('스터디 생성 성공:', data);
      console.log('백엔드 응답 데이터:', {
        id: data.id,
        title: data.title,
        created: data.created_at,
        backendResponse: data,
      });

      // 완료 모달 열기 (토스트는 모달에서 처리)
      setIsCompleteModalOpen(true);

      // 백엔드 데이터 새로고침을 위한 이벤트 발생
      window.dispatchEvent(new CustomEvent('studyCreated'));
    },
    onError: (error, variables) => {
      console.error('스터디 생성 실패:', error);
      
      // axios 에러인 경우 상세 정보 출력
      const axiosError = error as { response?: { data?: unknown; status?: number; statusText?: string } };
      console.error('에러 상세:', {
        message: error.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
      });

      // 백엔드 실패 시 로컬에 저장
      console.log('백엔드 실패로 로컬에 저장합니다.');

      const newStudy = {
        id: Date.now(),
        title: variables.title,
        description: variables.description,
        shortDescription: variables.shortDescription || '',
        category: variables.category || '프로그래밍',
        interests: [variables.category || '프로그래밍'],
        currentMembers: 1,
        maxMembers: variables.maxMembers || 4,
        region: variables.region,
        imageUrl: undefined,
        detailedDescription: variables.description,
        schedule: variables.schedule,
        requirements: variables.conditions || [],
      };

      // 기존 로컬 스터디 불러오기
      const existingStudies = JSON.parse(
        localStorage.getItem('persistentStudies') || '[]',
      );
      existingStudies.push(newStudy);
      localStorage.setItem(
        'persistentStudies',
        JSON.stringify(existingStudies),
      );

      // 새로 생성한 스터디를 즉시 반영하기 위해 상태에 추가
      setCreatedStudyData(variables);

      // 완료 모달 열기
      setCurrentStudyTitle(variables.title);
      setIsCompleteModalOpen(true);

      // 백엔드 데이터 새로고침을 위한 이벤트 발생
      window.dispatchEvent(new CustomEvent('studyCreated'));

      toast.error('백엔드 실패로 로컬에 저장되었습니다.');
    },
  });

  const handleSubmit = (data: StudyFormData) => {
    createStudyMutation.mutate(data);
  };

  return {
    // 상태
    selectedCategories,
    imagePreview,
    isCompleteModalOpen,
    currentStudyTitle,
    createdStudyData,

    // React Query 상태
    isCreating: createStudyMutation.isPending,
    createError: createStudyMutation.error,

    // 핸들러
    handleCategoryToggle,
    handleImageUpload,
    handleCompleteModalClose,
    handleSubmit,
    setImagePreview,
  };
};
