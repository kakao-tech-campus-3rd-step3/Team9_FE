type Schedule = {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
};

type Study = {
  study_id: number;
  title: string;
  schedule: Schedule[];
};

type Dashboard = {
  studies: Study[];
};

export const mainDashboard: Dashboard[] = [
  {
    studies: [
      {
        study_id: 1,
        title: '영어 스터디',
        schedule: [
          {
            id: 1,
            title: '영어 스터디 1회차',
            start_time: '2025-09-01T10:00:00Z',
            end_time: '2025-09-01T12:00:00Z',
          },
          {
            id: 1,
            title: '영어 스터디 2회차',
            start_time: '2025-09-08T10:00:00Z',
            end_time: '2025-09-08T12:00:00Z',
          },
          {
            id: 1,
            title: '영어 스터디 3회차',
            start_time: '2025-09-15T10:00:00Z',
            end_time: '2025-09-15T12:00:00Z',
          },
        ],
      },
      {
        study_id: 2,
        title: '면접 스터디',
        schedule: [
          {
            id: 1,
            title: '면접 스터디 1회차',
            start_time: '2025-09-01T10:00:00Z',
            end_time: '2025-09-01T12:00:00Z',
          },
        ],
      },
      {
        study_id: 3,
        title: "(예시) React 스터디 '파도' 1기",
        schedule: [
          {
            id: 1,
            title: '파도 스터디 1회차',
            start_time: '2025-09-01T10:00:00Z',
            end_time: '2025-09-01T12:00:00Z',
          },
        ],
      },
      {
        study_id: 4,
        title: '(예시) 토익 900점 목표 스터디',
        schedule: [
          {
            id: 1,
            title: '(예시) 토익 900점 목표 스터디 1회차',
            start_time: '2025-09-06T10:00:00Z',
            end_time: '2025-09-01T12:00:00Z',
          },
        ],
      },
    ],
  },
] as const;
