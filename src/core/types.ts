/**
 * TicTacToe Plugin - Type Definitions
 */

export type Cell = "." | "X" | "O";
export type Side = "X" | "O";
export type TicTacToeBoard = Cell[][]; // 3x3

export type PlayerType = "user" | "computer";

export interface TicTacToeArgs {
  action: "new_game" | "move";
  col?: number;
  row?: number;
  board?: Cell[][];
  currentSide?: Side;
  playerNames?: { X: PlayerType; O: PlayerType };
  firstPlayer?: PlayerType;
}

export type NewGameCommand = {
  action: "new_game";
  playerNames: { X: string; O: string };
};

export type MoveCommand = {
  action: "move";
  row: number;
  col: number;
  board: TicTacToeBoard;
  currentSide: Side;
  playerNames: { X: string; O: string };
};

export type Command = NewGameCommand | MoveCommand;

export interface TicTacToeState {
  board: TicTacToeBoard;
  currentSide: Side; // whose turn NEXT
  playerNames: { X: string; O: string };
  legalMoves: { row: number; col: number }[];
  counts: { X: number; O: number; empty: number };
  isTerminal: boolean;
  winner: Side | "draw" | null; // null until terminal
  winningLine: { row: number; col: number }[] | null; // cells that form winning line
  lastAction:
    | { type: "new_game" }
    | { type: "move"; row: number; col: number };
  error?: string;
}

/**
 * Data passed from handleCellClick for testing/debugging
 */
export interface TicTacToeClickData {
  row: number;
  col: number;
  currentState: TicTacToeState;
}
