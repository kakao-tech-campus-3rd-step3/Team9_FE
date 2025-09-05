/**
 * 클래스명을 결합하는 유틸리티 함수
 * 중복 클래스명을 자동으로 정리
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
