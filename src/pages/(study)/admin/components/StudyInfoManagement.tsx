/**
 * 스터디 정보 관리 컴포넌트
 */

import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { MOCK_STUDY_INFO } from '../constants';
import {
  STUDY_CREATE_CATEGORIES,
  MAX_MEMBER_OPTIONS,
} from '../../create/constants';
import type { StudyInfo } from '../types';

export const StudyInfoManagement: React.FC = () => {
  const [studyInfo, setStudyInfo] = useState<StudyInfo>(MOCK_STUDY_INFO);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    studyInfo.category,
  ]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleInputChange = (
    field: keyof StudyInfo,
    value: string | number,
  ) => {
    setStudyInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('image', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    console.log('스터디 정보 수정:', {
      ...studyInfo,
      category: selectedCategories[0],
    });
    // TODO: 실제 수정 로직 구현
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold text-foreground'>
          스터디 정보 관리
        </h2>
        <p className='text-sm text-muted-foreground mt-1'>
          스터디 정보를 수정할 수 있습니다.
        </p>
      </div>

      <div className='max-w-4xl space-y-8'>
        {/* 스터디 이름 */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            스터디 이름
          </label>
          <input
            type='text'
            value={studyInfo.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className='w-full px-3 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
          />
        </div>

        {/* 스터디 한 줄 소개 */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            스터디 한 줄 소개
          </label>
          <input
            type='text'
            value={studyInfo.shortDescription}
            onChange={(e) =>
              handleInputChange('shortDescription', e.target.value)
            }
            placeholder='스터디에 대한 간략한 설명'
            className='w-full px-3 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
          />
        </div>

        {/* 스터디 설명 */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            스터디 설명
          </label>
          <textarea
            value={studyInfo.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder='스터디에 대한 상세한 설명'
            rows={4}
            className='w-full px-3 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground resize-none'
          />
        </div>

        {/* 스터디 카테고리 */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            스터디 카테고리
          </label>
          <div className='flex flex-wrap gap-2'>
            {STUDY_CREATE_CATEGORIES.map((category) => (
              <button
                key={category}
                type='button'
                onClick={() => handleCategoryToggle(category)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedCategories.includes(category)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary-hover'
                }`}
              >
                + {category}
              </button>
            ))}
          </div>
        </div>

        {/* 스터디 인원 */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            스터디 인원
          </label>
          <select
            value={studyInfo.maxMembers}
            onChange={(e) =>
              handleInputChange('maxMembers', parseInt(e.target.value))
            }
            className='w-full px-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
          >
            {MAX_MEMBER_OPTIONS.map((num) => (
              <option key={num} value={num}>
                {num}인
              </option>
            ))}
          </select>
        </div>

        {/* 스터디 대표 이미지 */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            스터디 대표 이미지
          </label>
          <div className='border-2 border-dashed border-input rounded-lg p-6 text-center'>
            {studyInfo.image ? (
              <div className='relative'>
                <img
                  src={studyInfo.image}
                  alt='미리보기'
                  className='w-full h-48 object-cover rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleInputChange('image', '')}
                  className='absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive-light'
                >
                  <X className='h-4 w-4' />
                </button>
              </div>
            ) : (
              <div className='space-y-4'>
                <Camera className='mx-auto h-12 w-12 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>
                    클릭하여 대표 이미지를 설정해주세요
                  </p>
                </div>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                  id='image-upload'
                />
                <label
                  htmlFor='image-upload'
                  className='inline-flex items-center px-4 py-2 border border-input rounded-lg text-sm font-medium text-foreground bg-background hover:bg-accent cursor-pointer'
                >
                  이미지 선택
                </label>
              </div>
            )}
          </div>
        </div>

        {/* 수정하기 버튼 */}
        <div className='pt-4'>
          <button
            onClick={handleSubmit}
            className='px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium'
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};
