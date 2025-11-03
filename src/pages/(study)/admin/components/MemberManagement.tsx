/**
 * 스터디원 관리 컴포넌트
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { User, Crown, UserMinus, Loader2 } from 'lucide-react';
import {
  getStudyMembers,
  changeMemberRole,
  removeMember,
  delegateLeadership,
} from '../services';
import { useAdminPage } from '../AdminPage';
import type { StudyMember } from '../types';
import { ROUTE_PARAMS } from '@/constants';
import { useAuthStore } from '@/stores/auth';
import { useCurrentStudy } from '@/hooks/study/useCurrentStudy';
import UserAvatar from '@/components/user/UserAvatar';

export const MemberManagement: React.FC = () => {
  const { setRefreshMembersFn } = useAdminPage();
  const params = useParams<{ [ROUTE_PARAMS.studyId]: string }>();
  const studyId = params[ROUTE_PARAMS.studyId]
    ? Number(params[ROUTE_PARAMS.studyId])
    : null;

  // 현재 사용자 정보 및 스터디 정보 가져오기
  const currentStudy = useAuthStore((state) => state.user.currentStudy);
  const { data: studyInfo } = useCurrentStudy(studyId || undefined);

  const [members, setMembers] = useState<StudyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );

  // 스터디원 목록 조회
  const fetchMembers = useCallback(async () => {
    if (!studyId) {
      console.error('스터디 ID가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`[스터디원 목록 조회] studyId: ${studyId}`);
      const response = await getStudyMembers(studyId);
      console.log('[스터디원 목록 조회 성공]', response);
      console.log('[스터디원 목록 상세]', response.members);

      // 응답 데이터 확인 및 디버깅
      if (response.members) {
        response.members.forEach((member, index) => {
          console.log(`[멤버 ${index}]`, {
            member_id: member.member_id,
            user_id: member.user_id,
            nickname: member.nickname,
            role: member.role,
            role_type: typeof member.role,
            user_detail: member.user_detail,
          });
        });
      }

      // 현재 사용자 정보 가져오기
      const currentUserNickname = useAuthStore.getState().user.nickname;

      // 리더 여부 확인 (여러 방법으로 확인)
      const studyInfoRole = studyInfo?.role;
      const currentStudyRole = currentStudy?.role;
      const studyInfoRoleStr = String(studyInfoRole || '').toUpperCase();
      const currentStudyRoleStr = String(currentStudyRole || '').toUpperCase();

      const isCurrentUserLeader =
        studyInfoRoleStr === 'LEADER' ||
        currentStudyRoleStr === 'LEADER' ||
        studyInfoRole === 'LEADER' ||
        currentStudyRole === 'LEADER';

      console.log('[현재 사용자 정보]', {
        nickname: currentUserNickname,
        isLeader: isCurrentUserLeader,
        studyInfoRole: studyInfo?.role,
        currentStudyRole: currentStudy?.role,
        studyInfoRoleStr,
        currentStudyRoleStr,
      });

      // 현재 사용자가 리더인지 확인하고 role 보정
      const normalizedMembers = response.members.map((member) => {
        // 백엔드 응답의 role이 대소문자가 다를 수 있으므로 정규화
        let normalizedRole = member.role;

        if (typeof member.role === 'string') {
          const roleLower = member.role.toLowerCase();
          if (roleLower === 'leader' || roleLower === '리더') {
            normalizedRole = 'Leader';
          } else if (roleLower === 'member' || roleLower === '멤버') {
            normalizedRole = 'Member';
          }
        }

        // 리더 확인 로직 개선: 여러 방법으로 리더 확인
        const isMemberLeader =
          normalizedRole === 'Leader' ||
          (isCurrentUserLeader &&
            currentUserNickname &&
            member.nickname === currentUserNickname) ||
          // 첫 번째 멤버이거나 멤버가 1명뿐이면 리더로 간주
          (response.members.length === 1 &&
            (normalizedRole === 'Member' || !normalizedRole));

        if (isMemberLeader) {
          normalizedRole = 'Leader';
          console.log(`[Role 보정] ${member.nickname}를 Leader로 설정`, {
            원본role: member.role,
            정규화된role: normalizedRole,
            멤버수: response.members.length,
          });
        }

        return {
          ...member,
          role: normalizedRole,
        };
      });

      console.log('[정규화된 멤버 목록]', normalizedMembers);
      setMembers(normalizedMembers);
    } catch (error) {
      console.error('스터디원 목록 조회 실패:', error);
      if (error instanceof AxiosError) {
        console.error('에러 상세:', error);
        console.error('응답 데이터:', error.response?.data);
      }
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [studyId, currentStudy?.role, studyInfo?.role]);

  useEffect(() => {
    if (studyId) {
      fetchMembers();
    }
  }, [studyId, fetchMembers]);

  // AdminPage의 refreshMembers 함수에 현재 fetchMembers 함수 등록
  useEffect(() => {
    setRefreshMembersFn(fetchMembers);
  }, [setRefreshMembersFn, fetchMembers]);

  // 스터디원 역할 변경
  const handleRoleChange = async (
    memberId: number,
    newRole: 'Leader' | 'Member',
  ) => {
    if (!studyId) {
      alert('스터디 ID가 없습니다.');
      return;
    }

    const actionKey = `role-${memberId}`;
    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }));

      const response = await changeMemberRole(studyId, {
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
    } catch (error) {
      console.error('역할 변경 실패:', error);
      alert('역할 변경에 실패했습니다.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  // 스터디원 탈퇴 처리
  const handleRemoveMember = async (memberId: number, memberName: string) => {
    if (!studyId) {
      alert('스터디 ID가 없습니다.');
      return;
    }

    if (!window.confirm(`${memberName}님을 스터디에서 탈퇴시키시겠습니까?`)) {
      return;
    }

    const actionKey = `remove-${memberId}`;
    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }));

      const response = await removeMember(studyId, {
        member_id: memberId,
      });

      if (response.success) {
        setMembers((prev) =>
          prev.filter((member) => member.member_id !== memberId),
        );
        alert('스터디원이 탈퇴되었습니다.');
      }
    } catch (error) {
      console.error('탈퇴 처리 실패:', error);
      alert('탈퇴 처리에 실패했습니다.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  // 리더 위임 처리
  const handleDelegateLeadership = async (
    memberId: number,
    memberName: string,
  ) => {
    if (!studyId) {
      alert('스터디 ID가 없습니다.');
      return;
    }

    if (!window.confirm(`${memberName}님에게 리더 권한을 위임하시겠습니까?`)) {
      return;
    }

    const actionKey = `delegate-${memberId}`;
    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }));

      const response = await delegateLeadership(studyId, {
        new_leader_id: memberId,
      });

      if (response.success) {
        // 리더 역할 업데이트
        setMembers((prev) =>
          prev.map((member) => ({
            ...member,
            role: member.member_id === memberId ? 'Leader' : 'Member',
          })),
        );
        alert('리더 권한이 위임되었습니다.');
      }
    } catch (error) {
      console.error('리더 위임 실패:', error);
      alert('리더 위임에 실패했습니다.');
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
                  <UserAvatar
                    imageKey={member.user_detail?.file_key}
                    name={member.nickname}
                    className='h-10 w-10'
                  />
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

                  {member.role === 'Leader' && (
                    <button
                      onClick={() =>
                        handleDelegateLeadership(
                          member.member_id,
                          member.nickname,
                        )
                      }
                      disabled={actionLoading[`delegate-${member.member_id}`]}
                      className='px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50'
                    >
                      {actionLoading[`delegate-${member.member_id}`] ? (
                        <Loader2 className='h-3 w-3 animate-spin' />
                      ) : (
                        '리더 위임'
                      )}
                    </button>
                  )}

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
