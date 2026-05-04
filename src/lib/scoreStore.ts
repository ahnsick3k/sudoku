export interface ScoreState {
  score: number;
  hintStock: number;
}

const SCORE_KEY = 'sudoku.score';
const HINTS_KEY = 'sudoku.hintStock';

export function loadScore(): ScoreState {
  if (typeof window === 'undefined') return { score: 0, hintStock: 5 };
  return {
    score:     parseInt(localStorage.getItem(SCORE_KEY)  ?? '0',  10),
    hintStock: parseInt(localStorage.getItem(HINTS_KEY) ?? '5', 10),
  };
}

export function saveScore(score: number) {
  localStorage.setItem(SCORE_KEY, String(score));
}

export function saveHintStock(n: number) {
  localStorage.setItem(HINTS_KEY, String(n));
}
