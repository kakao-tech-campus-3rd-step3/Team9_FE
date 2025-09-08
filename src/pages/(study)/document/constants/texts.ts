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

// 타입 정의
export type MaterialCategoryId = (typeof MATERIAL_CATEGORIES)[number]['id'];
export type ToastMessageKey = keyof typeof TOAST_MESSAGES;
