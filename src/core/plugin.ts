/**
 * TicTacToe Plugin Core
 */

import type { ToolPluginCore, ToolContext, ToolResult } from "gui-chat-protocol";
import type { TicTacToeArgs, TicTacToeState, Side, Command } from "./types";
import { TOOL_DEFINITION, SYSTEM_PROMPT } from "./definition";
import { playTicTacToe } from "./logic";

export { TOOL_NAME, TOOL_DEFINITION, SYSTEM_PROMPT } from "./definition";
export { playTicTacToe } from "./logic";

export const executeTicTacToe = async (
  _context: ToolContext,
  args: TicTacToeArgs,
): Promise<ToolResult<never, TicTacToeState>> => {
  try {
    let command: Command;

    if (args.action === "new_game") {
      let xPlayer: string;
      if (args.firstPlayer) {
        xPlayer = args.firstPlayer;
      } else {
        xPlayer = Math.random() < 0.5 ? "computer" : "user";
      }
      const oPlayer = xPlayer === "user" ? "computer" : "user";

      command = {
        action: "new_game",
        playerNames: { X: xPlayer, O: oPlayer },
      };
    } else if (args.action === "move") {
      if (
        typeof args.row !== "number" ||
        typeof args.col !== "number" ||
        !args.board ||
        !args.currentSide ||
        !args.playerNames
      ) {
        throw new Error(
          "Move action requires row, col, board, currentSide, and playerNames parameters",
        );
      }
      command = {
        action: "move",
        row: args.row,
        col: args.col,
        board: args.board,
        currentSide: args.currentSide as Side,
        playerNames: args.playerNames,
      };
    } else {
      throw new Error(`Unknown action: ${args.action}`);
    }

    const state = playTicTacToe(command);

    // Handle invalid move
    if (state.error) {
      const isComputerTurn =
        state.playerNames[state.currentSide] === "computer";
      const legalMovesStr = state.legalMoves
        .map((m) => `(row=${m.row}, col=${m.col})`)
        .join(", ");

      const instructions = isComputerTurn
        ? `Invalid move attempted. You must make a valid move. Legal moves are: ${legalMovesStr}. Choose one of these moves.`
        : `Invalid move attempted. Tell the user they must make a valid move. Legal moves are: ${legalMovesStr}.`;

      return {
        message: state.error,
        jsonData: state,
        instructions,
        updating: true,
      };
    }

    let message = "";
    if (state.lastAction.type === "new_game") {
      message = "Started a new Tic-Tac-Toe game! X goes first.";
    } else if (state.lastAction.type === "move") {
      const positionName = getPositionName(state.lastAction.row, state.lastAction.col);
      message = `Played ${state.board[state.lastAction.row][state.lastAction.col] === "X" ? "O" : "X"} at ${positionName} (row=${state.lastAction.row}, col=${state.lastAction.col}).`;
    }

    if (state.isTerminal) {
      if (state.winner === "draw") {
        message += " Game over - it's a draw!";
      } else if (state.winner) {
        message += ` Game over - ${state.winner} wins!`;
      }
    }

    const isComputerTurn = state.playerNames[state.currentSide] === "computer";
    const instructions = state.isTerminal
      ? "The game is over. Announce the game result."
      : isComputerTurn
        ? "It is your turn. Choose your next move from the available positions."
        : "It is the user's turn. Wait for them to make a move.";

    return {
      message,
      jsonData: state,
      instructions,
      instructionsRequired: state.isTerminal || isComputerTurn,
      updating: args.action !== "new_game",
    };
  } catch (error) {
    console.error("ERR: TicTacToe game error", error);
    return {
      message: `TicTacToe game error: ${error instanceof Error ? error.message : "Unknown error"}`,
      instructions:
        "Acknowledge that there was an error with the TicTacToe game and suggest trying again.",
    };
  }
};

function getPositionName(row: number, col: number): string {
  const rowNames = ["Top", "Middle", "Bottom"];
  const colNames = ["Left", "Center", "Right"];
  return `${rowNames[row]}-${colNames[col]}`;
}

export const pluginCore: ToolPluginCore<never, TicTacToeState, TicTacToeArgs> = {
  toolDefinition: TOOL_DEFINITION,
  execute: executeTicTacToe,
  generatingMessage: "Processing TicTacToe move...",
  isEnabled: () => true,
  systemPrompt: SYSTEM_PROMPT,
};
