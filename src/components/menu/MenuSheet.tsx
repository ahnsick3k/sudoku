'use client';
import { useEffect, useRef } from 'react';
import {
  SunIcon, MoonIcon,
  PlusCircleIcon, ArrowPathIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline';
import type { Difficulty } from '@/lib/types';
import { DIFFICULTIES, DIFFICULTY_LABEL, DIFFICULTY_SCORE } from '@/lib/types';
import type { BoardData } from '@/lib/types';
import { makeBoardData } from '@/lib/boardData';

interface Props {
  selectedDifficulty: Difficulty;
  isDarkMode: boolean;
  onToggleDark: () => void;
  onNewGame: () => void;
  onRestart: () => void;
  onSelectDifficulty: (d: Difficulty) => void;
  onClose: () => void;
}

export default function MenuSheet({
  selectedDifficulty, isDarkMode, onToggleDark,
  onNewGame, onRestart, onSelectDifficulty, onClose,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div
        ref={ref}
        className="w-full max-w-lg rounded-t-2xl p-5 pb-10"
        style={{ background: 'var(--surface)', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <div className="w-10 h-1 rounded mx-auto mb-4" style={{ background: 'var(--muted)' }} />

        <h2 className="text-[20px] font-thin tracking-widest mb-4" style={{ color: 'var(--given-text)', fontFamily: 'var(--font-mono)' }}>
          메뉴
        </h2>

        <MenuRow icon={<PlusCircleIcon className="w-5 h-5" />} label="새 게임" onClick={onNewGame} />
        <MenuRow icon={<ArrowPathIcon className="w-5 h-5" />} label="다시 시작" onClick={onRestart} />

        <div className="my-3 border-t" style={{ borderColor: 'var(--thin-grid)' }} />

        <p className="text-[11px] tracking-widest mb-2" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          난이도
        </p>

        {DIFFICULTIES.map(d => (
          <button
            key={d}
            onClick={() => onSelectDifficulty(d)}
            className="flex items-center justify-between w-full px-3 py-3.5 rounded text-left transition-colors"
            style={{
              background: d === selectedDifficulty ? 'var(--accent-soft)' : 'transparent',
              color: d === selectedDifficulty ? 'var(--accent)' : 'var(--given-text)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, fontSize: 17 }}>
              {DIFFICULTY_LABEL[d]}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>
              {DIFFICULTY_SCORE[d].toLocaleString()}점
            </span>
          </button>
        ))}

        <div className="my-3 border-t" style={{ borderColor: 'var(--thin-grid)' }} />

        <button
          onClick={onToggleDark}
          className="flex items-center justify-between w-full px-3 py-3.5 rounded min-h-[44px]"
          style={{ color: 'var(--given-text)' }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, fontSize: 17 }}>
            {isDarkMode ? '라이트 모드' : '다크 모드'}
          </span>
          {isDarkMode
            ? <SunIcon className="w-5 h-5" style={{ color: 'var(--muted)' }} />
            : <MoonIcon className="w-5 h-5" style={{ color: 'var(--muted)' }} />}
        </button>
      </div>
    </div>
  );
}

function MenuRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-3 py-3.5 rounded text-left transition-opacity active:opacity-60 min-h-[44px]"
      style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, fontSize: 17, color: 'var(--given-text)' }}
    >
      <span style={{ color: 'var(--muted)' }}>{icon}</span>
      {label}
    </button>
  );
}
