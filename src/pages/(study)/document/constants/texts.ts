/**
 * 문서 관리 페이지 텍스트 및 메시지 상수 정의
 */

// 주차별 카테고리 설정
export const MATERIAL_CATEGORIES = [
  { id: 'all', name: '전체', week: 0 },
  { id: 'week1', name: '1주차', week: 1 },
  { id: 'week2', name: '2주차', week: 2 },
  { id: 'week3', name: '3주차', week: 3 },
  { id: 'week4', name: '4주차', week: 4 },
  { id: 'week5', name: '5주차', week: 5 },
  { id: 'week6', name: '6주차', week: 6 },
  { id: 'week7', name: '7주차', week: 7 },
  { id: 'week8', name: '8주차', week: 8 },
] as const;

// 자료 카테고리 옵션(폼/API용): 공지 | 학습자료 | 과제
export const MATERIAL_CATEGORY_OPTIONS = [
  { id: '공지', name: '공지' },
  { id: '학습자료', name: '학습자료' },
  { id: '과제', name: '과제' },
] as const;

// 목록 필터용 카테고리(전체 포함). 폼에서는 사용 금지
export const MATERIAL_CATEGORIES_KR = [
  { id: 'all', name: '전체' },
  ...MATERIAL_CATEGORY_OPTIONS,
] as const;

// 토스트 메시지
export const TOAST_MESSAGES = {
  ADD_SUCCESS: '새로운 자료가 성공적으로 추가되었습니다.',
  EDIT_SUCCESS: '자료가 성공적으로 수정되었습니다.',
  DELETE_SUCCESS: '자료가 삭제되었습니다.',
  DELETE_MULTIPLE_SUCCESS: '선택된 자료가 삭제되었습니다.',
  QUIZ_CREATE_SUCCESS: '선택된 자료로 퀴즈가 생성되었습니다.',
} as const;

// 네비게이션 딜레이 (ms)
export const NAVIGATION_DELAY = 1500;

// 기본 카테고리
export const DEFAULT_CATEGORY = 'week1';
export const DEFAULT_WEEK = 1;
export const DEFAULT_MATERIAL_CATEGORY = '학습자료';

// 요청 전용: 한글 카테고리 → API 카테고리 코드 매핑
// 서버가 enum(영문 코드)을 기대하는 것으로 보임
export const MATERIAL_CATEGORY_TO_API: Record<
  string,
  'NOTICE' | 'LEARNING' | 'ASSIGNMENT'
> = {
  공지: 'NOTICE',
  학습자료: 'LEARNING',
  과제: 'ASSIGNMENT',
};

// API 코드 → 한글 카테고리 역매핑 (폼 표시용)
type ApiCategoryMap = Record<string, '공지' | '학습자료' | '과제'>;
export const API_CATEGORY_TO_KR: ApiCategoryMap = {
  NOTICE: '공지',
  LEARNING: '학습자료',
  ASSIGNMENT: '과제',
};

// API가 한글 카테고리를 그대로 사용하므로 별도 매핑이 필요하지 않습니다.

// 타입 정의
export type MaterialCategoryId = (typeof MATERIAL_CATEGORIES)[number]['id'];
export type MaterialCategoryOptionId =
  (typeof MATERIAL_CATEGORY_OPTIONS)[number]['id'];
export type MaterialCategoryKrId =
  (typeof MATERIAL_CATEGORIES_KR)[number]['id'];
export type ToastMessageKey = keyof typeof TOAST_MESSAGES;
