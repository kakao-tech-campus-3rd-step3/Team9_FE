import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * 재사용 가능한 인풋 컴포넌트
 * - 아래 border만 표시
 * - 호버 및 포커스 효과 포함
 * - 에러 상태 지원
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className='space-y-2 w-full'>
        {label && (
          <label
            htmlFor={props.id}
            className='block text-sm font-medium text-foreground'
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-2 py-2 bg-transparent border-0 border-b-2 
            text-sm text-foreground placeholder:text-muted-foreground placeholder:text-sm
            focus:outline-none focus:ring-0 transition-colors
            ${
              error
                ? 'border-destructive focus:border-destructive'
                : 'border-input focus:border-primary hover:border-muted-foreground/50'
            }
            ${className}
          `.trim()}
          {...props}
        />
        {error && <p className='text-sm text-destructive'>{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
