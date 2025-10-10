/**
 * 문서 관리 페이지 유틸리티 함수들
 */

/**
 * 파일 크기를 읽기 쉬운 형태로 변환
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 날짜를 한국어 형식으로 포맷
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * 주차 이름 포맷
 */
export const formatWeekName = (week: string): string => {
  return `${week.replace('week', '')}주차`;
};

// ===== 업로드/수정 페이로드 유틸 =====
import type {
  Attachment,
  Material,
  MaterialFormData,
  UploadFileItem,
} from '../types';
import { MATERIAL_CATEGORY_TO_API, API_CATEGORY_TO_KR } from '../constants';
import { MATERIAL_CATEGORIES, MATERIAL_CATEGORIES_KR } from '../constants';

/** 첨부파일을 폼 파일 스키마로 변환 */
export const mapAttachmentsToUploadItems = (
  attachments: Attachment[],
): UploadFileItem[] => {
  return attachments.map((a) => {
    const ext = (a.type?.split('/')[1] || '').toLowerCase();
    const guessedExt = ext
      ? `.${ext}`
      : `.${(a.name.split('.').pop() || '').toLowerCase()}`;
    return {
      id: Number.isNaN(Number(a.id)) ? null : (Number(a.id) as number) || null,
      name: a.name,
      key: a.url || '', // TODO: 실제 스토리지 키로 대체 필요
      size: a.size,
      file_type: guessedExt,
    };
  });
};

/** 폼 데이터를 업로드/수정 API 바디로 변환 */
// 요청 바디 변환: 현재 API 테스트에 필요한 필드만 유지
export const buildMaterialRequestBody = (form: MaterialFormData) => {
  const rawCategory = String(form.category ?? '').trim();
  const upperCategory = rawCategory.toUpperCase();
  const apiCategory =
    MATERIAL_CATEGORY_TO_API[rawCategory] ??
    (['NOTICE', 'LEARNING', 'ASSIGNMENT', 'MATERIAL'].includes(upperCategory)
      ? upperCategory === 'MATERIAL'
        ? 'LEARNING'
        : upperCategory
      : 'LEARNING');

  const basePayload = {
    title: form.title,
    category: apiCategory,
    content: form.content,
    // files: 서버 요구사항에 맞게 항상 배열 포함 (빈 경우 [])
    files: (Array.isArray(form.files) ? form.files : []).map((f) => ({
      id: f.id,
      name: f.name,
      key: f.key,
      size: f.size,
      file_type: f.file_type,
    })),
  };

  // week를 항상 포함 (주신 요청 바디 형식과 동일하게 맞춤)
  const isLearning = basePayload.category === 'LEARNING';
  return {
    ...basePayload,
    week: isLearning ? form.week : null,
  };
};

/** 백엔드 목록 아이템을 프런트 `Material`로 매핑 */
export interface ApiFileItem {
  id: number | null;
  name: string;
  key: string;
  size: number;
  file_type: string;
}

export interface ApiMaterialListItem {
  id: number;
  title: string;
  content?: string;
  week: number | string;
  category: string;
  files?: ApiFileItem[];
  // 대체 스키마: 프론트가 이미 정규화한 응답을 다시 소비하는 경우
  attachments?: Array<{
    id?: string | number;
    name: string;
    size?: number | string;
    type?: string;
    url?: string;
  }>;
  // 스웨거 스키마: 파일 키 배열만 제공되는 경우
  file_keys?: string[];
  nickname?: string; // 업로더명
  userId?: number | string;
  // 백엔드가 배열 대신 개수만 주는 경우 대비
  file_count?: number | string;
  files_count?: number | string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export const mapApiListItemToMaterial = (
  item: ApiMaterialListItem,
): Material => {
  const krCategory = API_CATEGORY_TO_KR[item.category] ?? item.category;
  const filesFromApi = Array.isArray(item.files) ? item.files : [];
  const attachmentsFromApi = Array.isArray(item.attachments)
    ? item.attachments.map((a) => ({
        id: String(a.id ?? ''),
        name: a.name,
        size: Number(a.size ?? 0) || 0,
        type: a.type ?? '',
        url: a.url ?? '',
      }))
    : [];
  const attachmentsFromKeys = Array.isArray(item.file_keys)
    ? item.file_keys.map((key, idx) => ({
        id: String(idx),
        name: key.split('/').pop() || '첨부파일',
        size: 0,
        type: '',
        url: key,
      }))
    : [];
  const fallbackCount = Number(item.file_count ?? item.files_count ?? 0) || 0;
  const attachments =
    attachmentsFromApi.length > 0
      ? attachmentsFromApi
      : attachmentsFromKeys.length > 0
        ? attachmentsFromKeys
        : filesFromApi.length > 0
          ? filesFromApi.map((f) => ({
              id: String(f.id ?? ''),
              name: f.name,
              size: Number(f.size) || 0,
              type: f.file_type,
              url: f.key, // 다운로드 유틸에 key 전달
            }))
          : fallbackCount > 0
            ? // 파일 상세가 없고 개수만 제공되는 경우, 표시 목적의 플레이스홀더 생성
              Array.from({ length: fallbackCount }).map((_, idx) => ({
                id: String(idx),
                name: '첨부파일',
                size: 0,
                type: '',
                url: '',
              }))
            : [];

  return {
    id: String(item.id),
    title: item.title,
    content: item.content ?? '',
    week: Number(item.week) || 0,
    // 서버 코드를 폼 표시용 한글로 역매핑
    category: krCategory,
    attachments,
    createdAt: item.created_at ?? item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updated_at ?? item.updatedAt ?? new Date().toISOString(),
  };
};

// ===== 표시용 이름 변환 유틸 =====
export const getWeekNameById = (weekCategoryId: string): string => {
  return (
    MATERIAL_CATEGORIES.find((cat) => cat.id === weekCategoryId)?.name ||
    weekCategoryId
  );
};

export const getCategoryKrName = (categoryId: string): string => {
  return (
    MATERIAL_CATEGORIES_KR.find((t) => t.id === categoryId)?.name || categoryId
  );
};
