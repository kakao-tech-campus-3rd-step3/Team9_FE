import { useMemo, useState, useCallback } from 'react';
import BaseModal from '@/components/common/BaseModal';
import { cn } from '@/pages/(study)/dashboard/utils';
import type { Material, Attachment } from '../types';
import { aggregateAttachments } from '../utils/attachments';

interface QuizCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: Material[];
  onSubmit: (payload: {
    title: string;
    content: string;
    attachmentIds: string[];
  }) => void;
}

const QuizCreateModal = ({
  isOpen,
  onClose,
  materials,
  onSubmit,
}: QuizCreateModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedAttachmentIds, setSelectedAttachmentIds] = useState<string[]>(
    [],
  );

  // 선택된 자료들의 첨부파일을 집계 (고유한 ID 부여)
  const allAttachments = useMemo<Attachment[]>(() => {
    return materials.flatMap((m) =>
      (m.attachments || []).map((a) => ({
        ...a,
        id: `${m.id}:${a.id}`, // 자료ID:첨부ID 조합으로 고유성 보장
      })),
    );
  }, [materials]);

  const toggleAttachment = useCallback((id: string) => {
    setSelectedAttachmentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const isValid = title.trim().length > 0;

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      attachmentIds: selectedAttachmentIds,
    });
    onClose();
  }, [isValid, onSubmit, selectedAttachmentIds, title, content, onClose]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title='퀴즈 생성'
      maxWidth='max-w-2xl'
    >
      <div className='p-6 space-y-6'>
        {/* 선택된 자료 요약 */}
        <div className='border border-border rounded-lg p-3'>
          <div className='text-xs text-muted-foreground mb-2'>선택된 자료</div>
          {materials.length === 0 ? (
            <div className='text-sm text-muted-foreground'>
              선택된 자료가 없습니다.
            </div>
          ) : (
            <ul className='flex flex-wrap gap-2'>
              {materials.map((m) => (
                <li
                  key={m.id}
                  className='px-2.5 py-1 rounded bg-muted text-xs text-foreground'
                >
                  {m.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* 제목/내용 */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-foreground'>제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='퀴즈 제목을 입력하세요'
            className='w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-foreground'>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='퀴즈 설명 또는 안내를 입력하세요'
            rows={4}
            className='w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y'
          />
        </div>

        {/* 첨부 파일 선택 */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <label className='text-sm font-medium text-foreground'>
              첨부 파일 선택
            </label>
            <div className='text-xs text-muted-foreground'>
              총 {allAttachments.length}개 / 선택 {selectedAttachmentIds.length}
              개
            </div>
          </div>
          <div className='border border-border rounded-lg max-h-64 overflow-auto'>
            {allAttachments.length === 0 ? (
              <div className='p-4 text-sm text-muted-foreground'>
                선택한 자료에 첨부 파일이 없습니다.
              </div>
            ) : (
              <ul className='divide-y divide-border'>
                {allAttachments.map((a) => {
                  const isSelected = selectedAttachmentIds.includes(
                    String(a.id),
                  );
                  return (
                    <li
                      key={String(a.id)}
                      className={cn(
                        'flex items-center justify-between px-4 py-2',
                        isSelected && 'bg-primary/5',
                      )}
                      onClick={() => toggleAttachment(String(a.id))}
                    >
                      <div className='min-w-0'>
                        <div className='text-sm font-medium text-foreground truncate'>
                          {a.name}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {a.type || 'file'} •{' '}
                          {a.size ? `${Math.round(a.size / 1024)}KB` : ''}
                        </div>
                      </div>
                      <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={() => toggleAttachment(String(a.id))}
                        className='w-4 h-4'
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* 액션 */}
        <div className='flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 border border-border rounded-lg text-sm hover:bg-accent/50'
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={cn(
              'px-4 py-2 rounded-lg text-sm',
              isValid
                ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            )}
          >
            생성
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default QuizCreateModal;
