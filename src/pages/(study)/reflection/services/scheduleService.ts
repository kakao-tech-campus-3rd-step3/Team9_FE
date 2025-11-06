import apiClient from '@/api';
import { SCHEDULE_ENDPOINTS } from '@/api/constants';
import type { Schedule } from '../types';

type SchedulePastResponse = {
  schedule_id: number;
  schedule_title: string;
}[];

/**
 * 회고 작성 가능한 과거 스터디 일정 조회 서비스
 */
export const schedulePastService = async (
  studyId: number,
): Promise<Schedule[]> => {
  const { data } = await apiClient.get<SchedulePastResponse>(
    SCHEDULE_ENDPOINTS.PAST(studyId),
  );

  if (!data) {
    throw new Error('과거 스터디 일정 정보 조회에 실패했습니다.');
  }

  // API 응답이 이미 Schedule 타입과 일치하므로 그대로 반환
  return data;
};
