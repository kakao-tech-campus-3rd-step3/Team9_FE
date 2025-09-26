import { useState, useRef } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { signupSchema } from '../schemas';
import type { SignupFormData, SignupStep } from '../types';
import { DEFAULT_FORM_VALUES } from '../constants';
import { ROUTES } from '@/constants';
import { signupService } from '../services';
import { uploadWithPresignedUrl } from '@/utils/upload';
import type { SignupPayload } from '../types';
import type { InterestKey, RegionKey } from '@/constants';
import { INTERESTS, REGIONS } from '@/constants';
// 매핑은 서비스에서 수행

/**
 * 회원가입 폼 관리 훅
 * - React Hook Form을 사용한 폼 상태 관리
 * - 단계별 회원가입 프로세스 처리
 * - 프로필 이미지 업로드 및 미리보기 기능
 * - 관심 분야 다중 선택 기능
 */
export const useSignupForm = () => {
  const navigate = useNavigate();

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    defaultValues: DEFAULT_FORM_VALUES as Partial<SignupFormData>,
    resolver: zodResolver(signupSchema) as unknown as Resolver<SignupFormData>,
    mode: 'onTouched',
  });

  // 현재 단계
  const [currentStep, setCurrentStep] = useState<SignupStep>(1);

  // 프로필 이미지 미리보기
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [imageKey, setImageKey] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);

  // 파일 input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 폼 데이터 감시
  const watchedValues = watch();

  // 단계 이동 핸들러
  const handleStepChange = (step: SignupStep) => {
    setCurrentStep(step);
  };

  /**
   * 관심 분야 토글 핸들러
   * - 이미 선택된 관심 분야면 제거, 아니면 추가
   * - 다중 선택 가능한 관심 분야 관리
   */
  const handleInterestToggle = (interest: string) => {
    const currentInterests = watchedValues.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter((item: string) => item !== interest)
      : [...currentInterests, interest];
    setValue('interests', newInterests);
  };

  /**
   * 프로필 이미지 업로드 핸들러
   * - 선택된 파일을 폼 데이터에 저장
   * - FileReader를 사용한 이미지 미리보기 생성
   */
  const handleProfileImageChange = async (
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

      // 파일 선택 직후 즉시 업로드 (Presigned URL 흐름)
      setIsUploadingImage(true);
      setIsImageUploaded(false);
      try {
        const key = await uploadWithPresignedUrl(file);
        setImageKey(key);
        setIsImageUploaded(true);
      } catch (err) {
        console.error('프로필 이미지 업로드 실패:', err);
        setImageKey('');
        setIsImageUploaded(false);
        toast.error('프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  // 프로필 이미지 제거 핸들러
  const handleRemoveProfileImage = () => {
    setValue('profileImage', null);
    setProfileImagePreview('');
    setImageKey('');
    setIsImageUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 프로필 이미지 클릭 핸들러
  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * 프로필 이미지 업로드 URL 해결
   * - 파일이 없으면 빈 문자열 반환
   * - 파일이 있으면 업로드 후 URL 반환 (백엔드 준비 전까지 TODO 유지)
   */
  // 이미지 업로드는 파일 선택 시점에 처리됨

  /**
   * 회원가입 제출 처리 함수
   * - 폼 데이터 유효성 검증 후 서버 전송
   * - 성공 시 토스트 메시지 표시 및 로그인 페이지 이동
   * - 실패 시 에러 토스트 메시지 표시
   */
  const onSubmit = async (data: SignupFormData) => {
    try {
      if (isUploadingImage) {
        toast.warn('이미지 업로드가 완료될 때까지 기다려주세요.');
        return;
      }

      const image_key = imageKey;
      const payload: SignupPayload = {
        email: data.email,
        password: data.password,
        image_key,
        nickname: data.nickname,
        gender: data.gender,
        interests: ((data.interests || []) as InterestKey[]).map(
          (k) => INTERESTS[k],
        ),
        region: REGIONS[data.region as RegionKey],
      };
      await signupService.signup(payload);

      // 성공 토스트 표시
      toast.success('회원가입이 완료되었습니다!');

      // 로그인 페이지로 이동
      navigate(ROUTES.LOGIN);
    } catch (error) {
      // TODO: 실제 서버 연동 시 에러 처리
      console.error('회원가입 실패:', error);
      toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return {
    // React Hook Form
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    isValid,

    // 상태
    currentStep,
    profileImagePreview,
    fileInputRef,
    watchedValues,
    imageKey,
    isUploadingImage,
    isImageUploaded,

    // 핸들러
    handleStepChange,
    handleInterestToggle,
    handleProfileImageChange,
    handleRemoveProfileImage,
    handleProfileImageClick,
    onSubmit,
  };
};
