import apiClient from '@/api';
import { ATTENDANCE_ENDPOINTS } from '@/api/constants';

type Attendance = {
  status: boolean;
  schedule_date: string;
};

type Member = {
  name: string;
  image_key: string;
  attendance: Attendance[];
};

type AttendanceStudyResponse = {
  members: Member[];
};

type AttendanceStudyRequest = {
  study_id: number;
};

/**
 * 스터디 출석 서비스 (axios thin)
 */
export const attendanceStudyService = async ({
  study_id,
}: AttendanceStudyRequest): Promise<AttendanceStudyResponse> => {
  const { data } = await apiClient.get<AttendanceStudyResponse>(
    ATTENDANCE_ENDPOINTS.STUDY(study_id),
  );

  if (!data) {
    throw new Error('스터디 출석 정보 조회에 실패했습니다.');
  }

  return data;
};
