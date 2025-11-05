import apiClient from '@/api';
import { ATTENDANCE_ENDPOINTS } from '@/api/constants';

export type AttendanceMeRequest = {
  schedule_id: number;
  status: boolean;
};

/**
 * 스터디 출석 추가 서비스 (axios thin)
 */
export const attendanceMeService = async ({
  schedule_id,
  status,
}: AttendanceMeRequest) => {
  const { data } = await apiClient.patch<AttendanceMeRequest>(
    ATTENDANCE_ENDPOINTS.ATTENDANCES_ME(schedule_id),
    { status },
  );

  // 백엔드가 200 또는 204로 빈 바디를 반환할 수 있음.
  // 이 경우에도 요청은 성공이므로 예외를 던지지 않고 응답 데이터를 그대로 반환하거나
  // 빈 객체를 반환하여 호출 측이 정상 처리하도록 허용한다.
  if (data === null || data === undefined) {
    return {} as AttendanceMeRequest;
  }

  return data;
};
