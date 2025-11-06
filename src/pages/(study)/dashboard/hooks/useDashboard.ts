// 대시보드 데이터 수집 훅: 공지/일정/진척도/회고/랭킹(내 순위, 목록) 쿼리를 제공
import { useQuery } from '@tanstack/react-query';
import { studyKeys } from '@/constants/queryKeys/study';
import { getStudyDashboard } from '@/services/studies/getDashboard';
import { getMyProgress } from '@/services/studies/getMyProgress';
import { getPastSchedules } from '@/services/studies/getPastSchedules';
import { getMyRanking, getRankingList } from '@/services/studies/getRanking';
import { getRecentQuizzes } from '@/services/studies/getRecentQuizzes';
import {
  mapDashboardNotice,
  mapDashboardSchedule,
  mapMyProgress,
  mapPastSchedulesToRetrospect,
  mapMyRanking,
  mapRankingList,
  mapRecentQuizzesToQuizData,
} from '../utils';

type UseDashboardOptions = {
  enableRankingList?: boolean;
};

export const useDashboardQuery = (
  studyId: number,
  options: UseDashboardOptions = {},
) => {
  const commonQueryOpts = {
    staleTime: 30_000,
    gcTime: 300_000,
    refetchOnWindowFocus: false,
  } as const;

  const dashboard = useQuery({
    queryKey: studyKeys.dashboard(studyId),
    queryFn: () => getStudyDashboard(studyId),
    select: (data) => {
      const latestNotice = mapDashboardNotice(data.latest_notice);
      const upcomingSchedule = mapDashboardSchedule(data.upcoming_schedule);
      return {
        studyTitle: data.study_title,
        latestNotice,
        upcomingSchedule,
      };
    },
    ...commonQueryOpts,
  });

  const progress = useQuery({
    queryKey: studyKeys.myStatus(studyId),
    queryFn: () => getMyProgress(studyId),
    select: (data) => mapMyProgress(data),
    ...commonQueryOpts,
  });

  const retrospect = useQuery({
    queryKey: studyKeys.pastSchedules(studyId),
    queryFn: () => getPastSchedules(studyId),
    select: (data) => mapPastSchedulesToRetrospect(data),
    ...commonQueryOpts,
  });

  const myRanking = useQuery({
    queryKey: studyKeys.myRanking(studyId),
    queryFn: () => getMyRanking(studyId),
    select: (data) => mapMyRanking(data),
    ...commonQueryOpts,
  });

  const rankingList = useQuery({
    queryKey: studyKeys.rankingList(studyId),
    queryFn: () => getRankingList(studyId),
    select: (data) => mapRankingList(data),
    enabled: Boolean(options.enableRankingList),
    ...commonQueryOpts,
  });

  // 최근 퀴즈 목록 (기본 3개)
  const quizzesRecent = useQuery({
    queryKey: studyKeys.quizzesRecent(studyId, 3),
    queryFn: () => getRecentQuizzes(studyId, 3),
    select: (data) => mapRecentQuizzesToQuizData(data),
    ...commonQueryOpts,
  });

  return {
    dashboard,
    progress,
    retrospect,
    myRanking,
    rankingList,
    quizzesRecent,
  };
};
