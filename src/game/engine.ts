import { type FeedbackGrid4, type Grid4, GRID_SIZE, type PieceId, emptyFeedback } from "./types";

function isSamePiece(a: PieceId, b: PieceId) {
  return a === b;
}

export function evaluateGuess(guess: Grid4, answer: Grid4): FeedbackGrid4 {
  const fb = emptyFeedback();

  const answerPositions = new Map<PieceId, { x: number; y: number }[]>();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const p = answer[y][x];
      if (!p) continue;
      const arr = answerPositions.get(p) ?? [];
      arr.push({ x, y });
      answerPositions.set(p, arr);
    }
  }

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const g = guess[y][x];
      if (!g) continue;

      const a = answer[y][x];
      if (a && isSamePiece(g, a)) {
        fb[y][x] = "G";
        continue;
      }

      const targets = answerPositions.get(g);
      if (!targets || targets.length === 0) {
        fb[y][x] = "X";
        continue;
      }

      const adjacent = targets.some(t => Math.max(Math.abs(t.x - x), Math.abs(t.y - y)) === 1);
      fb[y][x] = adjacent ? "O" : "Y";
    }
  }

  return fb;
}

export function countPlacedPieces(grid: Grid4) {
  let n = 0;
  for (let y = 0; y < GRID_SIZE; y++)
    for (let x = 0; x < GRID_SIZE; x++)
      if (grid[y][x]) n++;
  return n;
}

export function hasNoDuplicatePieces(grid: Grid4) {
  const seen = new Set<PieceId>();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const p = grid[y][x];
      if (!p) continue;
      if (seen.has(p)) return false;
      seen.add(p);
    }
  }
  return true;
}
