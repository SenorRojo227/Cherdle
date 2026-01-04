export type ColorCode = "G" | "O" | "Y" | "X" | "";

export type PieceId =
  | "Pawn_W" | "Knight_W" | "Bishop_W" | "Rook_W" | "Queen_W" | "King_W"
  | "Pawn_B" | "Knight_B" | "Bishop_B" | "Rook_B" | "Queen_B" | "King_B";

export type Cell = PieceId | null;
export type Grid4 = Cell[][];
export type FeedbackGrid4 = ColorCode[][];

export type Puzzle = {
  id: number;
  answer: Grid4;
};

export const GRID_SIZE = 4;
export const MAX_GUESSES = 6;

export function emptyGrid(): Grid4 {
  return Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => null));
}
export function emptyFeedback(): FeedbackGrid4 {
  return Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => ""));
}
