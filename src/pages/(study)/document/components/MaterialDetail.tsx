import { Download, Calendar, FileText, Clock, Tag } from 'lucide-react';
import { formatFileSize } from '../utils';
import { downloadImageService } from '@/services/images/downloadImage';
import type { Material } from '../types';
import { MATERIAL_CATEGORIES } from '../constants';

export interface MaterialDetailProps {
  material: Material;
  isLoading?: boolean;
}

/**
 * 자료 상세 조회 컴포넌트
 * - 자료의 상세 정보를 표시
 * - 첨부파일 다운로드 기능 제공
 */
function MaterialDetail({ material, isLoading = false }: MaterialDetailProps) {
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

  const handleFileDownload = async (attachment: {
    name: string;
    url: string;
  }) => {
    // presign용 안전 파일명(ASCII) 생성: S3 서명/인코딩 이슈 회피
    const ext = `.${(attachment.name.split('.').pop() || '').toLowerCase()}`;
    const base = attachment.name.replace(/\.[^/.]+$/, '');
    const safeBase =
      base
        .normalize('NFKD')
        .replace(/[^A-Za-z0-9-_ ]+/g, '')
        .trim()
        .replace(/\s+/g, '_')
        .slice(0, 100) || 'file';
    const safeName = `${safeBase}${ext}`;

    // 파일 presign 사용 (서버에는 안전한 파일명 전달)
    const presignedUrl = await downloadImageService.getFilePresignedUrl(
      attachment.url,
      safeName,
    );
    if (!presignedUrl) return;

    // 파일명 강제 저장: Blob 다운로드 → a.download 파일명 지정
    try {
      const res = await fetch(presignedUrl, { method: 'GET' });
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      // 실제 저장 파일명은 원래 이름 유지
      a.download = attachment.name || safeName || 'download';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // fallback: 새 탭 오픈 (S3 Content-Disposition이 지정돼있다면 해당 이름 사용)
      window.open(presignedUrl, '_blank');
    }
  };

  // 로딩 상태는 개별 섹션에서 처리

  return (
    <div className='max-w-6xl mx-auto p-6'>
      {/* 헤더 */}
      <div className='mb-10'>
        <div className='flex items-start justify-between mb-6'>
          <div className='flex-1'>
            {isLoading ? (
              <>
                <div className='h-8 bg-muted animate-pulse rounded w-3/4 mb-4' />
                <div className='h-6 bg-muted animate-pulse rounded w-1/4 mb-4' />
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* 메타 정보 */}
        <div className='flex flex-wrap items-center gap-6 text-sm text-muted-foreground'>
          {isLoading ? (
            <>
              <div className='h-4 bg-muted animate-pulse rounded w-1/6' />
              <div className='h-4 bg-muted animate-pulse rounded w-1/6' />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* 내용 */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-1 h-6 bg-primary rounded-full'></div>
          <h2 className='text-xl font-bold text-foreground'>내용</h2>
        </div>
        <div className='bg-background border border-border rounded-lg p-6'>
          {isLoading ? (
            <div className='space-y-4'>
              <div className='h-4 bg-muted animate-pulse rounded w-full' />
              <div className='h-4 bg-muted animate-pulse rounded w-5/6' />
              <div className='h-4 bg-muted animate-pulse rounded w-4/6' />
              <div className='h-4 bg-muted animate-pulse rounded w-3/6' />
            </div>
          ) : (
            <div className='prose max-w-none text-foreground'>
              <div className='whitespace-pre-wrap leading-relaxed text-base'>
                {material.content}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 첨부파일 */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-1 h-6 bg-secondary rounded-full'></div>
          <h2 className='text-xl font-bold text-foreground'>첨부파일</h2>
          {!isLoading && material.attachments.length > 0 && (
            <span className='px-2 py-1 bg-secondary/10 text-secondary rounded text-sm font-medium'>
              {material.attachments.length}개
            </span>
          )}
        </div>
        <div className='space-y-3'>
          {isLoading ? (
            <>
              <div className='h-12 bg-muted animate-pulse rounded' />
              <div className='h-12 bg-muted animate-pulse rounded' />
            </>
          ) : material.attachments.length > 0 ? (
            material.attachments.map((attachment) => (
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
            ))
          ) : (
            <div className='text-center py-8 text-muted-foreground'>
              첨부파일이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MaterialDetail;
