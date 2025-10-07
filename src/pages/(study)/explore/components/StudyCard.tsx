/**
 * 스터디 카드 컴포넌트
 */

import React from 'react';
import { Users, Eye } from 'lucide-react';
import type { Study } from '../types';

interface StudyCardProps {
  study: Study;
  onCardClick: (study: Study) => void;
  onApplyClick: (study: Study) => void;
}

const StudyCard: React.FC<StudyCardProps> = ({
  study,
  onCardClick,
  onApplyClick,
}) => {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow flex flex-col'>
      <div className='p-6 flex-1'>
        <div className='mb-4'>
          <div className='w-full h-32 bg-primary-light rounded-lg mb-4 flex items-center justify-center overflow-hidden'>
            {study.imageUrl ? (
              <img
                src={study.imageUrl}
                alt={study.title}
                className='w-full h-full object-cover rounded-lg'
                onError={(e) => {
                  // 이미지 로드 실패 시 아이콘으로 대체
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                    <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <span class="text-primary-foreground text-lg font-bold">${study.title.charAt(0)}</span>
                    </div>
                  `;
                  }
                }}
              />
            ) : (
              <div className='w-12 h-12 bg-primary rounded-lg flex items-center justify-center'>
                <span className='text-primary-foreground text-lg font-bold'>
                  {study.title.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <h3 className='text-lg font-semibold text-foreground mb-2'>
            {study.title}
          </h3>
          <p className='text-sm text-foreground mb-3'>{study.description}</p>
          <div className='flex flex-wrap gap-1 mb-2'>
            {study.interests && study.interests.length > 0 ? (
              study.interests.map((interest, index) => {
                // 카테고리 매핑 (백엔드 DB의 category를 프론트엔드 카테고리로 변환)
                const categoryMapping: { [key: string]: string } = {
                  개발: '프로그래밍',
                  어학: '어학',
                  취업: '취업',
                  '고시/공무원': '고시/공무원',
                  '취미/교양': '취미/교양',
                  '자율/기타': '자율/기타',
                };
                const mappedInterest = categoryMapping[interest] || interest;
                return (
                  <span
                    key={index}
                    className='inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full'
                  >
                    {mappedInterest}
                  </span>
                );
              })
            ) : (
              <span className='inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full'>
                {(() => {
                  // 카테고리 매핑 (백엔드 DB의 category를 프론트엔드 카테고리로 변환)
                  const categoryMapping: { [key: string]: string } = {
                    개발: '프로그래밍',
                    어학: '어학',
                    취업: '취업',
                    '고시/공무원': '고시/공무원',
                    '취미/교양': '취미/교양',
                    '자율/기타': '자율/기타',
                  };
                  return categoryMapping[study.category] || study.category;
                })()}
              </span>
            )}
          </div>
          <p className='text-xs text-muted-foreground'>📍 {study.region}</p>
        </div>
      </div>

      <div className='p-6 pt-0'>
        <div className='flex items-center text-sm text-muted-foreground mb-3'>
          <Users className='h-4 w-4 mr-1' />
          <span>
            참여자 수 {study.currentMembers}/{study.maxMembers}
          </span>
        </div>
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={() => onCardClick(study)}
            className='flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-lg hover:bg-secondary-hover transition-colors flex items-center justify-center gap-2'
          >
            <Eye className='h-4 w-4' />
            상세보기
          </button>
          <button
            type='button'
            onClick={() => onApplyClick(study)}
            className='flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors'
          >
            참여하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyCard;
