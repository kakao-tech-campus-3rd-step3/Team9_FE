export * from './authEndpoints';
export * from './uploadEndpoints';
export * from './usersEndpoints';
export * from './materialEndpoints';
export * from './quizEndpoints';
export * from './scheduleEndpoints';
export * from './studyEndpoints';
export * from './attendanceEndpoints';

// 명시적 export (Vite 캐시 문제 방지)
export { STUDY_ENDPOINTS } from './studyEndpoints';
