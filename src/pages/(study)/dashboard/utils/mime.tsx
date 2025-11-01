import { FileText, FileImage, FileSpreadsheet, File } from 'lucide-react';

/**
 * 파일명(확장자) 기준 아이콘 JSX를 반환합니다.
 * - UI 컴포넌트에서 직접 렌더 가능하도록 JSX를 반환합니다.
 */
export function getIconByExtension(filename: string) {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  switch (ext) {
    case 'pdf':
      return <FileText className='w-4 h-4 text-destructive' />;
    case 'doc':
    case 'docx':
      return <FileText className='w-4 h-4 text-primary' />;
    case 'ppt':
    case 'pptx':
      return <FileSpreadsheet className='w-4 h-4 text-success' />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return <FileImage className='w-4 h-4 text-accent-foreground' />;
    case 'xls':
    case 'xlsx':
      return <FileSpreadsheet className='w-4 h-4 text-emerald-500' />;
    default:
      return <File className='w-4 h-4 text-muted-foreground' />;
  }
}
