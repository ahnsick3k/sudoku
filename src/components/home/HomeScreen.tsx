'use client';
import { useRef, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import type { Difficulty } from '@/lib/types';
import { DIFFICULTIES, DIFFICULTY_LABEL } from '@/lib/types';
import type { BoardData } from '@/lib/types';
import { makeBoardData } from '@/lib/boardData';
import BoardPreview from './BoardPreview';

interface Props {
  onStart: (difficulty: Difficulty, boardData: BoardData) => void;
  isDarkMode: boolean;
  onToggleDark: () => void;
}

export default function HomeScreen({ onStart, isDarkMode, onToggleDark }: Props) {
  const [selected, setSelected] = useState<Difficulty>('medium');
  const [boardData, setBoardData] = useState<BoardData>(() => makeBoardData('medium'));

  const handleSelect = (d: Difficulty) => {
    setSelected(d);
    setBoardData(makeBoardData(d));
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen px-5 pt-9"
      style={{ background: 'var(--bg)' }}
    >
      {/* Title */}
      <p className="tracking-[5px] text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
        BEAUTIFUL
      </p>
      <h1 className="text-[34px] font-thin tracking-[4px] mt-0.5" style={{ color: 'var(--given-text)', fontFamily: 'var(--font-mono)' }}>
        SUDOKU
      </h1>

      {/* Board preview */}
      <div className="mt-6 w-full max-w-xs" style={{ filter: 'blur(3px)' }}>
        <BoardPreview given={boardData.given} solution={boardData.solution} />
      </div>

      {/* Drum picker */}
      <div className="mt-6 w-full max-w-xs">
        <DrumPicker selected={selected} onSelect={handleSelect} />
      </div>

      {/* Start button */}
      <button
        className="mt-4 w-full max-w-xs h-14 rounded text-[17px] font-light transition-opacity active:opacity-70"
        style={{ background: 'var(--accent)', color: 'var(--accent-label)' }}
        onClick={() => onStart(selected, boardData)}
      >
        시작하기
      </button>

      {/* Dark mode toggle */}
      <button
        className="mt-4 flex items-center gap-1.5 min-h-[44px] px-3 text-[11px] tracking-widest transition-opacity active:opacity-50"
        style={{ color: 'var(--muted)' }}
        onClick={onToggleDark}
      >
        {isDarkMode
          ? <><SunIcon className="w-4 h-4" /> LIGHT MODE</>
          : <><MoonIcon className="w-4 h-4" /> DARK MODE</>}
      </button>
    </div>
  );
}

// ─── Drum Picker ─────────────────────────────────────────────────────────────
function DrumPicker({
  selected,
  onSelect,
}: {
  selected: Difficulty;
  onSelect: (d: Difficulty) => void;
}) {
  const ROW_H = 60;
  const VISIBLE = 3;
  const startY = useRef<number | null>(null);
  const startIdx = useRef(0);

  const selectedIdx = DIFFICULTIES.indexOf(selected);

  const handlePointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY;
    startIdx.current = selectedIdx;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startY.current == null) return;
    const delta = startY.current - e.clientY;
    const snap = Math.round(delta / ROW_H);
    const newIdx = Math.max(0, Math.min(DIFFICULTIES.length - 1, startIdx.current + snap));
    if (DIFFICULTIES[newIdx] !== selected) onSelect(DIFFICULTIES[newIdx]);
  };

  const handlePointerUp = () => { startY.current = null; };

  return (
    <div
      className="relative overflow-hidden rounded-lg cursor-ns-resize"
      style={{ height: ROW_H * VISIBLE, touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Selection highlight */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: ROW_H,
          height: ROW_H,
          background: 'var(--accent-soft)',
          borderRadius: 4,
        }}
      />
      {DIFFICULTIES.map((d, i) => {
        const offset = (i - selectedIdx + 1) * ROW_H;
        const isSelected = d === selected;
        return (
          <div
            key={d}
            className="absolute left-0 right-0 flex items-center justify-center transition-transform duration-150"
            style={{
              height: ROW_H,
              top: offset,
              color: isSelected ? 'var(--accent)' : 'var(--muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 20,
              fontWeight: 300,
              letterSpacing: 2,
            }}
          >
            {DIFFICULTY_LABEL[d]}
          </div>
        );
      })}
    </div>
  );
}
