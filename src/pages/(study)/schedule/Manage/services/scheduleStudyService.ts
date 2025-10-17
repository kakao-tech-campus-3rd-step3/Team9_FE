import apiClient from '@/api';
import { SCHEDULE_ENDPOINTS } from '@/api/constants';

type scheduleStudyResponse = {
  schedule_id: number;
  title: string;
  start_time: string;
  end_time: string;
}[];

type ScheduleStudyRequest = {
  study_id: number;
};

/**
 * 스터디 스케줄 서비스 (axios thin)
 */
export const scheduleStudyService = async ({
  study_id,
}: ScheduleStudyRequest): Promise<scheduleStudyResponse> => {
  const { data } = await apiClient.get<scheduleStudyResponse>(
    SCHEDULE_ENDPOINTS.STUDY(study_id),
  );

  if (!data) {
    throw new Error('스터디 일정 정보 조회에 실패했습니다.');
  }

  return data;
};
