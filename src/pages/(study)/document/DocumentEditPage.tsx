import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { MaterialForm } from './components';
import { EmptyState } from './components/common';
import {
  TOAST_MESSAGES,
  NAVIGATION_DELAY,
  DEFAULT_CATEGORY,
} from './constants';
import type { Material, MaterialFormData } from './types';
import { mockMaterials } from './mock';

/**
 * 자료 수정 페이지
 */
const DocumentEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // URL 파라미터로 받은 ID로 자료 찾기
  const [material] = useState<Material | undefined>(
    mockMaterials.find((m) => m.id === id),
  );

  // 기존 자료 데이터로 폼 초기화
  const [formData, setFormData] = useState<MaterialFormData>({
    title: material?.title || '',
    content: material?.content || '',
    category: material?.category || DEFAULT_CATEGORY,
  });

  // 뒤로가기 핸들러 (자료가 있으면 상세페이지, 없으면 목록으로)
  const handleBack = () => {
    if (material) {
      navigate(`/study/document/${material.id}`);
    } else {
      navigate('/study/document');
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(TOAST_MESSAGES.EDIT_SUCCESS);
    setTimeout(() => {
      if (material) {
        navigate(`/study/document/${material.id}`);
      } else {
        navigate('/study/document');
      }
    }, NAVIGATION_DELAY);
  };

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
              onClick: () => navigate('/study/document'),
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
