import { NavLink } from 'react-router-dom';
import { STUDY_NAV_ITEMS } from '@/pages/(study)/constants';

/**
 * 사이드바 네비게이션 컴포넌트
 * 스터디 관련 메뉴 항목들을 표시하고 활성 상태를 관리합니다.
 */
function SidebarNav() {
  return (
    <nav className='p-4'>
      <ul className='space-y-1.5'>
        {STUDY_NAV_ITEMS.map((item) => {
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={false}
                className={({ isActive }) =>
                  `group relative block px-2 py-2.5 rounded-md text-md overflow-hidden transition-colors ${
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className='inline-flex items-center gap-3 min-w-0'>
                      <span
                        aria-hidden
                        className={`transition-colors duration-200 ease-out ${
                          isActive
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-primary/80'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={`truncate font-semibold transition-colors duration-200 ease-out ${
                          isActive
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-primary/80'
                        }`}
                      >
                        {item.label}
                      </span>
                    </span>
                    {/* 활성 상태 및 호버 시 하단 강조선 애니메이션 */}
                    <span
                      className={`pointer-events-none absolute inset-x-2 bottom-0 rounded-full bg-primary transform origin-left transition-transform duration-700 ease-out ${
                        isActive
                          ? 'h-[4px] scale-x-100 bg-primary'
                          : 'h-[4px] scale-x-0 bg-primary/80 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SidebarNav;
