interface Props {
  timerText: string;
  maxMistakes: number;
  heartsRemaining: number;
}

export default function StatusBar({ timerText, maxMistakes, heartsRemaining }: Props) {
  return (
    <div className="flex items-center justify-between w-full py-1">
      <span className="text-[11px] tracking-widest" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
        {timerText}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: maxMistakes }, (_, i) => (
          <span
            key={i}
            className="text-base leading-none"
            style={{ color: i < heartsRemaining ? '#e53e3e' : 'var(--muted)', opacity: i < heartsRemaining ? 0.85 : 0.35 }}
          >
            {i < heartsRemaining ? '♥' : '♡'}
          </span>
        ))}
      </div>
    </div>
  );
}
