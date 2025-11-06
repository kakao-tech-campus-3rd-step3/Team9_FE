import { WS_PATHS } from '../constants';

/**
 * WebSocket topic URL 생성
 * @param studyId - 스터디 ID
 * @returns topic URL
 */
export function buildTopicUrl(studyId: string): string {
  return `${WS_PATHS.TOPIC_PREFIX}/${studyId}/chats`;
}

/**
 * WebSocket destination URL 생성
 * @param studyId - 스터디 ID
 * @returns destination URL
 */
export function buildDestinationUrl(studyId: string): string {
  return `${WS_PATHS.APP_PREFIX}/${studyId}/chats`;
}
