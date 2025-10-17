import { Check, X } from 'lucide-react';
import { useAttendanceStudyQuery } from '../hooks/useAttendanceStudyQuery';
import { ErrorBoundary, LoadingSpinner } from '@/components';
import { Suspense } from 'react';

type MemberInfoSectionProps = {
  study_id: number;
};

const MemberInfoSection = ({ study_id }: MemberInfoSectionProps) => {
  const { data: members } = useAttendanceStudyQuery({ study_id });
  const scheduleDates =
    members.members[0]?.attendance.map((a) => a.schedule_date) ?? [];

  return (
    <ErrorBoundary>
      <section className='flex flex-col w-full p-4 gap-3 overflow-y-auto'>
        <div className='flex-1 flex flex-col items-center h-full px-6 py-4 border-2 border-primary rounded-xl'>
          <Suspense fallback={<LoadingSpinner />}>
            {members.members.length > 0 ? (
              <div className='w-full overflow-x-auto'>
                <table className='table-auto min-w-max border-collapse'>
                  <thead>
                    <tr>
                      <th
                        colSpan={2}
                        className='border-b-2 border-primary px-5 py-3 text-center'
                      >
                        스터디 참여 현황
                      </th>
                      {scheduleDates.map((date, i) => (
                        <th
                          key={i}
                          className='border-b-2 border-primary px-5 py-3 text-center'
                        >
                          {new Date(date).toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {members.members.map((member, index) => (
                      <tr key={`${member.name}-${index}`}>
                        <td className='border-b border-primary text-center px-5 py-3 '>
                          <div className='w-8 h-8 rounded-full overflow-hidden bg-red-400' />
                        </td>
                        <td className='border-b border-primary px-5 py-3 whitespace-nowrap'>
                          {member.name}
                        </td>
                        {member.attendance.map((attendance, i) => (
                          <td
                            key={i}
                            className='border-b border-primary px-5 py-3'
                          >
                            <div className='flex items-center justify-center'>
                              {attendance.status ? (
                                <Check color='#10b981' />
                              ) : (
                                <X color='#ef4444' />
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>참여 현황이 없습니다.</p>
            )}
          </Suspense>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default MemberInfoSection;
