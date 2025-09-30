import apiClient from '@/api';
import { MATERIAL_ENDPOINTS } from '@/api/constants';
import type { MaterialListParams, MaterialUploadPayload } from '../types';

// 자료관리 API 그룹
export const MaterialsService = {
  create: async (studyId: number, payload: MaterialUploadPayload) => {
    const { data } = await apiClient.post(
      MATERIAL_ENDPOINTS.CREATE(studyId),
      JSON.stringify(payload),
      { headers: { 'Content-Type': 'application/json' } },
    );
    return data;
  },

  update: async (materialId: number, payload: MaterialUploadPayload) => {
    const { data } = await apiClient.put(
      MATERIAL_ENDPOINTS.UPDATE(materialId),
      JSON.stringify(payload),
      { headers: { 'Content-Type': 'application/json' } },
    );
    return data;
  },

  deleteMany: async (materialIds: number[]) => {
    await apiClient.delete(MATERIAL_ENDPOINTS.DELETE_MANY(), {
      params: { material_ids: materialIds.join(',') },
      showToast: false,
    });
  },

  list: async (params: MaterialListParams) => {
    const {
      studyId,
      category,
      week,
      keyword,
      page = 0,
      size = 10,
      sort,
    } = params;
    const query: Record<string, string> = {
      page: String(page),
      size: String(size),
    };
    if (keyword) query.keyword = keyword;
    if (sort) query.sort = sort;
    if (category && category.length > 0) query.category = category.join(',');
    if (week && week.length > 0) query.week = week.join(',');

    const { data } = await apiClient.get(MATERIAL_ENDPOINTS.LIST(studyId), {
      params: query,
      // 공지 카테고리 등 일부 조합에서 서버가 400을 반환할 수 있어 토스트는 숨김
      showToast: false,
    });
    // 백엔드 응답 형태 호환 처리: { materials: [] } | { json: [] } | []
    const materials = Array.isArray(data?.materials)
      ? data.materials
      : Array.isArray(data?.json)
        ? data.json
        : Array.isArray(data)
          ? data
          : [];
    return {
      materials,
      has_next: Boolean(data?.has_next),
      page: data?.page,
      size: data?.size,
    };
  },

  detail: async (materialId: number) => {
    const { data } = await apiClient.get(MATERIAL_ENDPOINTS.DETAIL(materialId));
    return data;
  },

  recent: async (studyId: number) => {
    const { data } = await apiClient.get(MATERIAL_ENDPOINTS.RECENT(studyId));
    return data;
  },
};

export default MaterialsService;
