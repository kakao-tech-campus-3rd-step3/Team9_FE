/**
 * 채팅 관련 시간 유틸리티 함수들
 */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 서버에서 받은 UTC 시간을 한국 시간으로 변환
 * @param utcTimestamp - 서버에서 받은 UTC 시간 문자열
 * @returns 한국 시간으로 변환된 Date 객체
 */
export function convertUtcToKoreanTime(utcTimestamp: string): Date {
  return dayjs.utc(utcTimestamp).tz('Asia/Seoul').toDate();
}

/**
 * 현재 한국 시간을 반환
 * @returns 현재 한국 시간 Date 객체
 */
export function getCurrentKoreanTime(): Date {
  return dayjs().tz('Asia/Seoul').toDate();
}

/**
 * 시간을 한국 시간대로 포맷팅
 * @param date - 포맷팅할 Date 객체
 * @returns HH:mm 형식의 시간 문자열
 */
export function formatKoreanTime(date: Date): string {
  return dayjs(date).tz('Asia/Seoul').format('HH:mm');
}

/**
 * 두 날짜가 같은 날인지 확인
 * @param date1 - 첫 번째 Date 객체
 * @param date2 - 두 번째 Date 객체
 * @returns 같은 날이면 true
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  const d1 = dayjs(date1).tz('Asia/Seoul');
  const d2 = dayjs(date2).tz('Asia/Seoul');
  return d1.isSame(d2, 'day');
}

/**
 * 날짜를 채팅 메시지용 날짜 헤더 형식으로 포맷팅
 * @param date - 포맷팅할 Date 객체
 * @returns 날짜 헤더 문자열 (오늘, 어제, 날짜 등)
 */
export function formatDateHeader(date: Date): string {
  const targetDate = dayjs(date).tz('Asia/Seoul');
  const today = dayjs().tz('Asia/Seoul');
  const yesterday = today.subtract(1, 'day');

  // 오늘
  if (targetDate.isSame(today, 'day')) {
    return '오늘';
  }

  // 어제
  if (targetDate.isSame(yesterday, 'day')) {
    return '어제';
  }

  // 같은 년도인 경우
  if (targetDate.year() === today.year()) {
    return targetDate.format('M월 D일');
  }

  // 다른 년도인 경우
  return targetDate.format('YYYY년 M월 D일');
}
