interface Props {
  selectedValue: number | null;
  completedNumbers: Set<number>;
  onTap: (n: number) => void;
}

export default function NumberPad({ selectedValue, completedNumbers, onTap }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 px-6 w-full max-w-sm mx-auto">
      {[1,2,3,4,5,6,7,8,9].map(n => {
        const isCompleted = completedNumbers.has(n);
        const isSelected  = selectedValue === n;
        return (
          <button
            key={n}
            disabled={isCompleted}
            onClick={() => onTap(n)}
            className="h-16 flex items-center justify-center rounded transition-colors active:scale-95"
            style={{
              background:  isSelected ? 'var(--accent-soft)' : 'rgba(0,0,0,0.04)',
              color:       isCompleted ? 'var(--muted)'
                         : isSelected  ? 'var(--accent)'
                                       : 'var(--given-text)',
              opacity:     isCompleted ? 0.3 : 1,
              fontFamily:  'var(--font-mono)',
              fontSize:    28,
              fontWeight:  isSelected ? 500 : 300,
              cursor:      isCompleted ? 'default' : 'pointer',
              border:      isSelected ? '1.5px solid var(--accent)' : '1px solid transparent',
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
