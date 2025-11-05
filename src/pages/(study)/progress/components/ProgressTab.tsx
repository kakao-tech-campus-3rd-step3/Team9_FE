type TabItemProps = {
  title: string;
  selected: boolean;
  onClick: () => void;
};

const TabItem = ({ title, selected, onClick }: TabItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 ${selected ? 'border-primary border-b-2' : ''}`}
    >
      <div
        className={`px-2 py-1 border rounded-2xl min-w-30 text-center border-primary ${
          selected ? 'font-bold bg-primary text-white' : ''
        }`}
      >
        {title}
      </div>
    </button>
  );
};

type ProgressTabProps = {
  activeTab: 'roadmap' | 'status';
  onTabChange: (tab: 'roadmap' | 'status') => void;
};

/**
 * 스터디 진척도 페이지 탭 네비게이션
 * - 일정 관리 페이지와 동일한 디자인 적용
 */
export const ProgressTab = ({ activeTab, onTabChange }: ProgressTabProps) => {
  return (
    <nav className='flex px-4 gap-2 border-b border-border'>
      <TabItem
        title='스터디 로드맵'
        selected={activeTab === 'roadmap'}
        onClick={() => onTabChange('roadmap')}
      />
      <TabItem
        title='개인별 현황판'
        selected={activeTab === 'status'}
        onClick={() => onTabChange('status')}
      />
    </nav>
  );
};
