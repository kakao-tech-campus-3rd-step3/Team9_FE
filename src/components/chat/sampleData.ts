// 개발 환경에서만 사용되는 샘플 채팅 데이터 (UI 개발/테스트용)
import type { ChatMessage, MessageType } from './types';

export const getSampleMessages = (): ChatMessage[] =>
  [
    {
      id: 'sample-notice-1',
      messageId: 1,
      messageType: 'NOTICE' as MessageType,
      content: '새로운 공지사항이 등록되었습니다.',
      senderId: 'system',
      senderName: '시스템',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
      isOwn: false,
      link: '/notice/study-rules',
    },
    {
      id: 'sample-schedule-1',
      messageId: 2,
      messageType: 'SCHEDULE' as MessageType,
      content: '새로운 일정이 등록되었습니다.',
      senderId: 'system',
      senderName: '시스템',
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25분 전
      isOwn: false,
      link: '/schedule/123',
    },
    {
      id: 'sample-chat-1',
      messageId: 3,
      messageType: 'CHAT' as MessageType,
      content:
        '안녕하세요! 오늘 스터디 화이팅입니다! 새로운 챕터 내용이 정말 흥미로워요.',
      senderId: 'user1',
      senderName: '김철수',
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20분 전
      isOwn: false,
      likeCount: 3,
      dislikeCount: 0,
    },
    {
      id: 'sample-chat-2',
      messageId: 4,
      messageType: 'CHAT' as MessageType,
      content: '네! 모두 화이팅해요! 저도 오늘 새로 배운 내용 정리하고 있어요.',
      senderId: 'user2',
      senderName: '이영희',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15분 전
      isOwn: false,
      likeCount: 1,
    },
    {
      id: 'sample-chat-3',
      messageId: 5,
      messageType: 'CHAT' as MessageType,
      content:
        '오늘 공부한 내용 정리해서 공유할게요! 특히 알고리즘 부분이 어려웠는데 도움이 되었으면 좋겠어요.',
      senderId: 'current-user',
      senderName: '나',
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10분 전
      isOwn: true,
      likeCount: 2,
      dislikeCount: 1,
    },
    {
      id: 'sample-notice-2',
      messageId: 6,
      messageType: 'NOTICE' as MessageType,
      content: '공지사항이 업데이트되었습니다.',
      senderId: 'system',
      senderName: '시스템',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
      isOwn: false,
      link: '/materials/chapter-3-4',
    },
    {
      id: 'sample-schedule-2',
      messageId: 7,
      messageType: 'SCHEDULE' as MessageType,
      content: '새로운 일정이 추가되었습니다.',
      senderId: 'system',
      senderName: '시스템',
      timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2분 전
      isOwn: false,
      link: '/schedule/midterm-presentation',
    },
    {
      id: 'sample-chat-4',
      messageId: 8,
      messageType: 'CHAT' as MessageType,
      content:
        '혹시 오늘 과제 질문 있는 분 있나요? 저는 3번 문제가 좀 어려워서 도움이 필요해요.',
      senderId: 'user3',
      senderName: '박민수',
      timestamp: new Date(Date.now() - 1000 * 60 * 1), // 1분 전
      isOwn: false,
    },
    {
      id: 'sample-chat-5',
      messageId: 9,
      messageType: 'CHAT' as MessageType,
      content: '저도 3번 문제 고민하고 있었는데, 함께 풀어볼까요?',
      senderId: 'user4',
      senderName: '정수진',
      timestamp: new Date(Date.now() - 1000 * 30), // 30초 전
      isOwn: false,
      likeCount: 1,
    },
    {
      id: 'sample-notice-3',
      messageId: 10,
      messageType: 'NOTICE' as MessageType,
      content: '공지사항이 등록되었습니다.',
      senderId: 'system',
      senderName: '시스템',
      timestamp: new Date(Date.now() - 1000 * 10), // 10초 전
      isOwn: false,
      link: '/notice/room-cancellation',
    },
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // 최신 메시지부터 정렬
