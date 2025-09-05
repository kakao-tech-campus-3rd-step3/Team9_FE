import { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { cn } from '@/pages/(study)/dashboard/utils';
import { formatFileSize } from '../utils';
import type { MaterialFormData } from '../types';
import { MATERIAL_CATEGORIES } from '../constants';

interface MaterialFormProps {
  formData: MaterialFormData;
  onFormDataChange: (data: MaterialFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText: string;
  onCancel: () => void;
}

/**
 * 자료 추가/수정 공통 폼 컴포넌트
 */
function MaterialForm({
  formData,
  onFormDataChange,
  onSubmit,
  submitButtonText,
  onCancel,
}: MaterialFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileRemove = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='flex-1 overflow-y-auto px-6 py-6'>
      <div className='max-w-3xl mx-auto'>
        <form onSubmit={onSubmit} className='space-y-6'>
          {/* 제목 */}
          <div>
            <label className='block text-base font-semibold text-foreground mb-3'>
              제목 <span className='text-destructive'>*</span>
            </label>
            <input
              type='text'
              value={formData.title}
              onChange={(e) =>
                onFormDataChange({ ...formData, title: e.target.value })
              }
              placeholder='자료 제목을 입력하세요'
              className={cn(
                'w-full px-4 py-3 border-2 border-border rounded-lg text-base',
                'bg-background text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                'transition-all duration-200 hover:border-primary/50',
              )}
              required
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className='block text-base font-semibold text-foreground mb-3'>
              주차 <span className='text-destructive'>*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                onFormDataChange({ ...formData, category: e.target.value })
              }
              className={cn(
                'w-full px-4 py-3 border-2 border-border rounded-lg text-base',
                'bg-background text-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                'transition-all duration-200 hover:border-primary/50',
              )}
              required
            >
              {MATERIAL_CATEGORIES.filter((cat) => cat.id !== 'all').map(
                (category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* 내용 */}
          <div>
            <label className='block text-base font-semibold text-foreground mb-3'>
              내용 <span className='text-destructive'>*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                onFormDataChange({ ...formData, content: e.target.value })
              }
              placeholder='자료 내용을 입력하세요'
              rows={6}
              className={cn(
                'w-full px-4 py-3 border-2 border-border rounded-lg text-base',
                'bg-background text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                'transition-all duration-200 hover:border-primary/50 resize-none',
              )}
              required
            />
          </div>

          {/* 첨부파일 */}
          <div>
            <label className='block text-base font-semibold text-foreground mb-3'>
              첨부파일
            </label>
            <div
              className={cn(
                'border-2 border-dashed border-border rounded-lg p-6',
                'hover:border-primary/50 transition-colors cursor-pointer',
                'bg-muted/20 hover:bg-muted/40',
              )}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <div className='text-center'>
                <Upload className='w-8 h-8 text-muted-foreground mx-auto mb-3' />
                <p className='text-base text-muted-foreground'>
                  파일을 클릭하여 업로드하세요
                </p>
              </div>
              <input
                id='file-upload'
                type='file'
                multiple
                accept='.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip'
                onChange={handleFileUpload}
                className='hidden'
              />
            </div>

            {/* 업로드된 파일 목록 */}
            {uploadedFiles.length > 0 && (
              <div className='mt-4 space-y-3'>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 bg-muted rounded-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-5 h-5 bg-primary rounded' />
                      <span className='text-base text-foreground font-medium'>
                        {file.name}
                      </span>
                      <span className='text-sm text-muted-foreground'>
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <button
                      type='button'
                      onClick={() => handleFileRemove(index)}
                      className='p-2 hover:bg-destructive/10 rounded-lg transition-colors'
                    >
                      <Trash2 className='w-4 h-4 text-destructive' />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className='flex justify-end gap-3 pt-6'>
            <button
              type='button'
              onClick={onCancel}
              className={cn(
                'px-6 py-3 text-base text-muted-foreground hover:text-foreground',
                'transition-colors rounded-lg hover:bg-accent font-semibold',
              )}
            >
              취소
            </button>
            <button
              type='submit'
              className={cn(
                'px-6 py-3 bg-primary text-primary-foreground rounded-lg text-base',
                'hover:bg-primary-hover transition-colors font-semibold',
              )}
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MaterialForm;
