import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../schemas';
import type { SignupFormData, SignupStep } from '../types';
import { DEFAULT_FORM_VALUES } from '../constants';

/**
 * 회원가입 폼 관리 훅
 */
export const useSignupForm = () => {
  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
    resolver: zodResolver(signupSchema) as unknown as Resolver<SignupFormData>,
    mode: 'onTouched',
  });

  // 현재 단계
  const [currentStep, setCurrentStep] = useState<SignupStep>(1);

  // 프로필 이미지 미리보기
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  // 파일 input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 폼 데이터 감시
  const watchedValues = watch();

  // 단계 이동 핸들러
  const handleStepChange = (step: SignupStep) => {
    setCurrentStep(step);
  };

  // 관심 분야 토글 핸들러
  const handleInterestToggle = (interest: string) => {
    const currentInterests = watchedValues.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter((item: string) => item !== interest)
      : [...currentInterests, interest];
    setValue('interests', newInterests);
  };

  // 프로필 이미지 업로드 핸들러
  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('profileImage', file);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 이미지 제거 핸들러
  const handleRemoveProfileImage = () => {
    setValue('profileImage', null);
    setProfileImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 프로필 이미지 클릭 핸들러
  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  // 회원가입 완료 핸들러
  const onSubmit = (data: SignupFormData) => {
    console.log('회원가입 데이터:', data);

    // TODO: 실제 API 호출
    // await signupAPI(data);
  };

  return {
    // React Hook Form
    register,
    handleSubmit,
    watch,
    setValue,
    errors,

    // 상태
    currentStep,
    profileImagePreview,
    fileInputRef,
    watchedValues,

    // 핸들러
    handleStepChange,
    handleInterestToggle,
    handleProfileImageChange,
    handleRemoveProfileImage,
    handleProfileImageClick,
    onSubmit,
  };
};
