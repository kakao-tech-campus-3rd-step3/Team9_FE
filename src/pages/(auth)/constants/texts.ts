import { GENDERS, INTERESTS, REGIONS } from '@/constants';

/**
 * 인증 페이지 텍스트 상수
 */
export const AUTH_TEXTS = {
  LOGIN: {
    TITLE: '반가워요!',
    SUBTITLE: '로그인하고 스터디를 시작하세요.',
    EMAIL_PLACEHOLDER: '이메일',
    PASSWORD_PLACEHOLDER: '비밀번호',
    REMEMBER_ME: '아이디 기억하기',
    BUTTON: '로그인',
    ERROR_MESSAGE: '로그인에 실패했습니다. 다시 시도해주세요.',
    SIGNUP_LINK: '파도가 처음이신가요?',
    SIGNUP_TEXT: '회원가입',
  },
  SIGNUP: {
    STEP1: {
      TITLE: '파도 시작하기',
      SUBTITLE: '서비스 이용에 필요한 기본 정보를 입력해주세요',
      EMAIL_PLACEHOLDER: '이메일',
      EMAIL_VERIFY_BUTTON: '인증번호 전송',
      VERIFY_CODE_PLACEHOLDER: '인증번호 6자리',
      VERIFY_BUTTON: '인증 확인',
      PASSWORD_PLACEHOLDER: '비밀번호',
      CONFIRM_PASSWORD_PLACEHOLDER: '비밀번호 확인',
      NEXT_BUTTON: '다음으로',
    },
    STEP2: {
      TITLE: '프로필 정보',
      SUBTITLE: '스터디 활동에 필요한 프로필을 완성해주세요',
      NICKNAME_PLACEHOLDER: '닉네임 (2~10자)',
      NICKNAME_CHECK_BUTTON: '중복 확인',
      GENDER_TITLE: '성별',
      GENDERS,
      INTEREST_TITLE: '관심 분야 (1개 이상 선택)',
      INTERESTS,
      REGION_TITLE: '지역',
      REGIONS,
      COMPLETE_BUTTON: '회원가입 완료',
    },
    LOGIN_LINK: '이미 계정이 있으신가요?',
    LOGIN_TEXT: '로그인',
  },
} as const;
