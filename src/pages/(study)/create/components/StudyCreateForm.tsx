/**
 * 스터디 생성 폼 컴포넌트
 */

import React from 'react';
import { Camera, X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import type { StudyFormData } from '../types';

interface StudyCreateFormProps {
  selectedCategories: string[];
  imagePreview: string | null;
  categories: readonly string[];
  memberOptions: readonly number[];
  onCategoryToggle: (category: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onSubmit: (data: StudyFormData) => void;
}

const StudyCreateForm: React.FC<StudyCreateFormProps> = ({
  selectedCategories,
  imagePreview,
  categories,
  memberOptions,
  onCategoryToggle,
  onImageUpload,
  onImageRemove,
  onSubmit,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudyFormData>({
    defaultValues: {
      title: '',
      shortDescription: '',
      description: '',
      category: '',
      maxMembers: 2,
      schedule: '',
    },
  });
  return (
    <div className='max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold text-foreground mb-8'>스터디 생성</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        {/* 스터디 이름 */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            스터디 이름
          </label>
          <input
            type='text'
            {...register('title', {
              required: '스터디 이름을 입력해주세요.',
              minLength: {
                value: 2,
                message: '스터디 이름은 최소 2글자 이상이어야 합니다.',
              },
            })}
            placeholder='스터디 이름'
            className='w-full px-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
          />
          {errors.title && (
            <p className='mt-1 text-sm text-destructive'>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* 스터디 한 줄 소개 */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            스터디 한 줄 소개
          </label>
          <input
            type='text'
            {...register('shortDescription', {
              required: '스터디 한 줄 소개를 입력해주세요.',
              minLength: {
                value: 10,
                message: '스터디 소개는 최소 10글자 이상이어야 합니다.',
              },
            })}
            placeholder='스터디에 대한 간략한 설명'
            className='w-full px-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
          />
          {errors.shortDescription && (
            <p className='mt-1 text-sm text-destructive'>
              {errors.shortDescription.message}
            </p>
          )}
        </div>

        {/* 스터디 설명 */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            스터디 설명
          </label>
          <textarea
            {...register('description', {
              required: '스터디 설명을 입력해주세요.',
              minLength: {
                value: 20,
                message: '스터디 설명은 최소 20글자 이상이어야 합니다.',
              },
            })}
            placeholder='스터디에 대한 상세한 설명'
            rows={4}
            className='w-full px-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground resize-none'
          />
          {errors.description && (
            <p className='mt-1 text-sm text-destructive'>
              {errors.description.message}
            </p>
          )}
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
          <Controller
            name='maxMembers'
            control={control}
            rules={{
              required: '스터디 인원을 선택해주세요.',
              min: { value: 2, message: '최소 2명 이상이어야 합니다.' },
            }}
            render={({ field }) => (
              <select
                {...field}
                className='w-full px-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
              >
                {memberOptions.map((num) => (
                  <option key={num} value={num}>
                    {num}인
                  </option>
                ))}
              </select>
            )}
          />
          {errors.maxMembers && (
            <p className='mt-1 text-sm text-destructive'>
              {errors.maxMembers.message}
            </p>
          )}
        </div>

        {/* 스터디 시간 */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            스터디 시간
          </label>
          <input
            type='text'
            {...register('schedule', {
              required: '스터디 시간을 입력해주세요.',
              minLength: {
                value: 5,
                message: '스터디 시간을 구체적으로 입력해주세요.',
              },
            })}
            placeholder='예: 매주 토요일 오후 2시'
            className='w-full px-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
          />
          {errors.schedule && (
            <p className='mt-1 text-sm text-destructive'>
              {errors.schedule.message}
            </p>
          )}
          <p className='mt-1 text-xs text-muted-foreground'>
            스터디가 진행되는 시간을 자유롭게 입력해주세요.
          </p>
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
