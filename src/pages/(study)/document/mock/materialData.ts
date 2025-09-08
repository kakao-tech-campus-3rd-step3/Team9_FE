import type { Material } from '../types';

// 문서 관리 페이지 목 데이터
export const mockMaterials: Material[] = [
  {
    id: '1',
    title: '1차시 학습 자료',
    content: '1차시 학습 내용입니다.',
    category: 'week1',
    attachments: [
      {
        id: 'att1',
        name: 'week1.pdf',
        size: 1024000,
        type: 'application/pdf',
        url: '/files/week1.pdf',
      },
      {
        id: 'att2-1',
        name: 'week2.pdf',
        size: 1024000,
        type: 'application/pdf',
        url: '/files/week2.pdf',
      },
    ],
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-01-15T09:00:00Z',
  },
  {
    id: '2',
    title: '2차시 학습 자료',
    content: '2차시 학습 내용입니다.',
    category: 'week1',
    attachments: [
      {
        id: 'att2-2',
        name: 'week2.md',
        size: 512000,
        type: 'text/markdown',
        url: '/files/week2.md',
      },
      {
        id: 'att3',
        name: 'examples.zip',
        size: 2048000,
        type: 'application/zip',
        url: '/files/examples.zip',
      },
    ],
    createdAt: '2025-01-16T10:30:00Z',
    updatedAt: '2025-01-16T10:30:00Z',
  },
  {
    id: '3',
    title: '3차시 학습 자료',
    content: '3차시 학습 내용입니다.',
    category: 'week2',
    attachments: [],
    createdAt: '2025-01-20T14:15:00Z',
    updatedAt: '2025-01-20T14:15:00Z',
  },
  {
    id: '4',
    title: '4차시 학습 자료',
    content: '4차시 학습 내용입니다.',
    category: 'week2',
    attachments: [
      {
        id: 'att4',
        name: 'week4.pptx',
        size: 3072000,
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        url: '/files/week4.pptx',
      },
    ],
    createdAt: '2025-01-22T11:45:00Z',
    updatedAt: '2025-01-22T11:45:00Z',
  },
  {
    id: '5',
    title: '5차시 학습 자료',
    content: '5차시 학습 내용입니다.',
    category: 'week3',
    attachments: [
      {
        id: 'att5',
        name: 'week5.pdf',
        size: 1536000,
        type: 'application/pdf',
        url: '/files/week5.pdf',
      },
    ],
    createdAt: '2025-01-25T16:20:00Z',
    updatedAt: '2025-01-25T16:20:00Z',
  },
];
