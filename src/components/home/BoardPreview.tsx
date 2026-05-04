import type { BoardData } from '@/lib/types';

interface Props {
  given: BoardData['given'];
  solution: BoardData['solution'];
  className?: string;
}

export default function BoardPreview({ given, solution, className = '' }: Props) {
  return (
    <div
      className={`relative aspect-square w-full ${className}`}
      style={{
        background: 'var(--cell)',
        borderRadius: 2,
        border: '2px solid var(--board-border)',
      }}
    >
      {/* Grid overlay via box-shadow is not feasible inline; use SVG lines instead */}
      <svg
        viewBox="0 0 9 9"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 10 }, (_, i) => (
          <g key={i}>
            <line
              x1={i} y1={0} x2={i} y2={9}
              stroke="var(--board-border)"
              strokeWidth={i % 3 === 0 ? 0.06 : 0.025}
              strokeOpacity={i % 3 === 0 ? 0.78 : 0.22}
            />
            <line
              x1={0} y1={i} x2={9} y2={i}
              stroke="var(--board-border)"
              strokeWidth={i % 3 === 0 ? 0.06 : 0.025}
              strokeOpacity={i % 3 === 0 ? 0.78 : 0.22}
            />
          </g>
        ))}
      </svg>

      {/* Numbers */}
      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: 'repeat(9, 1fr)', gridTemplateRows: 'repeat(9, 1fr)' }}>
        {Array.from({ length: 81 }, (_, idx) => {
          const r = Math.floor(idx / 9), c = idx % 9;
          const v = given[r][c];
          const label = v != null ? v : solution[r][c];
          const opacity = v != null ? 1 : 0.11;
          return (
            <div
              key={idx}
              className="flex items-center justify-center text-[min(2.4vw,11px)] font-thin"
              style={{
                color: `rgba(${v != null ? '31,34,40' : '31,34,40'}, ${opacity})`,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
