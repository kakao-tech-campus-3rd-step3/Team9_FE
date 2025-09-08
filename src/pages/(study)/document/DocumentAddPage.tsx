import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { MaterialForm } from './components';
import {
  TOAST_MESSAGES,
  NAVIGATION_DELAY,
  DEFAULT_CATEGORY,
} from './constants';
import type { MaterialFormData } from './types';

/**
 * 자료 추가 페이지
 */
const DocumentAddPage = () => {
  const navigate = useNavigate();

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState<MaterialFormData>({
    title: '',
    content: '',
    category: DEFAULT_CATEGORY,
  });

  // 네비게이션 핸들러
  const handleBack = () => navigate('/study/document');

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(TOAST_MESSAGES.ADD_SUCCESS);
    setTimeout(() => navigate('/study/document'), NAVIGATION_DELAY);
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
