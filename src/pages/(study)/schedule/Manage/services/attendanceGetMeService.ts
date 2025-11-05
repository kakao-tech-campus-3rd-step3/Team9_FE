import apiClient from '@/api';
import { ATTENDANCE_ENDPOINTS } from '@/api/constants';

type AttendanceGetMeResponse = {
  status: boolean;
};

type AttendanceGetMeRequest = {
  schedule_id: number;
};

/**
 * 스터디 출석 서비스 (axios thin)
 */
export const attendanceGetMeService = async ({
  schedule_id,
}: AttendanceGetMeRequest): Promise<AttendanceGetMeResponse> => {
  const { data } = await apiClient.get<AttendanceGetMeResponse>(
    ATTENDANCE_ENDPOINTS.ME(schedule_id),
  );

  if (!data) {
    throw new Error('스터디 출석 정보 조회에 실패했습니다.');
  }

  return data;
};
