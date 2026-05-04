'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { BoardData, CellCoordinate, CellHighlight, Difficulty, SudokuCellState } from '@/lib/types';
import { boxIndex, coordId } from '@/lib/types';
import { loadScore, saveHintStock, saveScore } from '@/lib/scoreStore';
import { makeBoardData } from '@/lib/boardData';

export interface GameState {
  cells: SudokuCellState[];
  boardRows: SudokuCellState[][];
  mistakes: number;
  maxMistakes: number;
  heartsRemaining: number;
  selectedCoord: CellCoordinate | null;
  isNoteMode: boolean;
  elapsedSeconds: number;
  timerDisplayText: string;
  formattedTime: string;
  isGameOver: boolean;
  isGameWon: boolean;
  completedNumbers: Set<number>;
  selectedValue: number | null;
  difficulty: Difficulty;
  score: number;
  hintStock: number;
  // actions
  select: (coord: CellCoordinate) => void;
  deselect: () => void;
  setNoteMode: (v: boolean) => void;
  input: (n: number) => void;
  erase: () => void;
  hint: () => boolean;
  restart: () => void;
  startNewGame: (diff: Difficulty, data?: BoardData) => void;
  addScore: (pts: number) => void;
  consumeHint: () => boolean;
  purchaseItem: (id: string, price: number) => boolean;
  addExtraHeart: () => void;
}

export function useSudokuGame(initialDifficulty: Difficulty = 'medium'): GameState {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [initialBoard, setInitialBoard] = useState<(number | null)[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [board, setBoard] = useState<(number | null)[][]>([]);
  const [givens, setGivens] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Map<string, Set<number>>>(new Map());
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [maxMistakes, setMaxMistakes] = useState(3);
  const [selectedCoord, setSelectedCoord] = useState<CellCoordinate | null>(null);
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [score, setScoreState] = useState(0);
  const [hintStock, setHintStockState] = useState(5);
  const didAwardScore = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameWonRef = useRef(false);
  const gameOverRef = useRef(false);

  // Load persisted score on mount
  useEffect(() => {
    const s = loadScore();
    setScoreState(s.score);
    setHintStockState(s.hintStock);
  }, []);

  const loadGame = useCallback((diff: Difficulty, data: BoardData) => {
    const b = data.given.map(r => [...r]);
    const g = new Set<string>();
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++)
      if (data.given[r][c] != null) g.add(`${r}-${c}`);
    setDifficulty(diff);
    setInitialBoard(data.given.map(r => [...r]));
    setSolution(data.solution.map(r => [...r]));
    setBoard(b);
    setGivens(g);
    setNotes(new Map());
    setConflicts(new Set());
    setMistakes(0);
    setMaxMistakes(3);
    setSelectedCoord(null);
    setIsNoteMode(false);
    setElapsedSeconds(0);
    didAwardScore.current = false;
    gameWonRef.current = false;
    gameOverRef.current = false;
  }, []);

  // Init
  useEffect(() => {
    loadGame(initialDifficulty, makeBoardData(initialDifficulty));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(s => {
        if (gameWonRef.current || gameOverRef.current) return s;
        return s + 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [board]); // restart timer when board resets

  const buildCells = useCallback((
    b: (number | null)[][],
    g: Set<string>,
    n: Map<string, Set<number>>,
    cf: Set<string>,
    sel: CellCoordinate | null,
  ): SudokuCellState[] => {
    if (b.length === 0) return [];
    const selVal = sel ? b[sel.row][sel.col] : null;
    const cells: SudokuCellState[] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const coord: CellCoordinate = { row: r, col: c };
        const id = coordId(coord);
        const highlights = new Set<CellHighlight>();
        if (sel) {
          const sId = coordId(sel);
          if (id === sId) highlights.add('selected');
          else if (r === sel.row || c === sel.col || boxIndex(coord) === boxIndex(sel))
            highlights.add('related');
          if (selVal != null && b[r][c] === selVal && id !== sId)
            highlights.add('sameValue');
        }
        if (cf.has(id)) highlights.add('conflict');
        cells.push({
          coordinate: coord,
          value: b[r][c],
          notes: n.get(id) ?? new Set(),
          isGiven: g.has(id),
          highlights,
        });
      }
    }
    return cells;
  }, []);

  const cells = buildCells(board, givens, notes, conflicts, selectedCoord);
  const boardRows: SudokuCellState[][] = Array.from({ length: 9 }, (_, i) =>
    cells.slice(i * 9, i * 9 + 9)
  );

  const isGameOver = maxMistakes > 0 && mistakes >= maxMistakes;
  const isGameWon  = cells.length > 0 && cells.every(c => c.value != null) && conflicts.size === 0;
  gameWonRef.current  = isGameWon;
  gameOverRef.current = isGameOver;

  const completedNumbers = new Set<number>(
    [1,2,3,4,5,6,7,8,9].filter(n =>
      cells.filter(c => c.value === n).length >= 9
    )
  );

  const formattedTime = `${String(Math.floor(elapsedSeconds / 60)).padStart(2,'0')}:${String(elapsedSeconds % 60).padStart(2,'0')}`;
  const timerDisplayText = elapsedSeconds === 0 ? `Start! ${formattedTime}` : formattedTime;

  const selectedValue = selectedCoord
    ? board[selectedCoord.row]?.[selectedCoord.col] ?? null
    : null;

  // ─── Actions ─────────────────────────────────────────────────────────────
  const select = (coord: CellCoordinate) => setSelectedCoord(coord);
  const deselect = () => setSelectedCoord(null);

  const input = (n: number) => {
    if (!selectedCoord) return;
    const id = coordId(selectedCoord);
    if (givens.has(id)) return;

    if (isNoteMode) {
      setNotes(prev => {
        const next = new Map(prev);
        const cur = new Set(next.get(id) ?? []);
        cur.has(n) ? cur.delete(n) : cur.add(n);
        next.set(id, cur);
        return next;
      });
      return;
    }

    const { row, col } = selectedCoord;
    setNotes(prev => {
      const next = new Map(prev);
      next.set(id, new Set());
      // Remove this number from related cells' notes
      for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
        const coord2: CellCoordinate = { row: r, col: c };
        const id2 = coordId(coord2);
        if (id2 === id) continue;
        if (r === row || c === col || boxIndex(coord2) === boxIndex(selectedCoord)) {
          const cur = new Set(next.get(id2) ?? []);
          cur.delete(n);
          next.set(id2, cur);
        }
      }
      return next;
    });

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = n;
    setBoard(newBoard);

    if (solution[row][col] !== n) {
      setMistakes(m => m + 1);
      setConflicts(prev => new Set([...prev, id]));
    } else {
      setConflicts(prev => { const next = new Set(prev); next.delete(id); return next; });
    }
  };

  const erase = () => {
    if (!selectedCoord) return;
    const id = coordId(selectedCoord);
    if (givens.has(id)) return;
    const { row, col } = selectedCoord;
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = null;
    setBoard(newBoard);
    setNotes(prev => { const next = new Map(prev); next.set(id, new Set()); return next; });
    setConflicts(prev => { const next = new Set(prev); next.delete(id); return next; });
  };

  const computeCandidates = (coord: CellCoordinate): Set<number> => {
    const used = new Set<number>();
    for (let c = 0; c < 9; c++) { const v = board[coord.row][c]; if (v) used.add(v); }
    for (let r = 0; r < 9; r++) { const v = board[r][coord.col]; if (v) used.add(v); }
    const br = Math.floor(coord.row / 3) * 3, bc = Math.floor(coord.col / 3) * 3;
    for (let r = br; r < br + 3; r++) for (let c = bc; c < bc + 3; c++) {
      const v = board[r][c]; if (v) used.add(v);
    }
    return new Set([1,2,3,4,5,6,7,8,9].filter(n => !used.has(n)));
  };

  const hint = (): boolean => {
    if (!selectedCoord) return false;
    const id = coordId(selectedCoord);
    if (givens.has(id)) return false;
    if (board[selectedCoord.row][selectedCoord.col] != null) return false;
    const candidates = computeCandidates(selectedCoord);
    if (candidates.size === 0) return false;
    const currentNotes = notes.get(id) ?? new Set<number>();

    if (candidates.size === 1 && setsEqual(currentNotes, candidates)) {
      const v = [...candidates][0];
      input(v);
    } else {
      setNotes(prev => {
        const next = new Map(prev);
        const noteSet = new Set(next.get(id) ?? []);
        for (let v = 1; v <= 9; v++) {
          const isCandidate = candidates.has(v);
          const isNote = noteSet.has(v);
          if (isCandidate && !isNote) noteSet.add(v);
          if (!isCandidate && isNote) noteSet.delete(v);
        }
        next.set(id, noteSet);
        return next;
      });
    }
    return true;
  };

  const restart = () => loadGame(difficulty, { given: initialBoard, solution });

  const startNewGame = (diff: Difficulty, data?: BoardData) => {
    loadGame(diff, data ?? makeBoardData(diff));
  };

  const addScore = (pts: number) => {
    setScoreState(s => { const next = s + pts; saveScore(next); return next; });
  };

  const consumeHint = (): boolean => {
    if (hintStock <= 0) return false;
    setHintStockState(h => { const next = h - 1; saveHintStock(next); return next; });
    return true;
  };

  const purchaseItem = (id: string, price: number): boolean => {
    if (score < price) return false;
    setScoreState(s => { const next = s - price; saveScore(next); return next; });
    if (id === 'hints_5')  setHintStockState(h => { const next = h + 5;  saveHintStock(next); return next; });
    if (id === 'hints_10') setHintStockState(h => { const next = h + 10; saveHintStock(next); return next; });
    return true;
  };

  const addExtraHeart = () => setMaxMistakes(m => m + 1);

  return {
    cells, boardRows, mistakes, maxMistakes,
    heartsRemaining: Math.max(0, maxMistakes - mistakes),
    selectedCoord, isNoteMode, elapsedSeconds, timerDisplayText, formattedTime,
    isGameOver, isGameWon, completedNumbers, selectedValue, difficulty,
    score, hintStock,
    select, deselect, setNoteMode: setIsNoteMode, input, erase, hint, restart,
    startNewGame, addScore, consumeHint, purchaseItem, addExtraHeart,
  };
}

function setsEqual(a: Set<number>, b: Set<number>): boolean {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}
