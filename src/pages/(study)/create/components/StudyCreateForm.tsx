/**
 * 스터디 생성 폼 컴포넌트
 */

import React from 'react';
import { Camera, X } from 'lucide-react';
import type { StudyFormData } from '../types';

interface StudyCreateFormProps {
  formData: StudyFormData;
  selectedCategories: string[];
  imagePreview: string | null;
  categories: readonly string[];
  memberOptions: readonly number[];
  onInputChange: (field: keyof StudyFormData, value: string | number) => void;
  onCategoryToggle: (category: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

const StudyCreateForm: React.FC<StudyCreateFormProps> = ({
  formData,
  selectedCategories,
  imagePreview,
  categories,
  memberOptions,
  onInputChange,
  onCategoryToggle,
  onImageUpload,
  onImageRemove,
  onSubmit,
}) => {
  return (
    <div className='max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold text-foreground mb-8'>스터디 생성</h1>

      <form onSubmit={onSubmit} className='space-y-8'>
        {/* 스터디 이름 */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            스터디 이름
          </label>
          <input
            type='text'
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            placeholder='스터디 이름'
            className='w-full px-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
            required
          />
        </div>

        {/* 스터디 한 줄 소개 */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            스터디 한 줄 소개
          </label>
          <input
            type='text'
            value={formData.shortDescription}
            onChange={(e) => onInputChange('shortDescription', e.target.value)}
            placeholder='스터디에 대한 간략한 설명'
            className='w-full px-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
            required
          />
        </div>

        {/* 스터디 설명 */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            스터디 설명
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder='스터디에 대한 상세한 설명'
            rows={4}
            className='w-full px-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground resize-none'
            required
          />
        </div>

        {/* 스터디 카테고리 */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            스터디 카테고리
          </label>
          <div className='flex flex-wrap gap-2'>
            {categories.map((category) => (
              <button
                key={category}
                type='button'
                onClick={() => onCategoryToggle(category)}
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
            value={formData.maxMembers}
            onChange={(e) =>
              onInputChange('maxMembers', parseInt(e.target.value))
            }
            className='w-full px-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
          >
            {memberOptions.map((num) => (
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
            {imagePreview ? (
              <div className='relative'>
                <img
                  src={imagePreview}
                  alt='미리보기'
                  className='w-full h-48 object-cover rounded-lg'
                />
                <button
                  type='button'
                  onClick={onImageRemove}
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
                  onChange={onImageUpload}
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

        {/* 생성하기 버튼 */}
        <div className='flex justify-end'>
          <button
            type='submit'
            className='px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'
          >
            생성하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudyCreateForm;
