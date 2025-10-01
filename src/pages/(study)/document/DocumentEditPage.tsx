import { useParams, useNavigate } from 'react-router-dom';
import { ROUTE_BUILDERS } from '@/constants';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { MaterialForm } from './components';
import { EmptyState } from './components/common';
import {
  TOAST_MESSAGES,
  NAVIGATION_DELAY,
  DEFAULT_WEEK,
  DEFAULT_MATERIAL_CATEGORY,
} from './constants';
import type { Material, MaterialFormData } from './types';
import {
  mapAttachmentsToUploadItems,
  buildMaterialRequestBody,
  mapApiListItemToMaterial,
} from './utils';
import {
  useMaterialDetailQuery,
  useUpdateMaterialMutation,
} from './hooks/useMaterials';

/**
 * 자료 수정 페이지
 * - 상세 조회 결과로 폼 초기화 후 수정 요청을 보냄
 */
const DocumentEditPage = () => {
  const { document_id: id } = useParams<{ document_id: string }>();
  const { study_id } = useParams<{ study_id: string }>();
  const navigate = useNavigate();

  // 기존 자료 내용 로드
  const materialId = Number(id);
  const detailQuery = useMaterialDetailQuery(materialId);
  const [material, setMaterial] = useState<Material | undefined>(undefined);
  useEffect(() => {
    if (detailQuery.data) {
      setMaterial(mapApiListItemToMaterial(detailQuery.data));
    }
    if (detailQuery.isError) {
      setMaterial(undefined);
    }
  }, [detailQuery.data, detailQuery.isError]);

  // 기존 자료 데이터로 폼 초기화
  const [formData, setFormData] = useState<MaterialFormData>({
    title: '',
    content: '',
    week: DEFAULT_WEEK,
    category: DEFAULT_MATERIAL_CATEGORY,
    files: [],
  });
  useEffect(() => {
    if (material) {
      setFormData({
        title: material.title,
        content: material.content,
        week: material.week,
        category: material.category,
        files: mapAttachmentsToUploadItems(material.attachments),
      });
    }
  }, [material]);

  // 뒤로가기 핸들러 (자료가 있으면 상세페이지, 없으면 목록으로)
  const handleBack = () =>
    navigate(ROUTE_BUILDERS.study.document.list(String(study_id)));

  // 폼 제출 핸들러: 입력값 → 요청 바디 변환 → 수정 요청 → 성공 토스트/네비게이션
  const updateMutation = useUpdateMaterialMutation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!material) return;
      const body = buildMaterialRequestBody(formData);
      await updateMutation.mutateAsync({
        materialId: Number(material.id),
        body: {
          title: body.title,
          category: body.category,
          week: body.week,
          content: body.content,
          files: body.files ?? [],
        },
      });
      toast.success(TOAST_MESSAGES.EDIT_SUCCESS);
      setTimeout(
        () => navigate(ROUTE_BUILDERS.study.document.list(String(study_id))),
        NAVIGATION_DELAY,
      );
    } catch {
      toast.error('자료 수정 중 오류가 발생했습니다.');
    }
  };

  if (detailQuery.isLoading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <div className='w-6 h-6 animate-spin rounded-full border-2 border-primary border-t-transparent' />
      </div>
    );
  }

  if (!material) {
    return (
      <div className='h-full flex flex-col bg-background'>
        {/* 헤더 */}
        <div className='flex items-center gap-4 px-6 py-6 border-b border-border bg-background'>
          <button
            onClick={handleBack}
            className='p-2 hover:bg-accent rounded-lg transition-colors'
            aria-label='뒤로가기'
          >
            <ArrowLeft className='w-5 h-5 text-muted-foreground hover:text-foreground' />
          </button>
          <h1 className='text-2xl font-bold text-primary'>자료 수정</h1>
        </div>

        <div className='flex-1 flex items-center justify-center'>
          <EmptyState
            title='자료를 찾을 수 없습니다'
            description='요청하신 자료가 존재하지 않거나 삭제되었습니다.'
            action={{
              label: '목록으로 돌아가기',
              onClick: handleBack,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col bg-background'>
      {/* 헤더 */}
      <div className='flex items-center gap-4 px-6 py-6 border-b border-border bg-background'>
        <button
          onClick={handleBack}
          className='p-2 hover:bg-accent rounded-lg transition-colors'
          aria-label='뒤로가기'
        >
          <ArrowLeft className='w-5 h-5 text-muted-foreground hover:text-foreground' />
        </button>
        <div>
          <h1 className='text-2xl font-bold text-primary'>자료 수정</h1>
        </div>
      </div>

      {/* 폼 */}
      <MaterialForm
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        submitButtonText='저장'
        onCancel={handleBack}
      />
    </div>
  );
};

export default DocumentEditPage;
