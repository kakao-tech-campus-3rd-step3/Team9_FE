/**
 * 스터디 탐색 페이지 사이드바 컴포넌트
 */

import React from 'react';

interface StudyExploreSidebarProps {
  categories: readonly string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

const StudyExploreSidebar: React.FC<StudyExploreSidebarProps> = ({
  categories,
  selectedCategories,
  onCategoryToggle,
}) => {
  return (
    <div className='w-64 bg-white shadow-sm border-r border-border min-h-screen'>
      <div className='p-6'>
        <h2 className='text-xl font-semibold text-foreground mb-6'>
          스터디 탐색
        </h2>

        <div className='space-y-4'>
          {categories.map((category) => (
            <label
              key={category}
              className='flex items-center space-x-3 cursor-pointer'
            >
              <input
                type='checkbox'
                checked={selectedCategories.includes(category)}
                onChange={() => onCategoryToggle(category)}
                className='w-4 h-4 text-primary border-border rounded focus:ring-primary'
              />
              <span
                className={`text-base font-medium transition-colors ${
                  selectedCategories.includes(category)
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyExploreSidebar;
