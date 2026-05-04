interface Props {
  selectedValue: number | null;
  completedNumbers: Set<number>;
  onTap: (n: number) => void;
}

export default function NumberPad({ selectedValue, completedNumbers, onTap }: Props) {
  return (
    <div className="grid grid-cols-9 gap-1 px-1 w-full">
      {[1,2,3,4,5,6,7,8,9].map(n => {
        const isCompleted = completedNumbers.has(n);
        const isSelected  = selectedValue === n;
        return (
          <button
            key={n}
            disabled={isCompleted}
            onClick={() => onTap(n)}
            className="aspect-[0.85] flex items-center justify-center rounded transition-colors"
            style={{
              background:  isSelected ? 'var(--accent-soft)' : 'transparent',
              color:       isCompleted ? 'var(--muted)'
                         : isSelected  ? 'var(--accent)'
                                       : 'var(--given-text)',
              opacity:     isCompleted ? 0.35 : 1,
              fontFamily:  'var(--font-mono)',
              fontSize:    'min(6vw,22px)',
              fontWeight:  isSelected ? 400 : 300,
              cursor:      isCompleted ? 'default' : 'pointer',
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
