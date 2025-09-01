import React, { useState } from 'react';
import { Search, Camera, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from '@/components/common/Toast';
import { Logo } from '@/components/common';

// 스터디 폼 데이터 인터페이스
interface StudyFormData {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  maxMembers: number;
}

const categories = [
  '어학',
  '취업',
  '고시/공무원',
  '취미/교양',
  '프로그래밍',
  '자율/기타',
];

const memberOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const StudyCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StudyFormData>({
    title: '',
    shortDescription: '',
    description: '',
    category: '',
    maxMembers: 2,
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
  }>({
    isVisible: false,
    type: 'success',
    message: '',
  });

  const handleInputChange = (
    field: keyof StudyFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ isVisible: true, type, message });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('스터디 생성 데이터:', {
      ...formData,
      categories: selectedCategories,
    });
    showToast('success', '스터디 생성이 완료되었습니다.');
    // Reset form
    setFormData({
      title: '',
      shortDescription: '',
      description: '',
      category: '',
      maxMembers: 2,
    });
    setSelectedCategories([]);
    setImagePreview(null);
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* 헤더 */}
      <div className='bg-white shadow-sm border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <button
              onClick={handleGoBack}
              className='p-2 hover:bg-accent rounded-lg transition-colors'
            >
              <ArrowLeft className='h-5 w-5 text-foreground' />
            </button>

            <div className='flex items-center space-x-4'>
              <Logo size='md' showText={true} />
            </div>

            <div className='flex-1 max-w-md mx-8'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5' />
                <input
                  type='text'
                  placeholder='스터디 검색...'
                  className='w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
                />
              </div>
            </div>

            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
                <span className='text-primary-foreground text-sm font-medium'>
                  김
                </span>
              </div>
              <span className='text-sm font-medium text-foreground'>
                김경대
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='flex'>
        {/* 사이드바 */}
        <div className='w-64 bg-white shadow-sm border-r border-border min-h-screen'>
          <div className='p-6'>
            <h2 className='text-lg font-semibold text-foreground mb-6'>
              스터디 생성
            </h2>

            <div className='space-y-3'>
              {categories.map((category) => (
                <label
                  key={category}
                  className='flex items-center space-x-3 cursor-pointer'
                >
                  <input
                    type='checkbox'
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className='w-4 h-4 text-primary border-border rounded focus:ring-primary'
                  />
                  <span className='text-sm text-foreground'>{category}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className='flex-1 p-6'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-2xl font-bold text-foreground mb-8'>
              스터디 생성
            </h1>

            <form onSubmit={handleSubmit} className='space-y-8'>
              {/* 스터디 이름 */}
              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>
                  스터디 이름
                </label>
                <input
                  type='text'
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder='스터디 이름'
                  className='w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
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
                  onChange={(e) =>
                    handleInputChange('shortDescription', e.target.value)
                  }
                  placeholder='스터디에 대한 간략한 설명'
                  className='w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
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
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder='스터디에 대한 상세한 설명'
                  rows={4}
                  className='w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground resize-none'
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
                  value={formData.maxMembers}
                  onChange={(e) =>
                    handleInputChange('maxMembers', parseInt(e.target.value))
                  }
                  className='w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
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
                        onClick={() => setImagePreview(null)}
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
        </div>
      </div>

      {/* 토스트 알림 */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default StudyCreatePage;
