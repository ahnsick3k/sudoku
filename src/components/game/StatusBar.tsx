import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';

interface Props {
  timerText: string;
  maxMistakes: number;
  heartsRemaining: number;
}

export default function StatusBar({ timerText, maxMistakes, heartsRemaining }: Props) {
  return (
    <div className="flex items-center justify-between w-full py-2">
      <span className="text-[11px] tracking-widest" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
        {timerText}
      </span>
      <div className="flex gap-2 items-center">
        {Array.from({ length: maxMistakes }, (_, i) =>
          i < heartsRemaining
            ? <HeartIcon key={i} className="w-5 h-5" style={{ color: '#e53e3e' }} />
            : <HeartOutlineIcon key={i} className="w-5 h-5" style={{ color: 'var(--muted)', opacity: 0.35 }} />
        )}
      </div>
    </div>
  );
}
