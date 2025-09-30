import { useParams, useNavigate } from 'react-router-dom';
import { ROUTE_BUILDERS } from '@/constants';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/pages/(study)/dashboard/utils';
import { MaterialDetail } from './components';
import { EmptyState } from './components/common';
import { TOAST_MESSAGES, NAVIGATION_DELAY } from './constants';
import type { Material } from './types';
import { mapApiListItemToMaterial, type ApiMaterialListItem } from './utils';
import {
  useMaterialDetailQuery,
  useDeleteMaterialsMutation,
} from './hooks/useMaterials';
import { LoadingSpinner } from '@/components/common';

/**
 * 자료 상세 페이지
 */
const DocumentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { study_id } = useParams<{ study_id: string }>();
  const navigate = useNavigate();

  const [material, setMaterial] = useState<Material | undefined>(undefined);

  const materialId = Number(id);
  const detailQuery = useMaterialDetailQuery(materialId);
  useEffect(() => {
    if (detailQuery.data) {
      const item =
        (detailQuery.data as ApiMaterialListItem) ||
        ({} as ApiMaterialListItem);
      const mapped = mapApiListItemToMaterial({
        id: item.id,
        title: item.title,
        content: item.content,
        week: item.week,
        category: item.category,
        files: item.files,
        created_at: item.created_at,
        updated_at: item.updated_at,
      });
      setMaterial(mapped);
    }
    if (detailQuery.isError) {
      setMaterial(undefined);
    }
  }, [detailQuery.data, detailQuery.isError]);

  // 네비게이션 핸들러
  const handleBack = () =>
    navigate(ROUTE_BUILDERS.study.document.list(String(study_id)));
  const handleEdit = () => material && navigate('edit');

  // 자료 삭제 핸들러
  const deleteMutation = useDeleteMaterialsMutation(Number(study_id));
  const handleDelete = async () => {
    if (!material) return;
    try {
      await deleteMutation.mutateAsync([Number(material.id)]);
      toast.error(TOAST_MESSAGES.DELETE_SUCCESS);
      setTimeout(
        () => navigate(ROUTE_BUILDERS.study.document.list(String(study_id))),
        NAVIGATION_DELAY,
      );
    } catch {
      toast.error('자료 삭제 중 오류가 발생했습니다.');
    }
  };

  if (detailQuery.isLoading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <LoadingSpinner />
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
          <h1 className='text-2xl font-bold text-primary'>자료 상세</h1>
        </div>

        <div className='flex-1 flex items-center justify-center'>
          <EmptyState
            title={'자료를 찾을 수 없습니다'}
            description={'요청하신 자료가 존재하지 않거나 삭제되었습니다.'}
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
      <div className='flex items-center justify-between px-6 py-6 border-b border-border bg-background'>
        <div className='flex items-center gap-4'>
          <button
            onClick={handleBack}
            className='p-2 hover:bg-accent rounded-lg transition-colors'
            aria-label='뒤로가기'
          >
            <ArrowLeft className='w-5 h-5 text-muted-foreground hover:text-foreground' />
          </button>
          <div>
            <h1 className='text-2xl font-bold text-primary'>자료 상세</h1>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className='flex gap-2'>
          <button
            onClick={handleEdit}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm',
              'hover:bg-primary-hover transition-colors font-semibold',
            )}
          >
            <Edit className='w-4 h-4' />
            <span>수정</span>
          </button>
          <button
            onClick={handleDelete}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-sm',
              'hover:bg-destructive-hover transition-colors font-semibold',
            )}
          >
            <Trash2 className='w-4 h-4' />
            <span>삭제</span>
          </button>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className='flex-1 overflow-y-auto'>
        <MaterialDetail material={material} />
      </div>
    </div>
  );
};

export default DocumentDetailPage;
