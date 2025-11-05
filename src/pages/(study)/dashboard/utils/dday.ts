import dayjs from 'dayjs';

/**
 * D-Day 계산 유틸 함수 (dayjs 기반)
 */

/**
 * 날짜 문자열을 기준으로 D-Day를 계산합니다
 * @param dateString - 날짜 문자열 (YYYY-MM-DD 또는 ISO)
 * @returns D-Day 문자열 (오늘, 내일, D-N 등)
 */
export const calculateDday = (dateString: string): string => {
  const today = dayjs().startOf('day');
  const target = dayjs(dateString).startOf('day');
  const diffDays = target.diff(today, 'day');

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '내일';
  if (diffDays === -1) return '어제';
  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays < 0) return `D+${Math.abs(diffDays)}`;
  return '오늘';
};

/**
 * D-Day에 따른 색상 클래스를 반환합니다
 * @param dateString - 날짜 문자열 (YYYY-MM-DD 또는 ISO)
 * @returns Tailwind CSS 클래스 문자열
 */
export const getDdayColor = (dateString: string): string => {
  const today = dayjs().startOf('day');
  const target = dayjs(dateString).startOf('day');
  const diffDays = target.diff(today, 'day');

  if (diffDays === 0) return 'bg-primary text-primary-foreground';
  if (diffDays === 1) return 'bg-warning text-warning-foreground';
  if (diffDays > 0) return 'bg-success text-success-foreground';
  if (diffDays < 0) return 'bg-muted text-muted-foreground';
  return 'bg-primary text-primary-foreground';
};
