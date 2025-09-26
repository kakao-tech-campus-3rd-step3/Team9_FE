import type { Quiz } from '../types';

export const quizzes: Quiz[] = [
  {
    quizId: 1,
    title: 'Sample Quiz 1',
    description: 'This is a sample quiz description.',
    timeLimit: 600,
    status: 'COMPLETED',
    score: 7,
    quizCount: 20,
  },
  {
    quizId: 2,
    title: 'Sample Quiz 2',
    description: 'This is a sample quiz description.',
    timeLimit: 900,
    status: 'FAILED',
    score: null,
    quizCount: null,
  },
  {
    quizId: 3,
    title: 'Sample Quiz 3',
    description: 'This is a sample quiz description.',
    timeLimit: 900,
    status: 'CREATING',
    score: null,
    quizCount: null,
  },
  {
    quizId: 4,
    title: 'Sample Quiz 4',
    description: 'This is a sample quiz description.',
    timeLimit: 900,
    status: 'READY',
    score: null,
    quizCount: null,
  },
  {
    quizId: 5,
    title: 'Sample Quiz 5',
    description: 'This is a sample quiz description.',
    timeLimit: 900,
    status: 'READY',
    score: null,
    quizCount: null,
  },
];
