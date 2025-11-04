/**
 * 스터디원 관리 컴포넌트
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { User, Crown, UserMinus, Loader2 } from 'lucide-react';
import { getStudyMembers, removeMember, delegateLeadership } from '../services';
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
        console.log('[백엔드 원본 응답]', {
          전체응답: response,
          members배열: response.members,
          첫번째멤버원본: response.members[0],
          첫번째멤버키목록: response.members[0]
            ? Object.keys(response.members[0])
            : [],
        });

        response.members.forEach((member, index) => {
          const rawMember = member as unknown as Record<string, unknown>;
          console.log(`[멤버 ${index} 상세]`, {
            member_id: member.member_id,
            user_id: member.user_id,
            nickname: member.nickname,
            role: member.role,
            role_type: typeof member.role,
            user_detail: member.user_detail,
            // 모든 가능한 ID 필드 확인
            가능한ID필드들: {
              member_id: rawMember.member_id,
              memberId: rawMember.memberId,
              id: rawMember.id,
              user_id: rawMember.user_id,
              userId: rawMember.userId,
              member_user_id: rawMember.member_user_id,
              memberUserId: rawMember.memberUserId,
            },
            전체키목록: Object.keys(rawMember),
            전체원본데이터: rawMember,
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

        // member_id 매핑 개선 (다양한 필드명 지원)
        const rawMember = member as unknown as Record<string, unknown>;
        // 가능한 모든 필드명 시도 (API 문서에는 없지만 실제 응답에 있을 수 있음)
        const getNumericId = (value: unknown): number | null => {
          if (typeof value === 'number') return value;
          if (typeof value === 'string') {
            const parsed = Number.parseInt(value, 10);
            return Number.isNaN(parsed) ? null : parsed;
          }
          return null;
        };

        const memberId =
          getNumericId(rawMember.member_id) ||
          getNumericId(rawMember.memberId) ||
          getNumericId(rawMember.id) ||
          getNumericId(rawMember.user_id) ||
          getNumericId(rawMember.userId) ||
          getNumericId(rawMember.member_user_id) ||
          getNumericId(rawMember.memberUserId) ||
          // user_detail 내부에도 ID가 있을 수 있음
          (rawMember.user_detail &&
            typeof rawMember.user_detail === 'object' &&
            rawMember.user_detail !== null &&
            'user_id' in rawMember.user_detail &&
            getNumericId(rawMember.user_detail.user_id)) ||
          (rawMember.user_detail &&
            typeof rawMember.user_detail === 'object' &&
            rawMember.user_detail !== null &&
            'userId' in rawMember.user_detail &&
            getNumericId(rawMember.user_detail.userId)) ||
          (rawMember.user_detail &&
            typeof rawMember.user_detail === 'object' &&
            rawMember.user_detail !== null &&
            'id' in rawMember.user_detail &&
            getNumericId(rawMember.user_detail.id)) ||
          // 만약 아무 ID도 없으면 null 유지
          null;

        if (!memberId) {
          console.error(
            `[멤버 ID 없음] ${member.nickname}의 member_id를 찾을 수 없습니다.`,
            {
              원본멤버데이터: rawMember,
              원본키: Object.keys(rawMember),
              user_detail키: rawMember.user_detail
                ? Object.keys(rawMember.user_detail)
                : null,
              시도한필드명들: [
                'member_id',
                'memberId',
                'id',
                'user_id',
                'userId',
                'member_user_id',
                'memberUserId',
                'user_detail.user_id',
                'user_detail.userId',
              ],
            },
          );
        } else {
          console.log(
            `[멤버 ID 매핑 성공] ${member.nickname}: member_id = ${memberId}`,
          );
        }

        return {
          ...member,
          member_id: (memberId ?? member.member_id ?? undefined) as
            | number
            | undefined,
          role: normalizedRole,
        };
      });

      console.log('[정규화된 멤버 목록]', normalizedMembers);

      // 리더를 상단에 정렬 (리더가 먼저, 그 다음 멤버)
      const sortedMembers = [...normalizedMembers].sort((a, b) => {
        // 리더가 'Leader'인 경우 먼저 정렬
        if (a.role === 'Leader' && b.role !== 'Leader') {
          return -1;
        }
        if (a.role !== 'Leader' && b.role === 'Leader') {
          return 1;
        }
        // 둘 다 리더이거나 둘 다 멤버인 경우 기존 순서 유지
        return 0;
      });

      console.log('[정렬된 멤버 목록]', sortedMembers);
      setMembers(sortedMembers);
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

  // 리더 위임 처리 (PUT /api/studies/{study_id}/leader API 사용)
  const handleDelegateLeadership = async (memberId: number) => {
    if (!studyId) {
      alert('스터디 ID가 없습니다.');
      return;
    }

    if (!memberId) {
      alert('멤버 ID가 없습니다.');
      return;
    }

    const targetMember = members.find((m) => m.member_id === memberId);
    if (!targetMember) {
      alert('멤버를 찾을 수 없습니다.');
      return;
    }

    if (
      !window.confirm(
        `${targetMember.nickname}님에게 리더 권한을 위임하시겠습니까?`,
      )
    ) {
      return;
    }

    const actionKey = `delegate-${memberId}`;
    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }));

      console.log('[리더 위임 요청]', {
        studyId,
        newLeaderMemberId: memberId,
        targetMember: targetMember.nickname,
      });

      const response = await delegateLeadership(studyId, {
        newLeaderMemberId: memberId,
      });

      console.log('[리더 위임 응답]', {
        response,
        responseType: typeof response,
        responseKeys: response ? Object.keys(response) : [],
        hasSuccess:
          response && typeof response === 'object' && 'success' in response,
        successValue:
          response && typeof response === 'object' && 'success' in response
            ? (response as { success: boolean }).success
            : undefined,
      });

      // 응답이 성공이면 (success 필드가 true이거나, success 필드가 없어도 응답이 있으면 성공)
      const isSuccess =
        (response &&
          typeof response === 'object' &&
          'success' in response &&
          (response as { success: boolean }).success === true) ||
        (response &&
          typeof response === 'object' &&
          !('success' in response)) ||
        response !== undefined;

      if (isSuccess) {
        // 멤버 목록 먼저 새로고침 (리더 역할이 변경됨)
        await fetchMembers();

        alert('리더 권한이 위임되었습니다.');

        // 리더 권한이 변경되었으므로 현재 사용자가 리더가 아니면 관리자 페이지 접근 불가
        // 페이지를 새로고침하여 권한 상태를 업데이트
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        const errorMessage =
          response && typeof response === 'object' && 'message' in response
            ? (response as { message: string }).message
            : '리더 위임에 실패했습니다.';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('[리더 위임 실패]', error);
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        const errorData = error.response?.data as
          | {
              message?: string;
              code?: string;
              errors?: unknown[];
            }
          | undefined;

        console.error('[리더 위임 에러 상세]', {
          statusCode,
          errorData,
          전체에러응답: error.response?.data,
          url: error.config?.url,
          requestData: error.config?.data,
        });

        if (statusCode === 403) {
          alert(
            '리더 권한이 없습니다. 스터디 리더만 리더를 위임할 수 있습니다.',
          );
        } else if (statusCode === 404) {
          alert('스터디 또는 멤버를 찾을 수 없습니다.');
        } else {
          alert(
            errorData?.message ||
              '리더 위임에 실패했습니다. 잠시 후 다시 시도해주세요.',
          );
        }
      } else {
        alert('리더 위임에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  // 스터디원 탈퇴 처리
  const handleRemoveMember = async (memberId: number, memberName: string) => {
    if (!memberId) {
      alert('멤버 ID가 없습니다.');
      return;
    }
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

      // 204 No Content 또는 success 응답 모두 성공으로 처리
      if (response?.success !== false) {
        setMembers((prev) =>
          prev.filter((member) => member.member_id !== memberId),
        );
        alert('스터디원이 탈퇴되었습니다.');
      } else {
        alert(response.message || '탈퇴 처리에 실패했습니다.');
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
                key={member.member_id || member.nickname}
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
                    {(member.email || member.user_detail?.email) && (
                      <p className='text-sm text-muted-foreground'>
                        {member.email || member.user_detail?.email}
                      </p>
                    )}
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
                        handleDelegateLeadership(member.member_id || 0)
                      }
                      disabled={
                        !member.member_id ||
                        actionLoading[`delegate-${member.member_id}`]
                      }
                      className='px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      title={
                        !member.member_id
                          ? '멤버 ID가 없어서 사용할 수 없습니다.'
                          : ''
                      }
                    >
                      {actionLoading[`delegate-${member.member_id}`] ? (
                        <Loader2 className='h-3 w-3 animate-spin' />
                      ) : (
                        '리더 위임'
                      )}
                    </button>
                  )}

                  {member.role !== 'Leader' && (
                    <button
                      onClick={() =>
                        handleRemoveMember(
                          member.member_id || 0,
                          member.nickname,
                        )
                      }
                      disabled={
                        !member.member_id ||
                        actionLoading[`remove-${member.member_id}`]
                      }
                      className='px-3 py-1 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1'
                      title={
                        !member.member_id
                          ? '멤버 ID가 없어서 사용할 수 없습니다.'
                          : ''
                      }
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
