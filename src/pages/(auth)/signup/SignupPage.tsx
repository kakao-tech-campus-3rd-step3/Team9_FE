import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { Logo } from '@/components';
import { Input } from '../components';
import { AUTH_TEXTS } from '../constants';

// 타입 정의
type Gender = 'male' | 'female';
type Region = keyof typeof AUTH_TEXTS.SIGNUP.STEP2.REGIONS;

// 상수 정의
const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: AUTH_TEXTS.SIGNUP.STEP2.GENDER_MALE },
  { value: 'female', label: AUTH_TEXTS.SIGNUP.STEP2.GENDER_FEMALE },
];

const REGION_OPTIONS = Object.entries(AUTH_TEXTS.SIGNUP.STEP2.REGIONS).map(
  ([key, value]) => ({ value: key as Region, label: value }),
);

// 공통 스타일 클래스
const BUTTON_BASE_STYLES =
  'py-2 px-3 rounded-lg border-2 transition-colors text-sm cursor-pointer';
const BUTTON_SELECTED_STYLES =
  'border-primary bg-accent text-accent-foreground';
const BUTTON_UNSELECTED_STYLES = 'border-input hover:border-primary';

/**
 * 회원가입 페이지 컴포넌트
 * - 2단계 구성: 계정 정보 입력 → 프로필 정보 입력
 * - 단계별 진행 상태 표시
 * - 이전/다음 단계 이동 가능
 */
const SignupPage: React.FC = () => {
  // 상태 관리
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<Gender | ''>('');
  const [selectedRegion, setSelectedRegion] = useState<Region | ''>('');

  // 관심 분야 토글 핸들러
  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest],
    );
  };

  // 단계 이동 핸들러
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  // 관심 분야 옵션 메모이제이션
  const interestOptions = useMemo(
    () => Object.entries(AUTH_TEXTS.SIGNUP.STEP2.INTERESTS),
    [],
  );

  /**
   * 1단계: 계정 정보 입력 렌더링
   * - 이메일 입력 및 인증
   * - 비밀번호 입력 및 확인
   */
  const renderStep1 = () => (
    <form className='space-y-4'>
      {/* 이메일 입력 및 인증 */}
      <div className='flex gap-2'>
        <Input
          type='email'
          id='email'
          name='email'
          placeholder={AUTH_TEXTS.SIGNUP.STEP1.EMAIL_PLACEHOLDER}
          className='flex-1'
        />
        <button
          type='button'
          className='px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors text-sm whitespace-nowrap cursor-pointer'
          aria-label='이메일 인증번호 전송'
        >
          {AUTH_TEXTS.SIGNUP.STEP1.EMAIL_VERIFY_BUTTON}
        </button>
      </div>

      {/* 인증번호 입력 및 확인 */}
      <div className='flex gap-2'>
        <Input
          type='text'
          id='verifyCode'
          name='verifyCode'
          placeholder={AUTH_TEXTS.SIGNUP.STEP1.VERIFY_CODE_PLACEHOLDER}
          maxLength={6}
          className='flex-1'
        />
        <button
          type='button'
          className='px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors text-sm whitespace-nowrap cursor-pointer'
          aria-label='인증번호 확인'
        >
          {AUTH_TEXTS.SIGNUP.STEP1.VERIFY_BUTTON}
        </button>
      </div>

      {/* 비밀번호 입력 */}
      <Input
        type='password'
        id='password'
        name='password'
        placeholder={AUTH_TEXTS.SIGNUP.STEP1.PASSWORD_PLACEHOLDER}
      />

      {/* 비밀번호 확인 */}
      <Input
        type='password'
        id='confirmPassword'
        name='confirmPassword'
        placeholder={AUTH_TEXTS.SIGNUP.STEP1.CONFIRM_PASSWORD_PLACEHOLDER}
      />

      {/* 다음 단계 버튼 */}
      <button
        type='button'
        onClick={() => handleStepChange(2)}
        className='w-full bg-primary text-primary-foreground py-2 px-3 mt-4 rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 font-medium cursor-pointer'
        aria-label='다음 단계로 이동'
      >
        {AUTH_TEXTS.SIGNUP.STEP1.NEXT_BUTTON}
      </button>
    </form>
  );

  /**
   * 2단계: 프로필 정보 입력 렌더링
   * - 프로필 이미지 업로드
   * - 닉네임 입력 및 중복 확인
   * - 성별, 관심 분야, 지역 선택
   */
  const renderStep2 = () => (
    <div className='space-y-4'>
      {/* 프로필 이미지 업로드 */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-foreground'>
          프로필 이미지
        </label>
        <div className='relative'>
          <input
            type='file'
            id='profileImage'
            name='profileImage'
            accept='image/*'
            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
            aria-label='프로필 이미지 업로드'
          />
          <div className='flex items-center justify-center w-20 h-20 mx-auto border-2 border-dashed border-input rounded-full hover:border-primary transition-colors cursor-pointer'>
            <span className='text-muted-foreground text-sm'>+</span>
          </div>
        </div>
      </div>

      {/* 닉네임 입력 및 중복 확인 */}
      <div className='flex gap-2'>
        <Input
          type='text'
          id='nickname'
          name='nickname'
          placeholder={AUTH_TEXTS.SIGNUP.STEP2.NICKNAME_PLACEHOLDER}
          className='flex-1'
        />
        <button
          type='button'
          className='px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors text-sm whitespace-nowrap cursor-pointer'
          aria-label='닉네임 중복 확인'
        >
          {AUTH_TEXTS.SIGNUP.STEP2.NICKNAME_CHECK_BUTTON}
        </button>
      </div>

      {/* 성별 선택 */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-foreground'>
          {AUTH_TEXTS.SIGNUP.STEP2.GENDER_TITLE}
        </label>
        <div className='flex gap-3'>
          {GENDER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type='button'
              onClick={() => setSelectedGender(value)}
              className={`flex-1 ${BUTTON_BASE_STYLES} ${
                selectedGender === value
                  ? BUTTON_SELECTED_STYLES
                  : BUTTON_UNSELECTED_STYLES
              }`}
              aria-label={`성별 선택: ${label}`}
              aria-pressed={selectedGender === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 관심 분야 선택 */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-foreground'>
          {AUTH_TEXTS.SIGNUP.STEP2.INTEREST_TITLE}
        </label>
        <div className='grid grid-cols-2 gap-2'>
          {interestOptions.map(([key, value]) => (
            <button
              key={key}
              type='button'
              onClick={() => handleInterestToggle(key)}
              className={`${BUTTON_BASE_STYLES} ${
                selectedInterests.includes(key)
                  ? BUTTON_SELECTED_STYLES
                  : BUTTON_UNSELECTED_STYLES
              }`}
              aria-label={`관심 분야 선택: ${value}`}
              aria-pressed={selectedInterests.includes(key)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* 지역 선택 */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-foreground'>
          {AUTH_TEXTS.SIGNUP.STEP2.REGION_TITLE}
        </label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value as Region)}
          className='w-full px-0 py-3 bg-transparent border-0 border-b-2 border-input text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer'
          aria-label='지역 선택'
        >
          <option value=''>지역을 선택해주세요</option>
          {REGION_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
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
          type='button'
          className='flex-1 bg-primary text-primary-foreground py-2 px-3 rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 font-medium cursor-pointer'
          aria-label='회원가입 완료'
        >
          {AUTH_TEXTS.SIGNUP.STEP2.COMPLETE_BUTTON}
        </button>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-start gap-4 p-6'>
      {/* 단계 표시 게이지 */}
      <div className='space-y-1 w-full'>
        <div className='w-full bg-input rounded-full h-2 overflow-hidden'>
          <div
            className={`h-full bg-primary transition-all duration-500 ease-in-out ${
              currentStep === 1 ? 'w-1/2' : 'w-full'
            }`}
          />
        </div>
        <div className='text-center text-xs text-muted-foreground font-semibold'>
          {currentStep}/2 단계
        </div>
      </div>

      <div className='w-full max-w-sm space-y-4'>
        {/* 고정 헤더 영역 */}
        <div className='space-y-4 mb-6'>
          {/* 로고 */}
          <div className='text-center'>
            <Logo showText={false} className='w-24 h-24 mx-auto' />
          </div>

          {/* 타이틀 및 서브타이틀 */}
          <div className='text-center space-y-2'>
            <h3 className='font-bold text-foreground'>
              {currentStep === 1
                ? AUTH_TEXTS.SIGNUP.STEP1.TITLE
                : AUTH_TEXTS.SIGNUP.STEP2.TITLE}
            </h3>
            <p className='text-muted-foreground font-semibold'>
              {currentStep === 1
                ? AUTH_TEXTS.SIGNUP.STEP1.SUBTITLE
                : AUTH_TEXTS.SIGNUP.STEP2.SUBTITLE}
            </p>
          </div>
        </div>

        {/* 동적 컨텐츠 영역 */}
        <div className='space-y-4'>
          {currentStep === 1 ? renderStep1() : renderStep2()}
        </div>

        {/* 로그인 링크 */}
        <div className='text-center pt-2'>
          <p className='text-muted-foreground text-sm'>
            {AUTH_TEXTS.SIGNUP.LOGIN_LINK}{' '}
            <Link
              to={ROUTES.LOGIN}
              className='text-primary hover:text-primary-hover font-medium transition-colors ml-1 cursor-pointer'
            >
              {AUTH_TEXTS.SIGNUP.LOGIN_TEXT}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
