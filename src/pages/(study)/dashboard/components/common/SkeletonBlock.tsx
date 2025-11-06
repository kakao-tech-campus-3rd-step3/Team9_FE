interface SkeletonBlockProps {
  lines?: number; // 기본 4줄
  minHeightClass?: string; // 예: min-h-[140px]
}

const SkeletonBlock = ({ lines = 4, minHeightClass }: SkeletonBlockProps) => {
  const items = Array.from({ length: lines });
  const widths = ['w-24', 'w-full', 'w-5/6', 'w-2/3'];
  return (
    <div className={`animate-pulse space-y-4 ${minHeightClass ?? ''}`}>
      {items.map((_, i) => (
        <div
          key={i}
          className={`h-2 bg-accent rounded ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  );
};

export default SkeletonBlock;
