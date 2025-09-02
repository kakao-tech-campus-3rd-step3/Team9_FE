import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudyApplyModal from '@/components/Study/StudyApplyModal';
import StudyDetailModal from '@/components/Study/StudyDetailModal';
import RegionSelectModal from '@/components/Study/RegionSelectModal';
import Toast from '@/components/common/Toast';
import { ROUTES } from '@/constants';

// 스터디 인터페이스
interface Study {
  id: number;
  title: string;
  description: string;
  category: string;
  currentMembers: number;
  maxMembers: number;
  region: string;
  imageUrl?: string;
  detailedDescription?: string;
  schedule?: string;
  duration?: string;
  requirements?: string[];
}

// 목업 스터디 데이터 (기존 db.json 기반)
const mockStudies: Study[] = [
  {
    id: 101,
    title: "React 스터디 '파도' 1기",
    description: '함께 React를 정복할 스터디원을 모집합니다. 초보도 환영!',
    category: '프로그래밍',
    currentMembers: 2,
    maxMembers: 8,
    region: '서울',
  },
  {
    id: 102,
    title: '토익 900점 목표 스터디',
    description: '매주 모의고사 풀고 리뷰하는 스터디입니다.',
    category: '어학',
    currentMembers: 1,
    maxMembers: 6,
    region: '경기',
  },
  {
    id: 103,
    title: '취업 준비 스터디',
    description: '이력서 작성부터 면접 준비까지 함께하는 스터디',
    category: '취업',
    currentMembers: 3,
    maxMembers: 5,
    region: '대구',
  },
  {
    id: 104,
    title: '고시 공부 스터디',
    description: '9급 공무원 시험 준비 스터디입니다.',
    category: '고시/공무원',
    currentMembers: 4,
    maxMembers: 8,
    region: '부산',
  },
  {
    id: 105,
    title: '독서 모임',
    description: '월 1권씩 읽고 토론하는 독서 스터디',
    category: '취미/교양',
    currentMembers: 2,
    maxMembers: 10,
    region: '서울',
  },
  {
    id: 106,
    title: '알고리즘 스터디',
    description: '백준 문제 풀이와 알고리즘 학습',
    category: '프로그래밍',
    currentMembers: 5,
    maxMembers: 7,
    region: '경기',
  },
];

const categories = [
  '전체',
  '어학',
  '취업',
  '고시/공무원',
  '취미/교양',
  '프로그래밍',
  '자율/기타',
];

const StudyExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [toast, setToast] = useState<{
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
  }>({
    isVisible: false,
    type: 'success',
    message: '',
  });

  const filteredStudies = mockStudies.filter((study) => {
    if (selectedCategory !== '전체' && study.category !== selectedCategory) {
      return false;
    }
    if (selectedRegion !== '전체' && study.region !== selectedRegion) {
      return false;
    }
    return true;
  });

  const handleApplyClick = (study: Study) => {
    setSelectedStudy(study);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStudy(null);
  };

  const handleCardClick = (study: Study) => {
    setSelectedStudy(study);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedStudy(null);
  };

  const handleDetailApply = (study: Study) => {
    setIsDetailModalOpen(false);
    setSelectedStudy(study);
    setIsModalOpen(true);
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleCreateStudy = () => {
    navigate(ROUTES.STUDY.CREATE);
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='flex'>
        {/* 사이드바 */}
        <div className='w-64 bg-white shadow-sm border-r border-border min-h-screen'>
          <div className='p-6'>
            <h2 className='text-lg font-semibold text-foreground mb-6'>
              스터디 탐색
            </h2>

            <div className='space-y-3'>
              {categories.map((category) => (
                <label
                  key={category}
                  className='flex items-center space-x-3 cursor-pointer'
                >
                  <input
                    type='radio'
                    name='category'
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
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
          <div className='max-w-6xl mx-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h1 className='text-xl font-semibold text-foreground'>
                {selectedRegion === '전체' ? '전체 지역' : selectedRegion} 근처
                스터디
              </h1>
              <button
                onClick={() => setIsRegionModalOpen(true)}
                className='px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary border border-border rounded-lg hover:bg-secondary-hover transition-colors'
              >
                지역 선택
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredStudies.map((study) => (
                <div
                  key={study.id}
                  className='bg-white rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow flex flex-col cursor-pointer'
                  onClick={() => handleCardClick(study)}
                >
                  <div className='p-6 flex-1'>
                    <div className='mb-4'>
                      <div className='w-full h-32 bg-primary-light rounded-lg mb-4 flex items-center justify-center'>
                        <div className='w-12 h-12 bg-primary rounded-lg flex items-center justify-center'>
                          <span className='text-primary-foreground text-lg font-bold'>
                            {study.title.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <h3 className='text-lg font-semibold text-foreground mb-2'>
                        {study.title}
                      </h3>
                      <p className='text-sm text-muted-foreground mb-3'>
                        {study.description}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        📍 {study.region}
                      </p>
                    </div>
                  </div>

                  <div className='p-6 pt-0'>
                    <div className='flex items-center text-sm text-muted-foreground mb-3'>
                      <Users className='h-4 w-4 mr-1' />
                      <span>
                        참여자 수 {study.currentMembers}/{study.maxMembers}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyClick(study);
                      }}
                      className='w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors'
                    >
                      참여하기
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredStudies.length === 0 && (
              <div className='text-center py-12'>
                <p className='text-muted-foreground'>검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 플로팅 액션 버튼 */}
      <button
        onClick={handleCreateStudy}
        className='fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary-hover transition-colors flex items-center justify-center'
      >
        <Plus className='h-6 w-6' />
      </button>

      {/* 스터디 신청 모달 */}
      <StudyApplyModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        studyTitle={selectedStudy?.title || ''}
      />

      {/* 스터디 상세 모달 */}
      <StudyDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleDetailModalClose}
        study={selectedStudy}
        onApply={handleDetailApply}
      />

      {/* 지역 선택 모달 */}
      <RegionSelectModal
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        selectedRegion={selectedRegion}
        onRegionSelect={handleRegionSelect}
      />

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

export default StudyExplorePage;
