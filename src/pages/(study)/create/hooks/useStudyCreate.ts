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

      // TODO: 실제 서버 연동 시 아래 주석 해제
      // return studyCreateService.createStudy(requestData);

      // 임시: 서버 연동 전까지는 성공으로 처리
      console.log('스터디 생성 요청 데이터:', requestData);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ id: Date.now(), ...requestData });
        }, 1000);
      });
    },
    onSuccess: (data, variables) => {
      // 현재 스터디 제목 저장
      setCurrentStudyTitle(variables.title);
      // 생성된 스터디 데이터 저장 (탐색 페이지에서 사용)
      setCreatedStudyData(variables);

      console.log('스터디 생성 성공:', data);
      toast.success('스터디가 성공적으로 생성되었습니다!');

      // 완료 모달 열기
      setIsCompleteModalOpen(true);
    },
    onError: (error) => {
      console.error('스터디 생성 실패:', error);
      toast.error(error.message || '스터디 생성에 실패했습니다.');
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
