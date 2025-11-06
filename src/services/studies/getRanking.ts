import apiClient from '@/api';
import { DASHBOARD_ENDPOINTS } from '@/api/constants';

export interface RankingListApiResponseItem {
  rank: number;
  score: number;
  userId: number;
  userName: string;
}
export interface RankingListApiResponse {
  ranking: RankingListApiResponseItem[];
}

export interface MyRankingApiResponse {
  my_rank: number;
  my_score: number;
}

export const getRankingList = async (
  studyId: number,
): Promise<RankingListApiResponse> => {
  const { data } = await apiClient.get<RankingListApiResponse>(
    DASHBOARD_ENDPOINTS.RANKING(studyId),
    { showToast: false },
  );
  return data;
};

export const getMyRanking = async (
  studyId: number,
): Promise<MyRankingApiResponse> => {
  const { data } = await apiClient.get<MyRankingApiResponse>(
    DASHBOARD_ENDPOINTS.MY_RANKING(studyId),
    { showToast: false },
  );
  return data;
};
