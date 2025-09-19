/**
 * 검색바 컴포넌트
 * - 검색 입력 및 검색 버튼 기능
 * - Enter 키 및 버튼 클릭으로 검색 실행
 */

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  placeholder = '검색어를 입력하세요',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className='relative max-w-md'>
      <input
        type='text'
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className='w-full pl-4 pr-12 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
      />
      <button
        type='button'
        onClick={onSearch}
        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors'
      >
        <Search className='h-5 w-5' />
      </button>
    </div>
  );
};

export default SearchBar;
