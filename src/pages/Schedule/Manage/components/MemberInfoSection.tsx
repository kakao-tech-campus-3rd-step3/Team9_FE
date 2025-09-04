import { Check, X } from 'lucide-react';
import { attendanceData } from '../mock/attendance';

const MemberInfoSection = () => {
  const scheduleDates =
    attendanceData.member[0]?.attendance[0]?.schedule_date ?? [];

  return (
    <section className='flex flex-col w-full p-4 gap-3 max-w-7xl overflow-y-auto'>
      <div className='flex-1 flex flex-col items-center h-full px-6 py-4 border-2 border-primary rounded-xl'>
        {attendanceData.member.length > 0 ? (
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
                {attendanceData.member.map((member, index) => (
                  <tr key={`${member.name}-${index}`}>
                    <td className='border-b border-primary text-center px-5 py-3 '>
                      <div className='w-8 h-8 rounded-full overflow-hidden bg-red-400' />
                    </td>
                    <td className='border-b border-primary px-5 py-3 whitespace-nowrap'>
                      {member.name}
                    </td>
                    {member.attendance[0].status.map((isPresent, i) => (
                      <td key={i} className='border-b border-primary px-5 py-3'>
                        <div className='flex items-center justify-center'>
                          {isPresent ? (
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
      </div>
    </section>
  );
};

export default MemberInfoSection;
