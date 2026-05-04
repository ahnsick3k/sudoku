import type { SudokuCellState, CellCoordinate } from '@/lib/types';
import { coordId } from '@/lib/types';

interface Props {
  rows: SudokuCellState[][];
  onTapCell: (coord: CellCoordinate) => void;
}

export default function SudokuBoard({ rows, onTapCell }: Props) {
  return (
    <div
      className="relative w-full aspect-square rounded-sm overflow-hidden"
      style={{
        border: '2px solid var(--board-border)',
        background: 'var(--cell)',
      }}
    >
      {/* Cells */}
      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: 'repeat(9, 1fr)', gridTemplateRows: 'repeat(9, 1fr)' }}
      >
        {rows.flat().map(cell => (
          <SudokuCell
            key={coordId(cell.coordinate)}
            cell={cell}
            onTap={() => onTapCell(cell.coordinate)}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 9 9"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 10 }, (_, i) => (
          <g key={i}>
            <line x1={i} y1={0} x2={i} y2={9}
              stroke="var(--board-border)"
              strokeWidth={i % 3 === 0 ? 0.07 : 0.028}
              strokeOpacity={i % 3 === 0 ? 0.78 : 0.22}
            />
            <line x1={0} y1={i} x2={9} y2={i}
              stroke="var(--board-border)"
              strokeWidth={i % 3 === 0 ? 0.07 : 0.028}
              strokeOpacity={i % 3 === 0 ? 0.78 : 0.22}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

function SudokuCell({ cell, onTap }: { cell: SudokuCellState; onTap: () => void }) {
  const bg = cell.highlights.has('conflict')   ? 'var(--conflict)'  :
             cell.highlights.has('selected')   ? 'var(--selected)'  :
             cell.highlights.has('sameValue')  ? 'var(--same-val)'  :
             cell.highlights.has('related')    ? 'var(--related)'   :
             'transparent';

  return (
    <div
      className="flex items-center justify-center cursor-pointer relative"
      style={{ background: bg }}
      onClick={onTap}
    >
      {cell.value != null ? (
        <span
          className="text-[min(5vw,22px)] font-thin leading-none select-none"
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: cell.isGiven ? 500 : 300,
            color: cell.isGiven ? 'var(--given-text)' : 'var(--user-text)',
          }}
        >
          {cell.value}
        </span>
      ) : cell.notes.size > 0 ? (
        <NotesGrid notes={cell.notes} />
      ) : null}
    </div>
  );
}

function NotesGrid({ notes }: { notes: Set<number> }) {
  return (
    <div className="absolute inset-0 grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)' }}>
      {[1,2,3,4,5,6,7,8,9].map(v => (
        <div
          key={v}
          className="flex items-center justify-center text-[min(1.5vw,7px)] leading-none"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--note-text)',
          }}
        >
          {notes.has(v) ? v : ''}
        </div>
      ))}
    </div>
  );
}
