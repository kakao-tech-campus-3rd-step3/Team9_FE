/**
 * 스터디 관련 데이터 상수
 */

// 스터디 카테고리
export const STUDY_CATEGORIES = [
  '전체',
  '어학',
  '취업',
  '고시/공무원',
  '취미/교양',
  '프로그래밍',
  '자율/기타',
] as const;

// 스터디 생성 시 카테고리 (전체 제외)
export const STUDY_CREATE_CATEGORIES = [
  '어학',
  '취업',
  '고시/공무원',
  '취미/교양',
  '프로그래밍',
  '자율/기타',
] as const;

// 최대 참여자 수 옵션
export const MAX_MEMBER_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

// 목업 스터디 데이터
export const MOCK_STUDIES = [
  {
    id: 101,
    title: "React 스터디 '파도' 1기",
    description: '함께 React를 정복할 스터디원을 모집합니다. 초보도 환영!',
    category: '프로그래밍',
    currentMembers: 2,
    maxMembers: 8,
    region: '서울',
    detailedDescription: `미시경제학의 기본 개념부터 응용 문제까지 깊이 파고드는 스터디입니다.
각자 예습한 내용을 공유하고, 토론하며 어려운 이론도 함께 해결해 나갑니다.
복습과 퀴즈로 이해도를 높여 학기 성적과 실무 감각을 동시에 잡는 것을 목표로 합니다.`,
    schedule: '매주 토요일 오후 2시',
    duration: '2시간',
    requirements: [
      '해당 분야에 대한 기본적인 관심',
      '정기적인 참여 가능',
      '적극적인 소통과 협력',
    ],
  },
  {
    id: 102,
    title: 'TOEIC 900+ 목표 스터디',
    description: '함께 TOEIC 900점을 목표로 하는 스터디입니다.',
    category: '어학',
    currentMembers: 5,
    maxMembers: 6,
    region: '경기',
    detailedDescription: `TOEIC 900점 이상을 목표로 하는 스터디입니다.
매주 모여서 문제를 풀고, 서로의 약점을 보완해 나갑니다.
실전 문제 위주로 진행하며, 매주 모의고사를 통해 실력을 점검합니다.`,
    schedule: '매주 일요일 오전 10시',
    duration: '3시간',
    requirements: [
      'TOEIC 700점 이상',
      '정기적인 참여 가능',
      '적극적인 소통과 협력',
    ],
  },
  {
    id: 103,
    title: '취업 준비 스터디',
    description: '취업 준비를 함께하는 스터디입니다.',
    category: '취업',
    currentMembers: 3,
    maxMembers: 5,
    region: '인천',
    detailedDescription: `취업 준비를 함께하는 스터디입니다.
이력서 작성, 면접 준비, 포트폴리오 제작 등을 함께 진행합니다.
서로 피드백을 주고받으며 취업 성공을 목표로 합니다.`,
    schedule: '매주 금요일 오후 7시',
    duration: '2시간',
    requirements: [
      '취업 준비에 대한 의지',
      '정기적인 참여 가능',
      '적극적인 소통과 협력',
    ],
  },
] as const;
