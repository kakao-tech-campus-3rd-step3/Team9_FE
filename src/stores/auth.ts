/**
 * 인증 상태 관리 스토어
 */

import { create } from 'zustand';
import type { StudyRole } from '@/types';

// 인증 사용자 정보 (프로필 스펙과 일치)
export type AuthUser = {
  nickname: string;
  imageKey: string;
  imageUrl?: string; // 캐시된 이미지 URL
  // 현재 선택된 스터디의 타이틀과 역할 (선택적, 하나만 유지)
  currentStudy?: {
    title: string;
    role: StudyRole;
  };
};

// 인증 스토어 상태
type AuthState = {
  // 사용자 정보 (프로필)
  user: AuthUser;
  accessToken: string | null;

  // 인증 상태
  isInitialized: boolean;
  isInitializing: boolean;

  // 액션
  setUser: (user: AuthUser) => void;
  setUserImageUrl: (imageUrl: string) => void;
  setCurrentStudy: (study: AuthUser['currentStudy'] | null) => void;
  setAccessToken: (token: string | null) => void;
  setIsInitialized: (status: boolean) => void;
  setIsInitializing: (status: boolean) => void;
  reset: () => void;
};

// 인증 스토어
export const useAuthStore = create<AuthState>((set) => ({
  // 초기 상태
  user: { nickname: '', imageKey: '' },
  accessToken: null,
  isInitialized: false,
  isInitializing: false,

  // 액션
  setUser: (user) => set({ user }),
  setUserImageUrl: (imageUrl) =>
    set((state) => ({
      user: { ...state.user, imageUrl },
    })),
  setCurrentStudy: (study) =>
    set((state) => ({
      user: { ...state.user, currentStudy: study || undefined },
    })),
  setAccessToken: (token) => set({ accessToken: token }),
  setIsInitialized: (status) => set({ isInitialized: status }),
  setIsInitializing: (status) => set({ isInitializing: status }),
  reset: () =>
    set({
      user: { nickname: '', imageKey: '', imageUrl: undefined },
      accessToken: null,
      isInitialized: false,
      isInitializing: false,
    }),
}));
