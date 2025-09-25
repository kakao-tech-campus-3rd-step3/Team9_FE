import React, { useState } from 'react';
import { X, UserCheck, XCircle, Loader2 } from 'lucide-react';
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { Input } from '../../components';
import { AUTH_TEXTS } from '../../constants';
import { signupService } from '../services';
import {
  GENDER_OPTIONS,
  INTEREST_OPTIONS,
  REGION_OPTIONS,
  BUTTON_BASE_STYLES,
  BUTTON_SELECTED_STYLES,
  BUTTON_UNSELECTED_STYLES,
} from '../constants';
import type { SignupFormData, SignupStep } from '../types';

interface Step2FormProps {
  register: UseFormRegister<SignupFormData>;
  watchedValues: SignupFormData;
  setValue: UseFormSetValue<SignupFormData>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  profileImagePreview: string;
  handleInterestToggle: (interest: string) => void;
  handleProfileImageChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleRemoveProfileImage: () => void;
  handleProfileImageClick: () => void;
  handleStepChange: (step: SignupStep) => void;
  errors: FieldErrors<SignupFormData>;
}

/**
 * 2단계: 프로필 정보 입력 폼
 */
export const Step2Form: React.FC<Step2FormProps> = ({
  register,
  watchedValues,
  setValue,
  fileInputRef,
  profileImagePreview,
  handleInterestToggle,
  handleProfileImageChange,
  handleRemoveProfileImage,
  handleProfileImageClick,
  handleStepChange,
  errors,
}) => {
  // 닉네임 중복 확인 상태 관리
  const [isCheckingNickname, setIsCheckingNickname] = useState(false); // 닉네임 중복 확인 진행 상태
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<
    boolean | null
  >(null); // 닉네임 사용 가능 여부

  /**
   * 닉네임 중복 확인 처리 함수
   * - 입력된 닉네임의 중복 여부를 서버에 확인 요청
   * - 성공/실패 시 버튼 상태 및 메시지로 피드백
   */
  const handleCheckNickname = async () => {
    if (!watchedValues.nickname) return;

    setIsCheckingNickname(true);
    try {
      await signupService.checkNickname({ nickname: watchedValues.nickname });
      setIsNicknameAvailable(true);
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
      setIsNicknameAvailable(false);
    } finally {
      setIsCheckingNickname(false);
    }
  };
  return (
    <div className='space-y-6'>
      {/* 프로필 이미지 업로드 */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-foreground'>
          프로필 이미지
        </label>
        <div className='flex flex-col items-center gap-2'>
          {/* 숨겨진 파일 input */}
          <input
            ref={fileInputRef}
            type='file'
            id='profileImage'
            name='profileImage'
            accept='image/*'
            onChange={handleProfileImageChange}
            className='hidden'
            aria-label='프로필 이미지 업로드'
          />

          {/* 이미지 미리보기 또는 업로드 버튼 */}
          <div className='relative'>
            <div
              onClick={handleProfileImageClick}
              className='w-20 h-20 border-2 border-dashed border-input rounded-full hover:border-primary transition-colors cursor-pointer overflow-hidden'
            >
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt='프로필 이미지 미리보기'
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='flex items-center justify-center w-full h-full'>
                  <span className='text-muted-foreground text-sm'>+</span>
                </div>
              )}
            </div>

            {/* 제거 버튼 - 원형 밖으로 배치 */}
            {profileImagePreview && (
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveProfileImage();
                }}
                className='absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive-hover transition-colors shadow-sm cursor-pointer'
                aria-label='프로필 이미지 제거'
              >
                <X className='w-3 h-3' />
              </button>
            )}
          </div>

          {/* 안내 텍스트 */}
          <p className='text-xs text-muted-foreground text-center'>
            {watchedValues.profileImage
              ? '클릭하여 이미지 변경'
              : '클릭하여 이미지 업로드'}
          </p>
        </div>
      </div>

      {/* 닉네임 입력 및 중복 확인 */}
      <div className='flex gap-2'>
        <Input
          type='text'
          id='userNickname'
          placeholder={AUTH_TEXTS.SIGNUP.STEP2.NICKNAME_PLACEHOLDER}
          className='flex-1'
          autoComplete='username'
          aria-invalid={!!errors.nickname || undefined}
          error={errors.nickname?.message}
          {...register('nickname', {
            onChange: () => {
              // 닉네임이 변경되면 중복 확인 상태 초기화
              setIsNicknameAvailable(null);
            },
          })}
        />
        <button
          type='button'
          onClick={handleCheckNickname}
          disabled={
            !watchedValues.nickname ||
            isCheckingNickname ||
            isNicknameAvailable === true
          }
          className={`px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 ${
            isNicknameAvailable === true
              ? 'bg-green-500 text-white'
              : isNicknameAvailable === false
                ? 'bg-red-500 text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary-hover'
          }`}
          aria-label={
            isNicknameAvailable === true
              ? '닉네임 사용 가능'
              : isNicknameAvailable === false
                ? '닉네임 중복됨'
                : '닉네임 중복 확인'
          }
        >
          {isCheckingNickname ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <UserCheck className='w-4 h-4' />
          )}
          {isCheckingNickname
            ? '확인 중...'
            : isNicknameAvailable === true
              ? '사용 가능'
              : isNicknameAvailable === false
                ? '중복됨'
                : AUTH_TEXTS.SIGNUP.STEP2.NICKNAME_CHECK_BUTTON}
        </button>
      </div>

      {/* 성별 선택 */}
      <div className='space-y-1'>
        <label className='block text-sm font-medium text-foreground'>
          {AUTH_TEXTS.SIGNUP.STEP2.GENDER_TITLE}
        </label>
        <div className='flex gap-3'>
          {GENDER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type='button'
              name='gender'
              value={value}
              onClick={() => setValue('gender', value)}
              className={`flex-1 ${BUTTON_BASE_STYLES} ${
                watchedValues.gender === value
                  ? BUTTON_SELECTED_STYLES
                  : BUTTON_UNSELECTED_STYLES
              }`}
              aria-label={`성별 선택: ${label}`}
              aria-pressed={watchedValues.gender === value}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.gender && (
          <div className='text-xs text-red-600 flex items-center gap-1'>
            <XCircle className='w-3 h-3' />
            {errors.gender.message}
          </div>
        )}
      </div>

      {/* 관심 분야 선택 */}
      <div className='space-y-1'>
        <label className='block text-sm font-medium text-foreground'>
          {AUTH_TEXTS.SIGNUP.STEP2.INTEREST_TITLE}
        </label>
        <div className='grid grid-cols-2 gap-2'>
          {INTEREST_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              type='button'
              name='interests'
              value={key}
              onClick={() => handleInterestToggle(key)}
              className={`${BUTTON_BASE_STYLES} ${
                (watchedValues.interests || []).includes(key)
                  ? BUTTON_SELECTED_STYLES
                  : BUTTON_UNSELECTED_STYLES
              }`}
              aria-label={`관심 분야 선택: ${label}`}
              aria-pressed={(watchedValues.interests || []).includes(key)}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.interests && (
          <div className='text-xs text-red-600 flex items-center gap-1'>
            <XCircle className='w-3 h-3' />
            {errors.interests.message}
          </div>
        )}
      </div>

      {/* 지역 선택 */}
      <div className='space-y-1'>
        <label className='block text-sm font-medium text-foreground'>
          {AUTH_TEXTS.SIGNUP.STEP2.REGION_TITLE}
        </label>
        <select
          className='w-full px-0 py-3 bg-transparent border-0 border-b-2 border-input text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer'
          aria-label='지역 선택'
          autoComplete='country'
          {...register('region')}
        >
          <option value=''>지역을 선택해주세요</option>
          {REGION_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.region && (
          <div className='text-xs text-red-600 flex items-center gap-1'>
            <XCircle className='w-3 h-3' />
            {errors.region.message}
          </div>
        )}
      </div>

      {/* 단계 이동 버튼들 */}
      <div className='flex gap-3 mt-6'>
        {/* 이전 단계 버튼 */}
        <button
          type='button'
          onClick={() => handleStepChange(1)}
          className='flex-1 bg-secondary text-secondary-foreground py-2 px-3 rounded-lg hover:bg-secondary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 font-medium cursor-pointer'
          aria-label='이전 단계로 이동'
        >
          이전
        </button>
        {/* 회원가입 완료 버튼 */}
        <button
          type='submit'
          className='flex-1 bg-primary text-primary-foreground py-2 px-3 rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 font-medium cursor-pointer'
          aria-label='회원가입 완료'
        >
          {AUTH_TEXTS.SIGNUP.STEP2.COMPLETE_BUTTON}
        </button>
      </div>
    </div>
  );
};
