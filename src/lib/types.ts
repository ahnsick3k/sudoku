export type Difficulty =
  | 'baby' | 'easy' | 'medium' | 'hard' | 'master' | 'grandmaster';

export const DIFFICULTIES: Difficulty[] = [
  'baby', 'easy', 'medium', 'hard', 'master', 'grandmaster',
];

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  baby:        'Baby',
  easy:        'Easy',
  medium:      'Normal',
  hard:        'Hard',
  master:      'Master',
  grandmaster: 'Doctor',
};

export const DIFFICULTY_SCORE: Record<Difficulty, number> = {
  baby:         500,
  easy:       1_000,
  medium:     1_500,
  hard:       2_000,
  master:     3_000,
  grandmaster:4_000,
};

export interface CellCoordinate {
  row: number;
  col: number;
}

export function coordId(c: CellCoordinate) { return `${c.row}-${c.col}`; }
export function boxIndex(c: CellCoordinate) { return Math.floor(c.row / 3) * 3 + Math.floor(c.col / 3); }

export type CellHighlight = 'selected' | 'related' | 'sameValue' | 'conflict';

export interface SudokuCellState {
  coordinate: CellCoordinate;
  value: number | null;
  notes: Set<number>;
  isGiven: boolean;
  highlights: Set<CellHighlight>;
}

export interface BoardData {
  given: (number | null)[][];
  solution: number[][];
}
