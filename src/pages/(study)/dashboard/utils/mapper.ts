import dayjs from 'dayjs';
import type { DashboardApiResponse } from '@/services/studies/getDashboard';
import type { Notice, Schedule } from '../types';
import type { ProgressData } from '../types';
import type { ProgressMeApiResponse } from '@/services/studies/getMyProgress';
import type { PastSchedulesApiResponse } from '@/services/studies/getPastSchedules';
import type {
  MyRankingApiResponse,
  RankingListApiResponse,
  RankingListApiResponseItem,
} from '@/services/studies/getRanking';
import type { RecentQuizzesApiResponse } from '@/services/studies/getRecentQuizzes';

// 최신 공지 매핑: API 응답을 Notice 타입으로 변환
export const mapDashboardNotice = (
  api: DashboardApiResponse['latest_notice'],
): Notice | undefined => {
  if (!api) return undefined;
  return {
    id: api.notice_id,
    title: api.title,
    content: '',
    author: api.author_name,
    createdAt: api.created_at,
    isImportant: false,
  };
};

// 다가오는 일정 매핑: 표시용 날짜/시간 문자열 생성
export const mapDashboardSchedule = (
  api: DashboardApiResponse['upcoming_schedule'],
): Schedule | undefined => {
  if (!api) return undefined;
  return {
    id: api.schedule_id,
    title: api.title,
    date: dayjs(api.start_time).format('YYYY-MM-DD'),
    time: dayjs(api.start_time).format('HH:mm'),
    type: 'study',
    participants: [`참여자 ${api.participant_count}/${api.total_member_count}`],
  };
};

// 내 진척도 매핑: 총량 부재로 우선 current=total=100% 처리
export const mapMyProgress = (
  api: ProgressMeApiResponse,
): ProgressData | undefined => {
  const me = api?.progressMemberStatusDto?.[0];
  if (!me) return undefined;
  const attendance = me.attendance_count ?? 0;
  const quiz = me.quiz_count ?? 0;
  const reflection = me.reflection_count ?? 0;
  return {
    attendance: {
      current: attendance,
      total: attendance,
      percentage: 100,
    },
    quiz: {
      current: quiz,
      total: quiz,
      percentage: 100,
    },
    reflection: {
      current: reflection,
      total: reflection,
      percentage: 100,
    },
  };
};

// 회고 대상 일정 매핑: 최소 필드만 변환 (날짜 미제공)
export const mapPastSchedulesToRetrospect = (api: PastSchedulesApiResponse) => {
  const pendingSchedules = (api || []).map((item) => ({
    id: item.schedule_id,
    title: item.schedule_title,
    date: '',
    type: 'study' as const,
  }));
  return {
    pendingSchedules,
    totalCount: pendingSchedules.length,
  };
};

// 내 랭킹 매핑: 점수/순위 변환
export const mapMyRanking = (api?: MyRankingApiResponse) => {
  if (!api) return undefined;
  return { rank: api.my_rank, score: api.my_score };
};

// 랭킹 표 매핑: 테이블 행에 필요한 필드로 정규화
export type RankingListItem = {
  rank: number;
  score: number;
  userName: string;
  userId: number;
};

export const mapRankingList = (
  api?: RankingListApiResponse,
): RankingListItem[] => {
  const list: RankingListApiResponseItem[] = api?.ranking ?? [];
  return list.map((item) => ({
    rank: item.rank,
    score: item.score,
    userId: item.userId,
    userName: item.userName,
  }));
};

// 최근 퀴즈 목록 → QuizWidget 표시용 데이터 (목록 그대로 반환)
export const mapRecentQuizzesToQuizData = (api?: RecentQuizzesApiResponse) => {
  const arr = Array.isArray(api) ? api : [];
  return arr;
};
