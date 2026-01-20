/**
 * TicTacToe Plugin - Game Logic
 */

import type {
  Cell,
  Side,
  TicTacToeBoard,
  Command,
  TicTacToeState,
} from "./types";

// All possible winning lines (rows, columns, diagonals)
const WINNING_LINES: { row: number; col: number }[][] = [
  // Rows
  [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
  [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
  [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
  // Columns
  [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
  [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
  [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
  // Diagonals
  [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }],
  [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }],
];

function createEmptyBoard(): TicTacToeBoard {
  const board: TicTacToeBoard = [];
  for (let i = 0; i < 3; i++) {
    board[i] = new Array(3).fill(".") as Cell[];
  }
  return board;
}

function copyBoard(board: TicTacToeBoard): TicTacToeBoard {
  return board.map((row) => [...row]);
}

function getOpponent(side: Side): Side {
  return side === "X" ? "O" : "X";
}

function getLegalMoves(
  board: TicTacToeBoard,
): { row: number; col: number }[] {
  const moves: { row: number; col: number }[] = [];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === ".") {
        moves.push({ row, col });
      }
    }
  }

  return moves;
}

function makeMove(
  board: TicTacToeBoard,
  row: number,
  col: number,
  side: Side,
): TicTacToeBoard {
  const newBoard = copyBoard(board);
  newBoard[row][col] = side;
  return newBoard;
}

function countPieces(board: TicTacToeBoard): {
  X: number;
  O: number;
  empty: number;
} {
  let X = 0,
    O = 0,
    empty = 0;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell = board[row][col];
      if (cell === "X") X++;
      else if (cell === "O") O++;
      else empty++;
    }
  }

  return { X, O, empty };
}

function checkWinner(
  board: TicTacToeBoard,
): { winner: Side | null; winningLine: { row: number; col: number }[] | null } {
  for (const line of WINNING_LINES) {
    const cells = line.map((pos) => board[pos.row][pos.col]);
    if (cells[0] !== "." && cells[0] === cells[1] && cells[1] === cells[2]) {
      return { winner: cells[0] as Side, winningLine: line };
    }
  }
  return { winner: null, winningLine: null };
}

function determineGameEnd(
  board: TicTacToeBoard,
): { isTerminal: boolean; winner: Side | "draw" | null; winningLine: { row: number; col: number }[] | null } {
  const { winner, winningLine } = checkWinner(board);

  if (winner) {
    return { isTerminal: true, winner, winningLine };
  }

  const counts = countPieces(board);
  if (counts.empty === 0) {
    return { isTerminal: true, winner: "draw", winningLine: null };
  }

  return { isTerminal: false, winner: null, winningLine: null };
}

export function playTicTacToe(cmd: Command): TicTacToeState {
  if (cmd.action === "new_game") {
    const { playerNames } = cmd;
    const board = createEmptyBoard();
    const legalMoves = getLegalMoves(board);
    const counts = countPieces(board);

    return {
      board,
      currentSide: "X", // X always goes first
      playerNames,
      legalMoves,
      counts,
      isTerminal: false,
      winner: null,
      winningLine: null,
      lastAction: { type: "new_game" },
    };
  }

  // Move command
  const { row, col, board, currentSide, playerNames } = cmd;

  // Validate the move
  if (row < 0 || row > 2 || col < 0 || col > 2) {
    const legalMoves = getLegalMoves(board);
    const counts = countPieces(board);

    return {
      board,
      currentSide,
      playerNames,
      legalMoves,
      counts,
      isTerminal: false,
      winner: null,
      winningLine: null,
      lastAction: { type: "move", row, col },
      error: `Invalid move: (${row}, ${col}) is out of bounds. Row and column must be 0-2.`,
    };
  }

  if (board[row][col] !== ".") {
    const legalMoves = getLegalMoves(board);
    const counts = countPieces(board);

    return {
      board,
      currentSide,
      playerNames,
      legalMoves,
      counts,
      isTerminal: false,
      winner: null,
      winningLine: null,
      lastAction: { type: "move", row, col },
      error: `Invalid move: (${row}, ${col}) is already occupied by ${board[row][col]}.`,
    };
  }

  const newBoard = makeMove(board, row, col, currentSide);
  const nextSide = getOpponent(currentSide);
  const legalMoves = getLegalMoves(newBoard);
  const counts = countPieces(newBoard);
  const { isTerminal, winner, winningLine } = determineGameEnd(newBoard);

  return {
    board: newBoard,
    currentSide: nextSide,
    playerNames,
    legalMoves,
    counts,
    isTerminal,
    winner,
    winningLine,
    lastAction: { type: "move", row, col },
  };
}
