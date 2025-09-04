import {
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  User,
  HardDrive,
} from 'lucide-react';
import { SectionCard } from './common';
import type { Document } from '../types';

interface DocumentSectionProps {
  documents: Document[];
  onClick: () => void;
}

const DocumentSection = ({ documents, onClick }: DocumentSectionProps) => {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className='w-4 h-4 text-destructive' />;
      case 'doc':
        return <FileText className='w-4 h-4 text-primary' />;
      case 'ppt':
        return <FileSpreadsheet className='w-4 h-4 text-success' />;
      case 'image':
        return <FileImage className='w-4 h-4 text-accent-foreground' />;
      default:
        return <File className='w-4 h-4 text-muted-foreground' />;
    }
  };

  return (
    <SectionCard icon={FileText} title='문서' onClick={onClick}>
      <div className='space-y-2'>
        {documents.map((doc) => (
          <div
            key={doc.id}
            className='flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors'
          >
            {getFileIcon(doc.type)}
            <div className='flex-1 min-w-0'>
              <h4 className='font-medium text-foreground text-sm line-clamp-1 mb-1'>
                {doc.title}
              </h4>
              <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                <div className='flex items-center gap-1'>
                  <HardDrive className='w-3 h-3' />
                  <span>{doc.size}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <User className='w-3 h-3' />
                  <span>{doc.uploadedBy}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default DocumentSection;
