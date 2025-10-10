interface ScoreSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const ScoreSlider = ({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
}: ScoreSliderProps) => {
  return (
    <div className='bg-card rounded-lg border border-border p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-foreground'>{label}</h3>
        <span className='text-2xl font-bold text-primary'>
          {value}/{max}
        </span>
      </div>

      <div className='relative'>
        <input
          type='range'
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className='w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider'
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((value - min) / (max - min)) * 100}%, hsl(var(--secondary)) ${((value - min) / (max - min)) * 100}%, hsl(var(--secondary)) 100%)`,
          }}
        />

        {/* 점수 표시 */}
        <div className='flex justify-between mt-2 text-xs text-muted-foreground'>
          {Array.from({ length: max - min + 1 }, (_, i) => i + min).map(
            (num) => (
              <span
                key={num}
                className={value === num ? 'text-primary font-semibold' : ''}
              >
                {num}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreSlider;
