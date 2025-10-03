/**
 * 공개 API 클라이언트
 */

import axios from 'axios';

// API 기본 URL 설정
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://gogumalatte.site';

// 공개 API 클라이언트 (인증 불필요한 API용)
export const publicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default publicClient;
