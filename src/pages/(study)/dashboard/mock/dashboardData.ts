import type {
  Notice,
  Document,
  Schedule,
  StudyInfo,
  MyRanking,
} from '../types';

export const mockNotices: Notice[] = [
  {
    id: 1,
    title: '이번 주 스터디 일정 안내',
    content:
      '금요일 오후 2시에 온라인 스터디가 진행됩니다. React 컴포넌트 설계와 TypeScript 타입 정의에 대해 심화 학습을 진행할 예정입니다. 사전에 관련 자료를 미리 학습해주시기 바랍니다.',
    author: '춘식이',
    createdAt: '2024-01-15',
    isImportant: true,
  },
  {
    id: 2,
    title: '과제 제출 마감일 연기',
    content:
      '기존 마감일에서 3일 연기되었습니다. 추가 시간을 활용하여 더 완성도 높은 결과물을 만들어주세요. 질문사항이 있으면 언제든 연락주세요.',
    author: '매니저',
    createdAt: '2024-01-14',
    isImportant: false,
  },
];

export const mockDocuments: Document[] = [
  {
    id: 1,
    title: 'React 기초 강의 자료.pdf',
    type: 'pdf',
    size: '2.3MB',
    uploadedBy: '춘식이',
    uploadedAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'TypeScript 핵심 개념.pptx',
    type: 'ppt',
    size: '5.1MB',
    uploadedBy: '강사',
    uploadedAt: '2024-01-14',
  },
];

export const mockSchedules: Schedule[] = [
  {
    id: 1,
    title: 'React 컴포넌트 설계 스터디',
    date: '2025-09-10',
    time: '14:00',
    type: 'study',
    participants: ['춘식이', '스터디원1', '스터디원2'],
  },
  {
    id: 2,
    title: '프로젝트 기획 회의',
    date: '2025-09-12',
    time: '10:00',
    type: 'meeting',
    participants: ['전체'],
  },
  {
    id: 3,
    title: '과제 제출 마감',
    date: '2025-09-15',
    time: '23:59',
    type: 'deadline',
    participants: ['전체'],
  },
];

export const mockStudyInfo: StudyInfo = {
  name: '카테캠 FE 스터디 3기',
};

export const mockMyRanking: MyRanking = {
  rank: 3,
  score: 82,
};
