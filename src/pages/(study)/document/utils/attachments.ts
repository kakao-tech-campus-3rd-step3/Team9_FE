import type { Attachment, Material } from '../types';

// 첨부 중복 제거 키 생성: URL > 자료ID:첨부ID > 자료ID:파일명:사이즈 > 파일명:사이즈
export const createAttachmentDedupKey = (
  materialId: string,
  a: Attachment,
): string => {
  const urlKey = a.url && a.url.length > 0 ? a.url : '';
  const idKey = a.id != null ? String(a.id) : '';
  const nameSizeKey = `${a.name ?? ''}:${a.size ?? 0}`;
  return (
    urlKey ||
    `${materialId}:${idKey}` ||
    `${materialId}:${nameSizeKey}` ||
    nameSizeKey
  );
};

export const aggregateAttachments = (materials: Material[]): Attachment[] => {
  const map = new Map<string, Attachment>();
  materials.forEach((m) => {
    (m.attachments || []).forEach((a) => {
      const key = createAttachmentDedupKey(m.id, a);
      if (!map.has(key)) map.set(key, a);
    });
  });
  return Array.from(map.values());
};
