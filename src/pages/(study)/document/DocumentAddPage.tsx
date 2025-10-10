import { useNavigate, useParams } from 'react-router-dom';
import { ROUTE_BUILDERS } from '@/constants';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { MaterialForm } from './components';
import { buildMaterialRequestBody } from './utils';
import { useCreateMaterialMutation } from './hooks/useMaterials';
import {
  TOAST_MESSAGES,
  NAVIGATION_DELAY,
  DEFAULT_WEEK,
  DEFAULT_MATERIAL_CATEGORY,
} from './constants';
import type { MaterialFormData } from './types';

/**
 * 자료 추가 페이지
 */
const DocumentAddPage = () => {
  const navigate = useNavigate();
  const { study_id } = useParams<{ study_id: string }>();
  const createMutation = useCreateMaterialMutation(Number(study_id));

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState<MaterialFormData>({
    title: '',
    content: '',
    week: DEFAULT_WEEK,
    category: DEFAULT_MATERIAL_CATEGORY,
    files: [],
  });

  // 네비게이션 핸들러
  const handleBack = () =>
    navigate(ROUTE_BUILDERS.study.document.list(String(study_id)));

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = buildMaterialRequestBody(formData);
      const studyIdNum = Number(study_id);
      if (!studyIdNum) throw new Error('invalid study id');
      await createMutation.mutateAsync(body);
      toast.success(TOAST_MESSAGES.ADD_SUCCESS);
      setTimeout(
        () => navigate(ROUTE_BUILDERS.study.document.list(String(study_id))),
        NAVIGATION_DELAY,
      );
    } catch {
      toast.error('자료 추가 중 오류가 발생했습니다.');
    }
  };

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
          <h1 className='text-2xl font-bold text-primary'>자료 추가</h1>
        </div>
      </div>

      {/* 폼 */}
      <MaterialForm
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        submitButtonText='추가'
        onCancel={handleBack}
      />
    </div>
  );
};

export default DocumentAddPage;
