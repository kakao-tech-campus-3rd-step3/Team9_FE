import { useState } from 'react';
import { Plus, Edit, Trash2, Check, Clock } from 'lucide-react';
import { AddSessionModal } from './AddSessionModal';

type Session = {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
};

/**
 * 스터디 로드맵 탭 컴포넌트
 * - 차시별 스터디 진행 상황을 타임라인 형태로 표시
 * - 차시 추가, 수정, 삭제, 완료 기능 제공
 */
export const StudyRoadmapTab = () => {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 1,
      title: '1차시에 진행할 내용입니다.',
      description: 'React 기초 개념과 컴포넌트 구조에 대해 학습합니다.',
      isCompleted: false,
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      title: '2차시에 진행할 내용입니다.',
      description: 'State와 Props를 활용한 동적 컴포넌트 구현을 학습합니다.',
      isCompleted: false,
      createdAt: '2024-01-22',
    },
    {
      id: 3,
      title: '3차시에 진행할 내용입니다.',
      description: 'React Hooks를 사용한 함수형 컴포넌트 개발을 학습합니다.',
      isCompleted: false,
      createdAt: '2024-01-29',
    },
    {
      id: 4,
      title: '4차시에 진행할 내용입니다.',
      description: 'React Router를 활용한 SPA 라우팅 구현을 학습합니다.',
      isCompleted: false,
      createdAt: '2024-02-05',
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddSession = (title: string, description: string) => {
    const newSession: Session = {
      id: Math.max(...sessions.map((s) => s.id)) + 1,
      title,
      description,
      isCompleted: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSessions([...sessions, newSession]);
  };

  const handleCompleteSession = (id: number) => {
    setSessions(
      sessions.map((session) =>
        session.id === id
          ? { ...session, isCompleted: !session.isCompleted }
          : session,
      ),
    );
  };

  const handleDeleteSession = (id: number) => {
    setSessions(sessions.filter((session) => session.id !== id));
  };

  return (
    <div className='p-6'>
      {/* 헤더 */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-xl font-semibold text-foreground'>
            스터디 로드맵
          </h2>
          <p className='text-sm text-muted-foreground mt-1'>
            총 {sessions.length}개 차시 • 완료{' '}
            {sessions.filter((s) => s.isCompleted).length}개
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
        >
          <Plus className='w-4 h-4' />
          차시 추가하기
        </button>
      </div>

      {/* 타임라인 */}
      <div className='space-y-6'>
        {sessions.length === 0 ? (
          <div className='text-center py-12 text-muted-foreground'>
            <Clock className='w-12 h-12 mx-auto mb-4 opacity-50' />
            <p className='text-lg font-medium'>아직 등록된 차시가 없습니다</p>
            <p className='text-sm'>첫 번째 차시를 추가해보세요!</p>
          </div>
        ) : (
          sessions.map((session, index) => (
            <div key={session.id} className='flex items-start gap-4'>
              {/* 차시 번호 */}
              <div className='flex flex-col items-center'>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    session.isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {session.isCompleted ? (
                    <Check className='w-5 h-5' />
                  ) : (
                    session.id
                  )}
                </div>
                {index < sessions.length - 1 && (
                  <div className='w-0.5 h-20 bg-border mt-2'></div>
                )}
              </div>

              {/* 차시 내용 */}
              <div
                className={`flex-1 border rounded-lg p-4 transition-colors ${
                  session.isCompleted
                    ? 'bg-green-50 border-green-200'
                    : 'bg-background border-border'
                }`}
              >
                <div className='flex justify-between items-start mb-3'>
                  <div className='flex-1'>
                    <h3
                      className={`font-medium ${
                        session.isCompleted
                          ? 'text-green-800 line-through'
                          : 'text-foreground'
                      }`}
                    >
                      {session.title}
                    </h3>
                    {session.description && (
                      <p
                        className={`text-sm mt-1 ${
                          session.isCompleted
                            ? 'text-green-600'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {session.description}
                      </p>
                    )}
                    <p className='text-xs text-muted-foreground mt-2'>
                      생성일: {session.createdAt}
                    </p>
                  </div>
                  <div className='flex gap-2 ml-4'>
                    <button className='p-1 text-muted-foreground hover:text-foreground transition-colors'>
                      <Edit className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className='p-1 text-muted-foreground hover:text-destructive transition-colors'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>
                <div className='flex justify-end'>
                  <button
                    onClick={() => handleCompleteSession(session.id)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      session.isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {session.isCompleted ? '완료됨' : '완료하기'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 차시 추가 모달 */}
      <AddSessionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSession}
      />
    </div>
  );
};
