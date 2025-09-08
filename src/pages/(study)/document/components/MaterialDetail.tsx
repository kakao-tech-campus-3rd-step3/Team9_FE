import { Download, Calendar, FileText, Clock, Tag } from 'lucide-react';
import { formatFileSize } from '../utils';
import type { Material } from '../types';
import { MATERIAL_CATEGORIES } from '../constants';

interface MaterialDetailProps {
  material: Material;
}

/**
 * 자료 상세 조회 컴포넌트
 * - 자료의 상세 정보를 표시
 * - 첨부파일 다운로드 기능 제공
 */
function MaterialDetail({ material }: MaterialDetailProps) {
  const category = MATERIAL_CATEGORIES.find(
    (cat) => cat.id === material.category,
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleFileDownload = (attachment: { name: string; url: string }) => {
    // 실제 구현에서는 파일 다운로드 로직을 추가
    console.log('Download file:', attachment.name);
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      {/* 헤더 */}
      <div className='mb-10'>
        <div className='flex items-start justify-between mb-6'>
          <div className='flex-1'>
            <h1 className='text-2xl font-bold text-foreground mb-4 leading-tight'>
              {material.title}
            </h1>
            {category && (
              <div className='flex items-center gap-2 mb-4'>
                <Tag className='w-4 h-4 text-muted-foreground' />
                <span className='px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium border border-primary/20'>
                  {category.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 메타 정보 */}
        <div className='flex flex-wrap items-center gap-6 text-sm text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <Calendar className='w-4 h-4' />
            <span className='font-medium'>생성일:</span>
            <span>{formatDate(material.createdAt)}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Clock className='w-4 h-4' />
            <span className='font-medium'>수정일:</span>
            <span>{formatDate(material.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* 내용 */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-1 h-6 bg-primary rounded-full'></div>
          <h2 className='text-xl font-bold text-foreground'>내용</h2>
        </div>
        <div className='bg-background border border-border rounded-lg p-6'>
          <div className='prose max-w-none text-foreground'>
            <div className='whitespace-pre-wrap leading-relaxed text-base'>
              {material.content}
            </div>
          </div>
        </div>
      </div>

      {/* 첨부파일 */}
      {material.attachments.length > 0 && (
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-1 h-6 bg-secondary rounded-full'></div>
            <h2 className='text-xl font-bold text-foreground'>첨부파일</h2>
            <span className='px-2 py-1 bg-secondary/10 text-secondary rounded text-sm font-medium'>
              {material.attachments.length}개
            </span>
          </div>
          <div className='space-y-3'>
            {material.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className='flex items-center gap-4 p-4 bg-background border border-border rounded-lg hover:bg-accent/5 transition-colors'
              >
                <div className='p-2 bg-primary/10 rounded-lg'>
                  <FileText className='w-5 h-5 text-primary' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='font-semibold text-foreground truncate text-base mb-1'>
                    {attachment.name}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {formatFileSize(attachment.size)} • {attachment.type}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileDownload(attachment);
                  }}
                  className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors text-sm font-semibold'
                >
                  <Download className='w-4 h-4' />
                  다운로드
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MaterialDetail;
