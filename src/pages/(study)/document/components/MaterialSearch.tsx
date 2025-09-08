import { Search } from 'lucide-react';
import { cn } from '@/pages/(study)/dashboard/utils';

interface MaterialSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

/**
 * 자료 검색 컴포넌트
 */
const MaterialSearch = ({
  searchTerm,
  onSearchChange,
}: MaterialSearchProps) => {
  return (
    <div className='px-4 py-3 border-b border-border bg-background'>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4' />
        <input
          type='text'
          placeholder='자료 제목이나 내용으로 검색...'
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            'w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm',
            'bg-background text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'transition-all duration-200 hover:border-primary/50',
          )}
        />
      </div>
    </div>
  );
};

export default MaterialSearch;
