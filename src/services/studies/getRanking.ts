import apiClient from '@/api';
import { studyEndpoints } from '@/api/constants';

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
    studyEndpoints.ranking(studyId),
    { showToast: false },
  );
  return data;
};

export const getMyRanking = async (
  studyId: number,
): Promise<MyRankingApiResponse> => {
  const { data } = await apiClient.get<MyRankingApiResponse>(
    studyEndpoints.myRanking(studyId),
    { showToast: false },
  );
  return data;
};
