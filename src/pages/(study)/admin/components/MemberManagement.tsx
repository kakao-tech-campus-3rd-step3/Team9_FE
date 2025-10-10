/**
 * 스터디원 관리 컴포넌트
 */

import React, { useState, useEffect } from 'react';
import { User, Crown, UserMinus, Loader2 } from 'lucide-react';
import { getStudyMembers, changeMemberRole, removeMember } from '../services';
import { getMockMembers, MOCK_STUDY_ID } from '../mock';
import { useAdminPage } from '../AdminPage';
import type { StudyMember } from '../types';

export const MemberManagement: React.FC = () => {
  const { setRefreshMembersFn } = useAdminPage();
  const [members, setMembers] = useState<StudyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );

  // 스터디원 목록 조회
  const fetchMembers = async () => {
    try {
      setLoading(true);
      // 개발 환경에서는 Mock 데이터 사용
      if (import.meta.env.DEV) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        setMembers(getMockMembers().members);
      } else {
        const response = await getStudyMembers(MOCK_STUDY_ID);
        setMembers(response.members);
      }
    } catch (error) {
      console.error('스터디원 목록 조회 실패:', error);
      // 에러 시 Mock 데이터 사용
      setMembers(getMockMembers().members);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // AdminPage의 refreshMembers 함수에 현재 fetchMembers 함수 등록
  useEffect(() => {
    setRefreshMembersFn(fetchMembers);
  }, [setRefreshMembersFn]);

  // 스터디원 역할 변경
  const handleRoleChange = async (
    memberId: number,
    newRole: 'Leader' | 'Member',
  ) => {
    const actionKey = `role-${memberId}`;
    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }));

      if (import.meta.env.DEV) {
        // Mock 응답 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setMembers((prev) =>
          prev.map((member) =>
            member.member_id === memberId
              ? { ...member, role: newRole }
              : member,
          ),
        );
        alert('역할이 변경되었습니다.');
      } else {
        const response = await changeMemberRole(MOCK_STUDY_ID, {
          member_id: memberId,
          role: newRole,
        });

        if (response.success) {
          setMembers((prev) =>
            prev.map((member) =>
              member.member_id === memberId
                ? { ...member, role: newRole }
                : member,
            ),
          );
          alert('역할이 변경되었습니다.');
        }
      }
    } catch (error) {
      console.error('역할 변경 실패:', error);
      alert('역할 변경에 실패했습니다.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  // 스터디원 탈퇴 처리
  const handleRemoveMember = async (memberId: number, memberName: string) => {
    if (!window.confirm(`${memberName}님을 스터디에서 탈퇴시키시겠습니까?`)) {
      return;
    }

    const actionKey = `remove-${memberId}`;
    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }));

      if (import.meta.env.DEV) {
        // Mock 응답 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setMembers((prev) =>
          prev.filter((member) => member.member_id !== memberId),
        );
        alert('스터디원이 탈퇴되었습니다.');
      } else {
        const response = await removeMember(MOCK_STUDY_ID, {
          member_id: memberId,
        });

        if (response.success) {
          setMembers((prev) =>
            prev.filter((member) => member.member_id !== memberId),
          );
          alert('스터디원이 탈퇴되었습니다.');
        }
      }
    } catch (error) {
      console.error('탈퇴 처리 실패:', error);
      alert('탈퇴 처리에 실패했습니다.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  if (loading) {
    return (
      <div className='bg-card rounded-lg border border-border p-6'>
        <div className='flex justify-center items-center h-32'>
          <Loader2 className='h-6 w-6 animate-spin text-primary' />
        </div>
      </div>
    );
  }

  return (
    <div className='bg-card rounded-lg border border-border p-6'>
      <div className='space-y-6'>
        <div>
          <h2 className='text-lg font-semibold text-foreground'>
            스터디원 관리
          </h2>
          <p className='text-sm text-muted-foreground mt-1'>
            현재 스터디원을 관리할 수 있습니다.
          </p>
        </div>

        {members.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>
            <User className='h-12 w-12 mx-auto mb-4 text-muted-foreground/50' />
            <p>스터디원이 없습니다.</p>
          </div>
        ) : (
          <div className='grid gap-4'>
            {members.map((member) => (
              <div
                key={member.member_id}
                className='flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border'
              >
                <div className='flex items-center space-x-3'>
                  {member.user_detail.file_key ? (
                    <img
                      src={member.user_detail.file_key}
                      alt={member.nickname}
                      className='h-10 w-10 rounded-full object-cover'
                    />
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-muted flex items-center justify-center'>
                      <User className='h-5 w-5 text-muted-foreground' />
                    </div>
                  )}
                  <div>
                    <div className='flex items-center space-x-2'>
                      <p className='font-medium text-foreground'>
                        {member.nickname}
                      </p>
                      {member.role === 'Leader' && (
                        <Crown className='h-4 w-4 text-yellow-500' />
                      )}
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {member.email}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      가입일: {member.join_date}
                    </p>
                    {member.message && (
                      <p className='text-xs text-muted-foreground mt-1'>
                        "{member.message}"
                      </p>
                    )}
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.role === 'Leader'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {member.role === 'Leader' ? '리더' : '멤버'}
                  </span>

                  {member.role === 'Member' && (
                    <button
                      onClick={() =>
                        handleRoleChange(member.member_id, 'Leader')
                      }
                      disabled={actionLoading[`role-${member.member_id}`]}
                      className='px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50'
                    >
                      {actionLoading[`role-${member.member_id}`] ? (
                        <Loader2 className='h-3 w-3 animate-spin' />
                      ) : (
                        '리더로 변경'
                      )}
                    </button>
                  )}

                  {member.role !== 'Leader' && (
                    <button
                      onClick={() =>
                        handleRemoveMember(member.member_id, member.nickname)
                      }
                      disabled={actionLoading[`remove-${member.member_id}`]}
                      className='px-3 py-1 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50 flex items-center space-x-1'
                    >
                      {actionLoading[`remove-${member.member_id}`] ? (
                        <Loader2 className='h-3 w-3 animate-spin' />
                      ) : (
                        <>
                          <UserMinus className='h-3 w-3' />
                          <span>탈퇴</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
