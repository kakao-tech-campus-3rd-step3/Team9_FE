type Schedule = {
  schedule_id: number;
  title: string;
  start_time: string;
  end_time: string;
};

type StudySchedule = {
  study_id: number;
  schedule: Schedule[];
};

export const schedules: StudySchedule = {
  study_id: 1,
  schedule: [
    {
      schedule_id: 1,
      title: '영어 스터디 1회차',
      start_time: '2025-09-01T10:00:00Z',
      end_time: '2025-09-01T12:00:00Z',
    },
    {
      schedule_id: 2,
      title: '영어 스터디 2회차',
      start_time: '2025-09-08T11:00:00Z',
      end_time: '2025-09-08T13:00:00Z',
    },
    {
      schedule_id: 3,
      title: '영어 스터디 3회차',
      start_time: '2025-09-15T10:00:00Z',
      end_time: '2025-09-15T12:00:00Z',
    },
  ],
} as const;
