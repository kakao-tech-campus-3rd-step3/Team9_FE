import { useEffect, useState } from 'react';
import { getUserStudyInfo } from '@/services';
import { useAuthStore } from '@/stores/auth';

// 특정 스터디 페이지에서 현재 스터디 정보 동기화 훅
// - studyId가 없으면 아무 것도 하지 않음
// - 마운트 시 정보 로드, 언마운트 시 해제
export const useCurrentStudy = (studyId?: number) => {
  const setCurrentStudy = useAuthStore((s) => s.setCurrentStudy);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!studyId && studyId !== 0) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const info = await getUserStudyInfo(studyId as number);
        if (!mounted) return;
        setCurrentStudy({ title: info.title, role: info.role });
      } catch (e) {
        if (!mounted) return;
        setError(e);
        setCurrentStudy(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
      setCurrentStudy(null);
    };
  }, [studyId, setCurrentStudy]);

  return { loading, error } as const;
};
