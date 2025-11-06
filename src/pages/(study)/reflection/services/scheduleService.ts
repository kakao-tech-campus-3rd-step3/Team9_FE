import apiClient from '@/api';
import { SCHEDULE_ENDPOINTS } from '@/api/constants';
import type { Schedule } from '../types';

type SchedulePastResponse = {
  schedule_id: number;
  schedule_title: string;
}[];

type ScheduleStudyResponse = {
  schedule_id: number;
  title: string;
  start_time: string;
  end_time: string;
}[];

/**
 * 회고 작성 가능한 과거 스터디 일정 조회 서비스
 * 백엔드 API가 빈 배열을 반환하는 경우, 일반 일정 API를 호출하여 클라이언트에서 필터링
 */
export const schedulePastService = async (
  studyId: number,
): Promise<Schedule[]> => {
  const endpoint = SCHEDULE_ENDPOINTS.PAST(studyId);
  const now = new Date();

  try {
    const { data } = await apiClient.get<SchedulePastResponse>(endpoint);

    // 백엔드 API가 과거 일정을 반환한 경우
    if (data && data.length > 0) {
      return data;
    }

    // 백엔드 API가 빈 배열을 반환한 경우, 일반 일정 API를 호출하여 클라이언트에서 필터링
    try {
      const { data: allSchedules } = await apiClient.get<ScheduleStudyResponse>(
        SCHEDULE_ENDPOINTS.STUDY(studyId),
      );

      if (allSchedules && Array.isArray(allSchedules)) {
        // 클라이언트에서 과거 일정 필터링
        const pastSchedules: Schedule[] = allSchedules
          .filter((schedule) => {
            if (!schedule.end_time) return false;
            const endTime = new Date(schedule.end_time);
            return endTime < now;
          })
          .map((schedule) => ({
            schedule_id: schedule.schedule_id,
            schedule_title: schedule.title,
          }));

        return pastSchedules;
      }
    } catch {
      // 대체 로직 실패 시 빈 배열 반환
    }

    return [];
  } catch {
    // 에러 발생 시 빈 배열 반환하여 페이지가 크래시되지 않도록 함
    return [];
  }
};
