import { MessageCircle } from 'lucide-react';

interface ChatToggleButtonProps {
  onClick: () => void;
  isOpen?: boolean;
  className?: string;
}

export function ChatToggleButton({
  onClick,
  isOpen = false,
  className = 'fixed bottom-6 right-6 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-xl hover:bg-primary-hover transition-all duration-200 flex items-center justify-center z-50 border-2 border-primary/20 hover:border-primary/40 hover:scale-105',
}: ChatToggleButtonProps) {
  if (isOpen) return null;

  return (
    <button onClick={onClick} className={className} aria-label='채팅 열기'>
      <MessageCircle className='w-7 h-7' />
    </button>
  );
}
