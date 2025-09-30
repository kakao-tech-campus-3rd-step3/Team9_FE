import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';
import { MaterialsService } from '../services';
import { mapApiListItemToMaterial } from '../utils';

// 목록 조회: 서버 필터(week/category/keyword/page/size/sort) 기반
export const useMaterialsQuery = (
  studyId: number,
  params: {
    week?: number[];
    category?: string[];
    keyword?: string;
    page?: number;
    size?: number;
    sort?: string;
  },
) => {
  return useQuery({
    queryKey: QUERY_KEYS.materials(studyId, params),
    queryFn: async () => {
      const res = await MaterialsService.list({ studyId, ...params });
      const items = Array.isArray(res.materials) ? res.materials : [];
      return {
        materials: items.map(mapApiListItemToMaterial),
        hasNext: Boolean(res.has_next),
        page: res.page ?? params.page ?? 0,
        size: res.size ?? params.size ?? 10,
      };
    },
    enabled: Number.isFinite(studyId) && studyId > 0,
    staleTime: 60 * 1000,
  });
};
// 상세 조회: materialId 기반
export const useMaterialDetailQuery = (materialId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.materialDetail(materialId),
    queryFn: async () => MaterialsService.detail(materialId),
    enabled: Number.isFinite(materialId) && materialId > 0,
    staleTime: 60 * 1000,
  });
};

// 최신 학습 자료 조회: studyId 기반 최근 자료 카드용
export const useRecentMaterialsQuery = (studyId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.recentMaterials(studyId),
    queryFn: async () => {
      const res = await MaterialsService.recent(studyId);
      const arr = Array.isArray(res?.json)
        ? res.json
        : Array.isArray(res)
          ? res
          : [];
      return arr as Array<{
        material_id: number;
        material_title: string;
        author_name: string;
        file_count: number;
        total_file_size: number;
      }>;
    },
    enabled: Number.isFinite(studyId) && studyId > 0,
    staleTime: 60 * 1000,
  });
};

// 생성: 성공 시 해당 스터디 목록/최근자료 무효화
export const useCreateMaterialMutation = (studyId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      title: string;
      category: string;
      week: number | null;
      content: string;
      files: Array<{
        id: number | null;
        name: string;
        key: string;
        size: number;
        file_type: string;
      }>;
    }) => MaterialsService.create(studyId, body),
    onSuccess: () => {
      // 변경사항 반영: 생성 후 해당 스터디의 목록/최근자료 캐시 무효화
      qc.invalidateQueries({ queryKey: ['materials', studyId] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.recentMaterials(studyId) });
    },
  });
};

// 수정: 성공 시 상세/목록 무효화
export const useUpdateMaterialMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      materialId,
      body,
    }: {
      materialId: number;
      body: {
        title: string;
        category: string;
        week: number | null;
        content: string;
        files: Array<{
          id: number | null;
          name: string;
          key: string;
          size: number;
          file_type: string;
        }>;
      };
    }) => MaterialsService.update(materialId, body),
    onSuccess: (_, variables) => {
      // 변경사항 반영: 수정 후 상세는 정확히, 목록은 프리픽스로 무효화하여 리스트 최신화
      qc.invalidateQueries({
        queryKey: QUERY_KEYS.materialDetail(variables.materialId),
      });
      qc.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};

// 삭제: 성공 시 목록/최근/개별 상세 무효화
export const useDeleteMaterialsMutation = (studyId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => MaterialsService.deleteMany(ids),
    onMutate: async (ids: number[]) => {
      await qc.cancelQueries({ queryKey: ['materials', studyId] });
      const prev = qc.getQueryData<{ materials?: Array<{ id: string }> }>(
        QUERY_KEYS.materials(studyId, null),
      );
      // optimistic remove
      qc.setQueryData(
        QUERY_KEYS.materials(studyId, null),
        (old: typeof prev) => {
          if (!old) return old as typeof prev;
          const filtered = Array.isArray(old.materials)
            ? old.materials.filter((m) => !ids.includes(Number(m.id)))
            : old.materials;
          return { ...old, materials: filtered } as typeof prev;
        },
      );
      return { prev };
    },
    onError: (
      _err,
      _vars,
      ctx?: { prev?: { materials?: Array<{ id: string }> } },
    ) => {
      if (ctx?.prev) {
        qc.setQueryData(QUERY_KEYS.materials(studyId, null), ctx.prev);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['materials', studyId] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.recentMaterials(studyId) });
    },
  });
};
