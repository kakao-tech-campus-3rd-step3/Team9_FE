/**
 * 공통 상수 정의
 */

// 성별 옵션
export const GENDERS = {
  MALE: '남성',
  FEMALE: '여성',
} as const;

// 관심 분야 옵션
export const INTERESTS = {
  LANGUAGE: '어학',
  EMPLOYMENT: '취업',
  EXAM: '고시/공무원',
  PROGRAMMING: '프로그래밍',
  HOBBY: '취미/교양',
  AUTONOMY: '자율/기타',
} as const;

// 지역 옵션
export const REGIONS = {
  ONLINE: '온라인',
  SEOUL: '서울',
  GYEONGGI: '경기',
  INCHEON: '인천',
  GANGWON: '강원',
  DAEJEON: '대전',
  SEJONG: '세종',
  CHUNGNAM: '충남',
  CHUNGBUK: '충북',
  GWANGJU: '광주',
  JEONNAM: '전남',
  JEONBUK: '전북',
  DAEGU: '대구',
  GYEONGBUK: '경북',
  BUSAN: '부산',
  ULSAN: '울산',
  GYEONGNAM: '경남',
  JEJU: '제주',
} as const;

// 타입 정의 (keyof 사용으로 자동 동기화)
export type GenderKey = keyof typeof GENDERS;
export type InterestKey = keyof typeof INTERESTS;
export type RegionKey = keyof typeof REGIONS;
