'use client';
import { useState, useEffect } from 'react';
import { loadPuzzles } from '@/lib/boardData';
import { useSudokuGame } from '@/hooks/useSudokuGame';
import HomeScreen from '@/components/home/HomeScreen';
import GameScreen from '@/components/game/GameScreen';
import type { BoardData, Difficulty } from '@/lib/types';

type Screen = 'home' | 'game';

export default function SudokuApp() {
  const [screen, setScreen] = useState<Screen>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const game = useSudokuGame();

  useEffect(() => { loadPuzzles(); }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleStart = (difficulty: Difficulty, boardData: BoardData) => {
    game.startNewGame(difficulty, boardData);
    setScreen('game');
  };

  if (screen === 'game') {
    return (
      <GameScreen
        game={game}
        isDarkMode={isDarkMode}
        onToggleDark={() => setIsDarkMode(d => !d)}
        onBack={() => setScreen('home')}
      />
    );
  }

  return (
    <HomeScreen
      onStart={handleStart}
      isDarkMode={isDarkMode}
      onToggleDark={() => setIsDarkMode(d => !d)}
    />
  );
}
