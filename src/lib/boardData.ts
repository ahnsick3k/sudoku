import type { BoardData, Difficulty } from './types';

// ─── Fallback built-in puzzles ────────────────────────────────────────────────
const SHARED_SOLUTION: number[][] = [
  [5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9],
];
const N = null;
const FALLBACKS: Record<Difficulty, (number | null)[][]> = {
  baby: [
    [5,3,4,6,7,8,N,1,2],[6,7,2,1,N,5,3,4,8],[1,N,8,3,4,2,5,6,7],
    [8,5,9,N,6,1,4,2,3],[4,2,N,8,5,3,7,9,1],[7,1,3,9,2,N,8,5,6],
    [9,6,1,5,N,7,2,8,4],[2,8,7,4,1,9,N,3,5],[3,4,5,2,8,6,1,N,9],
  ],
  easy: [
    [5,3,4,N,7,8,N,1,2],[6,N,2,1,9,N,3,4,8],[N,9,8,3,N,2,5,N,7],
    [8,5,N,7,6,1,N,2,3],[4,N,6,8,5,N,7,9,1],[7,1,N,9,2,4,N,5,6],
    [9,6,1,N,3,7,2,N,4],[2,N,7,4,1,9,N,3,5],[3,4,5,N,8,6,1,N,9],
  ],
  medium: [
    [5,3,N,N,7,N,N,N,N],[6,N,N,1,9,5,N,N,N],[N,9,8,N,N,N,N,6,N],
    [8,N,N,N,6,N,N,N,3],[4,N,N,8,N,3,N,N,1],[7,N,N,N,2,N,N,N,6],
    [N,6,N,N,N,N,2,8,N],[N,N,N,4,1,9,N,N,5],[N,N,N,N,8,N,N,7,9],
  ],
  hard: [
    [5,N,N,N,N,8,N,N,N],[N,7,N,1,N,N,N,N,8],[N,N,8,N,N,N,N,6,N],
    [N,N,N,7,N,N,N,N,3],[N,N,6,N,N,3,N,N,N],[7,N,N,N,2,N,N,N,N],
    [N,6,N,N,N,N,2,N,N],[N,N,N,4,N,9,N,N,N],[N,N,N,N,8,N,N,7,N],
  ],
  master: [
    [N,N,N,N,7,N,N,N,N],[N,7,N,N,N,N,N,N,N],[N,N,8,N,N,N,N,N,N],
    [N,N,N,7,N,N,N,N,N],[N,N,N,N,N,3,N,N,N],[N,N,N,N,N,N,8,N,N],
    [N,N,N,N,N,N,N,8,N],[N,N,N,4,N,N,N,N,N],[N,N,N,N,8,N,N,N,9],
  ],
  grandmaster: [
    [5,N,N,N,N,N,N,N,N],[N,N,N,N,N,N,N,N,N],[N,N,8,N,N,N,N,N,N],
    [N,N,N,N,N,N,N,N,N],[N,N,N,N,5,N,N,N,N],[N,N,N,N,N,N,N,N,N],
    [N,N,N,N,N,N,2,N,N],[N,N,N,N,N,N,N,N,N],[N,N,N,N,N,N,N,7,9],
  ],
};

// ─── Bundled puzzle cache ─────────────────────────────────────────────────────
let cache: Partial<Record<Difficulty, BoardData[]>> = {};

export async function loadPuzzles(): Promise<void> {
  if (Object.keys(cache).length > 0) return;
  try {
    const res = await fetch('/puzzles/sudoku_puzzles_100_each.json');
    const file: { difficulties: Record<string, { givens: number[]; solution: number[] }[]> }
      = await res.json();
    const map: Partial<Record<Difficulty, BoardData[]>> = {};
    for (const [key, entries] of Object.entries(file.difficulties)) {
      const d = key as Difficulty;
      const boards: BoardData[] = entries
        .filter(e => e.givens.length === 81 && e.solution.length === 81)
        .map(e => ({
          given:    chunk9(e.givens).map(row => row.map(v => (v === 0 ? null : v))),
          solution: chunk9(e.solution) as number[][],
        }));
      if (boards.length) map[d] = boards;
    }
    cache = map;
  } catch { /* fallback only */ }
}

export function makeBoardData(difficulty: Difficulty): BoardData {
  const pool = cache[difficulty];
  if (pool?.length) return pool[Math.floor(Math.random() * pool.length)];
  return { given: FALLBACKS[difficulty], solution: SHARED_SOLUTION };
}

function chunk9<T>(arr: T[]): T[][] {
  return Array.from({ length: 9 }, (_, i) => arr.slice(i * 9, i * 9 + 9));
}
