'use client';
import { useState, useEffect } from 'react';
import { LightBulbIcon, BackspaceIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import TopBar from './TopBar';
import StatusBar from './StatusBar';
import SudokuBoard from './SudokuBoard';
import NumberPad from './NumberPad';
import MenuSheet from '@/components/menu/MenuSheet';
import ShopSheet from '@/components/shop/ShopSheet';
import type { GameState } from '@/hooks/useSudokuGame';
import { makeBoardData } from '@/lib/boardData';
import type { Difficulty } from '@/lib/types';

interface Props {
  game: GameState;
  isDarkMode: boolean;
  onToggleDark: () => void;
  onBack: () => void;
}

export default function GameScreen({ game, isDarkMode, onToggleDark, onBack }: Props) {
  const [showPad, setShowPad] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [awardDone, setAwardDone] = useState(false);

  // Reset pad when new game loads
  useEffect(() => { setShowPad(false); setShowWin(false); setShowGameOver(false); setAwardDone(false); }, [game.difficulty]);

  useEffect(() => {
    if (game.isGameWon && !showWin && !awardDone) {
      setAwardDone(true);
      game.addScore(game.difficulty === 'baby' ? 500 : game.difficulty === 'easy' ? 1000 : game.difficulty === 'medium' ? 1500 : game.difficulty === 'hard' ? 2000 : game.difficulty === 'master' ? 3000 : 4000);
      setShowPad(false);
      setShowWin(true);
    }
  }, [game.isGameWon]);

  useEffect(() => {
    if (game.isGameOver && !showGameOver) {
      setShowPad(false);
      setShowGameOver(true);
    }
  }, [game.isGameOver]);

  // Keyboard input when pad is open
  useEffect(() => {
    if (!showPad) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') { game.input(Number(e.key)); return; }
      if (e.key === 'Backspace' || e.key === 'Delete') { game.erase(); return; }
      if (e.key === 'Escape') { setShowPad(false); game.deselect(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showPad, game]);

  const handleCellTap = (coord: import('@/lib/types').CellCoordinate) => {
    const sameCell = game.selectedCoord?.row === coord.row && game.selectedCoord?.col === coord.col;
    if (sameCell) {
      if (showPad) { setShowPad(false); game.deselect(); }
      else { setShowPad(true); }
    } else {
      game.select(coord);
      setShowPad(true);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen items-center"
      style={{ background: 'var(--bg)' }}
      onClick={(e) => {
        // tap background → close pad
        if ((e.target as HTMLElement).closest('.board-area, .pad-area')) return;
        setShowPad(false);
        game.deselect();
      }}
    >
      <div
        className="board-area flex flex-col w-full px-4 pt-3.5 gap-2"
        style={{
          maxWidth: 520,
          paddingBottom: showPad ? 420 : 24,
          transition: 'padding-bottom 0.22s ease-out',
        }}
      >
        <TopBar onMenu={() => setShowMenu(true)} onShop={() => setShowShop(true)} />
        <SudokuBoard rows={game.boardRows} onTapCell={handleCellTap} />
        <StatusBar
          timerText={game.timerDisplayText}
          maxMistakes={game.maxMistakes}
          heartsRemaining={game.heartsRemaining}
        />
      </div>

      {/* Number Pad panel */}
      <div
        className="pad-area fixed bottom-0 left-0 right-0 z-30 transition-transform duration-[220ms] ease-out"
        style={{
          transform: showPad ? 'translateY(0)' : 'translateY(100%)',
          background: 'var(--surface)',
          boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Dock */}
        <div className="flex items-center gap-2 px-4 pt-2.5 pb-4">
          {/* Entry / Notes toggle */}
          <div
            className="flex rounded-full p-[3px]"
            style={{ background: 'rgba(0,0,0,0.07)' }}
          >
            <PillSeg label="Entry" active={!game.isNoteMode} onClick={() => game.setNoteMode(false)} />
            <PillSeg label="Notes" active={game.isNoteMode}  onClick={() => game.setNoteMode(true)} />
          </div>

          <div className="flex-1" />

          {/* Hint */}
          <button
            className="relative w-10 h-10 flex items-center justify-center rounded-full transition-opacity active:opacity-50"
            style={{ color: game.hintStock > 0 ? 'var(--given-text)' : 'var(--muted)' }}
            onClick={() => { if (game.consumeHint()) game.hint(); }}
          >
            <LightBulbIcon className="w-6 h-6" />
            <span
              className="absolute -top-1 -right-1 text-[10px] rounded-full px-[5px] py-[1px] leading-none font-semibold"
              style={{ background: game.hintStock > 0 ? '#e53e3e' : '#888', color: '#fff', fontFamily: 'var(--font-mono)' }}
            >
              {game.hintStock}
            </span>
          </button>

          {/* Erase */}
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full transition-opacity active:opacity-50"
            style={{ color: 'var(--given-text)' }}
            onClick={game.erase}
          >
            <BackspaceIcon className="w-6 h-6" />
          </button>

          {/* Close pad */}
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full transition-opacity active:opacity-50"
            style={{ color: 'var(--given-text)' }}
            onClick={() => { setShowPad(false); game.deselect(); }}
          >
            <ChevronDownIcon className="w-6 h-6" />
          </button>
        </div>

        <NumberPad
          selectedValue={game.selectedValue}
          completedNumbers={game.completedNumbers}
          onTap={game.input}
        />
        <div className="h-4" />
      </div>

      {/* Win overlay */}
      {showWin && (
        <Overlay>
          <span className="text-5xl">✓</span>
          <h2 className="text-[32px] font-extralight text-white">Game Clear!</h2>
          <p className="text-yellow-300 text-lg font-light">+{(game.difficulty === 'grandmaster' ? 4000 : game.difficulty === 'master' ? 3000 : game.difficulty === 'hard' ? 2000 : game.difficulty === 'medium' ? 1500 : game.difficulty === 'easy' ? 1000 : 500).toLocaleString()}점 획득</p>
          <p className="text-white/60 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>누적 {game.score.toLocaleString()}점</p>
          <div className="flex gap-3 mt-2">
            <OverlayBtn label="홈으로" bg="rgba(255,255,255,0.15)" onClick={onBack} />
            <OverlayBtn label="다시 하기" bg="var(--accent)" onClick={() => { setShowWin(false); setAwardDone(false); game.restart(); }} />
          </div>
        </Overlay>
      )}

      {/* Game Over overlay */}
      {showGameOver && (
        <Overlay>
          <span className="text-5xl">💔</span>
          <h2 className="text-[32px] font-extralight text-white" style={{ fontFamily: 'var(--font-mono)' }}>실패</h2>
          <p className="text-white/60 font-light">하트를 모두 잃었어요</p>
          <div className="flex gap-3 mt-2">
            <OverlayBtn label="홈으로" bg="rgba(255,255,255,0.15)" onClick={onBack} />
            <OverlayBtn label="다시 하기" bg="rgba(229,62,62,0.75)" onClick={() => { setShowGameOver(false); game.restart(); }} />
          </div>
        </Overlay>
      )}

      {/* Menu */}
      {showMenu && (
        <MenuSheet
          selectedDifficulty={game.difficulty}
          isDarkMode={isDarkMode}
          onToggleDark={onToggleDark}
          onNewGame={() => { setShowMenu(false); onBack(); }}
          onRestart={() => { setShowMenu(false); setShowWin(false); setShowGameOver(false); setAwardDone(false); game.restart(); }}
          onSelectDifficulty={(d: Difficulty) => {
            setShowMenu(false); setShowWin(false); setShowGameOver(false); setAwardDone(false); setShowPad(false);
            game.startNewGame(d, makeBoardData(d));
          }}
          onClose={() => setShowMenu(false)}
        />
      )}

      {/* Shop */}
      {showShop && (
        <ShopSheet
          score={game.score}
          hintStock={game.hintStock}
          onPurchase={game.purchaseItem}
          onAddHeart={game.addExtraHeart}
          onClose={() => setShowShop(false)}
        />
      )}
    </div>
  );
}

function PillSeg({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-4 py-2 text-[11px] transition-colors"
      style={{
        fontFamily: 'var(--font-mono)',
        background: active ? 'var(--accent)' : 'transparent',
        color: active ? 'var(--accent-label)' : 'var(--muted)',
      }}
    >
      {label}
    </button>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center flex-col gap-4 px-9" style={{ background: 'rgba(0,0,0,0.65)' }}>
      {children}
    </div>
  );
}

function OverlayBtn({ label, bg, onClick }: { label: string; bg: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-[120px] h-12 rounded font-light text-white transition-opacity active:opacity-70"
      style={{ background: bg, fontFamily: 'var(--font-mono)', fontSize: 15 }}
    >
      {label}
    </button>
  );
}
