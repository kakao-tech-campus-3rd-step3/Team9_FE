import React, { useState } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Mail, ShieldCheck, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { Input } from '../../components';
import { AUTH_TEXTS } from '../../constants';
import type { SignupFormData, SignupStep } from '../types';
import { useSendEmailCodeMutation, useVerifyEmailCodeMutation } from '../hooks';

interface Step1FormProps {
  register: UseFormRegister<SignupFormData>;
  handleStepChange: (step: SignupStep) => void;
  errors: FieldErrors<SignupFormData>;
  watch: () => SignupFormData;
}

/**
 * 1단계: 계정 정보 입력 폼
 */
export const Step1Form: React.FC<Step1FormProps> = ({
  register,
  handleStepChange,
  errors,
  watch,
}) => {
  // 이메일 인증 관련 상태 관리
  const [showVerifyCode, setShowVerifyCode] = useState(false); // 인증번호 입력 필드 표시 여부
  const [isSendingCode, setIsSendingCode] = useState(false); // 인증번호 전송 중 상태
  const [isVerifyingCode, setIsVerifyingCode] = useState(false); // 인증번호 확인 중 상태
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 전송 완료 상태
  const [isCodeVerified, setIsCodeVerified] = useState(false); // 인증번호 확인 완료 상태
  // 이메일 인증 관련 뮤테이션 훅
  const sendCodeMutation = useSendEmailCodeMutation();
  const verifyCodeMutation = useVerifyEmailCodeMutation();

  // 폼 데이터 감시
  const formData = watch();

  // 다음 버튼 클릭 후 인증 요구 에러 표시 여부
  const [showVerifyRequirement, setShowVerifyRequirement] = useState(false);

  /**
   * 인증번호 전송/재전송 처리 함수
   * - 이메일 유효성 검증 후 인증번호 전송
   * - 재전송 시 인증 상태 초기화
   */
  const handleSendCode = async () => {
    if (!formData.email) return;

    setIsSendingCode(true);
    try {
      await sendCodeMutation.mutateAsync({ email: formData.email });

      setShowVerifyCode(true);
      setIsCodeSent(true);
      setIsCodeVerified(false); // 재전송 시 인증 상태 초기화
    } catch (error) {
      console.error('인증번호 전송 실패:', error);
      toast.error('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSendingCode(false);
    }
  };

  /**
   * 인증번호 확인 처리 함수
   * - 입력된 인증번호 유효성 검증
   * - 성공 시 인증 완료 상태로 변경
   */
  const handleVerifyCode = async () => {
    if (!formData.email || !formData.verifyCode) return;

    setIsVerifyingCode(true);
    try {
      await verifyCodeMutation.mutateAsync({
        email: formData.email,
        verification_code: formData.verifyCode,
      });

      setIsCodeVerified(true);
    } catch (error) {
      console.error('인증번호 확인 실패:', error);
      toast.error('인증번호가 올바르지 않습니다. 다시 확인해주세요.');
      setIsCodeVerified(false);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // 인증을 시작했는지 여부(코드 전송/입력 노출)
  const hasStartedVerification = showVerifyCode || isCodeSent;
  const nextButtonLabel = AUTH_TEXTS.SIGNUP.STEP1.NEXT_BUTTON;

  return (
    <div className='space-y-6'>
      {/* 이메일 입력 및 인증 */}
      <div className='flex gap-2 items-start'>
        <Input
          type='email'
          id='email'
          placeholder={AUTH_TEXTS.SIGNUP.STEP1.EMAIL_PLACEHOLDER}
          className='flex-1'
          autoComplete='email'
          aria-invalid={!!errors.email || undefined}
          error={errors.email?.message}
          {...register('email')}
        />
        {isCodeVerified && (
          <span className='inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs'>
            <ShieldCheck className='w-3 h-3' /> 인증 완료
          </span>
        )}
        <button
          type='button'
          onClick={handleSendCode}
          disabled={!formData.email || isSendingCode}
          className={`px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 ${
            isCodeSent && !isCodeVerified
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary-hover'
          }`}
          aria-label={
            isCodeSent && !isCodeVerified
              ? '인증번호 재전송'
              : '이메일 인증번호 전송'
          }
        >
          {isSendingCode ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : isCodeSent && !isCodeVerified ? (
            <RefreshCw className='w-4 h-4' />
          ) : (
            <Mail className='w-4 h-4' />
          )}
          {isSendingCode
            ? '전송 중...'
            : isCodeSent && !isCodeVerified
              ? '재전송'
              : AUTH_TEXTS.SIGNUP.STEP1.EMAIL_VERIFY_BUTTON}
        </button>
      </div>

      {/* 인증번호 입력 및 확인 (조건부 렌더링) */}
      {showVerifyCode && (
        <div className='flex gap-2'>
          <Input
            type='text'
            id='verifyCode'
            placeholder={AUTH_TEXTS.SIGNUP.STEP1.VERIFY_CODE_PLACEHOLDER}
            maxLength={6}
            className='flex-1'
            autoComplete='one-time-code'
            aria-invalid={!!errors.verifyCode || undefined}
            error={errors.verifyCode?.message}
            {...register('verifyCode')}
          />
          <button
            type='button'
            onClick={handleVerifyCode}
            disabled={!formData.verifyCode || isVerifyingCode || isCodeVerified}
            className={`px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 ${
              isCodeVerified
                ? 'bg-green-500 text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary-hover'
            }`}
            aria-label={isCodeVerified ? '인증 완료' : '인증번호 확인'}
          >
            {isVerifyingCode ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <ShieldCheck className='w-4 h-4' />
            )}
            {isVerifyingCode
              ? '확인 중...'
              : isCodeVerified
                ? '인증 완료'
                : AUTH_TEXTS.SIGNUP.STEP1.VERIFY_BUTTON}
          </button>
        </div>
      )}

      {/* 인증 플로우 시작 전에는 비밀번호 입력을 숨김 */}
      {hasStartedVerification && (
        <>
          {/* 비밀번호 입력 */}
          <Input
            type='password'
            id='password'
            placeholder={AUTH_TEXTS.SIGNUP.STEP1.PASSWORD_PLACEHOLDER}
            autoComplete='new-password'
            aria-invalid={!!errors.password || undefined}
            error={errors.password?.message}
            {...register('password')}
          />

          {/* 비밀번호 확인 */}
          <Input
            type='password'
            id='confirmPassword'
            placeholder={AUTH_TEXTS.SIGNUP.STEP1.CONFIRM_PASSWORD_PLACEHOLDER}
            autoComplete='new-password'
            aria-invalid={!!errors.confirmPassword || undefined}
            error={errors.confirmPassword?.message}
            success={
              formData.password &&
              formData.confirmPassword &&
              formData.password === formData.confirmPassword &&
              !errors.confirmPassword
                ? '비밀번호가 일치합니다'
                : undefined
            }
            {...register('confirmPassword')}
          />
        </>
      )}

      {/* 다음 단계 버튼 */}
      <button
        type='button'
        onClick={() => {
          // 인증 미완료 시 클릭하면 안내 표시
          if (!isCodeVerified) {
            setShowVerifyRequirement(true);
            return;
          }
          // 인증 완료 후에는 비밀번호 유효성 확인
          if (
            hasStartedVerification &&
            (!formData.password ||
              !formData.confirmPassword ||
              formData.password !== formData.confirmPassword)
          ) {
            return;
          }
          handleStepChange(2);
        }}
        disabled={
          // 이메일은 항상 필요
          !formData.email ||
          // 인증을 시작한 뒤에는 비밀번호 필수 및 일치 필요
          (hasStartedVerification &&
            (!formData.password ||
              !formData.confirmPassword ||
              formData.password !== formData.confirmPassword))
        }
        className='w-full bg-primary text-primary-foreground py-2 px-3 mt-4 rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        aria-label='다음 단계로 이동'
        aria-describedby={
          showVerifyRequirement ? 'email-verify-help' : undefined
        }
      >
        {nextButtonLabel}
      </button>
      {showVerifyRequirement && (
        <p
          id='email-verify-help'
          className='text-xs text-muted-foreground text-center'
        >
          다음 단계로 이동하려면 이메일 인증을 완료해주세요.
        </p>
      )}
    </div>
  );
};
