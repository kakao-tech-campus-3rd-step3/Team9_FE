/**
 * 인증 상태 관리 스토어
 */

import { create } from 'zustand';
import type { StudyRole } from '@/types';

// 인증 사용자 정보 (프로필 스펙과 일치)
export type AuthUser = {
  nickname: string;
  imageKey: string;
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
  isLogin: boolean;
  isInitialized: boolean;

  // 액션
  setUser: (user: AuthUser) => void;
  setCurrentStudy: (study: AuthUser['currentStudy'] | null) => void;
  setAccessToken: (token: string | null) => void;
  setIsLogin: (status: boolean) => void;
  setIsInitialized: (status: boolean) => void;
  reset: () => void;
};

// 인증 스토어
export const useAuthStore = create<AuthState>((set) => ({
  // 초기 상태
  user: { nickname: '', imageKey: '' },
  accessToken: null,
  isLogin: false,
  isInitialized: false,

  // 액션
  setUser: (user) => set({ user }),
  setCurrentStudy: (study) =>
    set((state) => ({
      user: { ...state.user, currentStudy: study || undefined },
    })),
  setAccessToken: (token) => set({ accessToken: token }),
  setIsLogin: (status) => set({ isLogin: status }),
  setIsInitialized: (status) => set({ isInitialized: status }),
  reset: () =>
    set({
      user: { nickname: '', imageKey: '' },
      accessToken: null,
      isLogin: false,
    }),
}));
