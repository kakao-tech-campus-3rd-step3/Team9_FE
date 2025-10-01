import { useState } from 'react';
import { X } from 'lucide-react';

type AddSessionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string) => void;
};

/**
 * 차시 추가 모달 컴포넌트
 * - 새로운 스터디 차시를 추가할 수 있는 폼 제공
 */
export const AddSessionModal = ({
  isOpen,
  onClose,
  onAdd,
}: AddSessionModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-background rounded-lg border border-border p-6 w-full max-w-md mx-4'>
        {/* 헤더 */}
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-foreground'>
            차시 추가하기
          </h3>
          <button
            onClick={handleClose}
            className='p-1 hover:bg-muted rounded-md transition-colors'
          >
            <X className='w-4 h-4 text-muted-foreground' />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              차시 제목
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='예: 1차시 - React 기초'
              className='w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              차시 설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='차시에서 다룰 내용을 설명해주세요'
              rows={4}
              className='w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none'
            />
          </div>

          {/* 버튼 */}
          <div className='flex gap-2 justify-end pt-4'>
            <button
              type='button'
              onClick={handleClose}
              className='px-4 py-2 text-muted-foreground hover:text-foreground transition-colors'
            >
              취소
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
            >
              추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
