/**
 * 채팅 관련 시간 유틸리티 함수들
 */

/**
 * 서버에서 받은 UTC 시간을 한국 시간으로 변환
 * @param utcTimestamp - 서버에서 받은 UTC 시간 문자열
 * @returns 한국 시간으로 변환된 Date 객체
 */
export function convertUtcToKoreanTime(utcTimestamp: string): Date {
  const utcDate = new Date(utcTimestamp);
  return new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
}

/**
 * 현재 한국 시간을 반환
 * @returns 현재 한국 시간 Date 객체
 */
export function getCurrentKoreanTime(): Date {
  return new Date();
}

/**
 * 시간을 한국 시간대로 포맷팅
 * @param date - 포맷팅할 Date 객체
 * @returns HH:mm 형식의 시간 문자열
 */
export function formatKoreanTime(date: Date): string {
  return date.toLocaleTimeString('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
