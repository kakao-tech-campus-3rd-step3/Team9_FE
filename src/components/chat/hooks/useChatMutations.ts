import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatKeys } from '@/constants/queryKeys';
import { chatService } from '../chatService';

// 메시지 전송 뮤테이션
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studyId,
      content,
    }: {
      studyId: string;
      content: string;
    }) => {
      await chatService.sendMessage(studyId, content);
    },
    onSuccess: () => {
      // 기록을 다시 불러와서 낙관적 메시지를 서버 기록으로 대체
      queryClient.invalidateQueries({
        queryKey: chatKeys.histories(),
      });
    },
    onError: (error) => {
      console.error('메시지 전송 실패:', error);
    },
  });
}
