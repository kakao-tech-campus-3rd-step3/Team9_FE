import { useState } from 'react';
import {
  StudyRoadmapTab,
  IndividualStatusTab,
  ProgressTab,
} from './components';

/**
 * 스터디 진척도 페이지
 * - 스터디 로드맵과 개인별 현황판 두 개의 탭으로 구성
 */
const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'status'>('roadmap');

  return (
    <div className='h-full flex flex-col bg-background'>
      {/* 헤더 */}
      <div className='flex items-center justify-between px-6 py-6 border-b border-border bg-background'>
        <div>
          <h1 className='text-2xl font-bold text-primary'>스터디 진척도</h1>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className='px-6 pt-6'>
        <ProgressTab activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* 탭 컨텐츠 */}
      <div className='flex-1 px-6 pb-6 mt-6'>
        <div className='bg-card rounded-lg border border-border h-full'>
          {activeTab === 'roadmap' && <StudyRoadmapTab />}
          {activeTab === 'status' && <IndividualStatusTab />}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
