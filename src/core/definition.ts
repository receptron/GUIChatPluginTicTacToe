/**
 * TicTacToe Plugin - Tool Definition
 */

import type { ToolDefinition } from "gui-chat-protocol";

export const TOOL_NAME = "playTicTacToe";

export const TOOL_DEFINITION: ToolDefinition = {
  type: "function",
  name: TOOL_NAME,
  description:
    "Play Tic-Tac-Toe (Noughts and Crosses) game with the user. You can start a new game or make moves on the 3x3 board.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["new_game", "move"],
        description: "The action to perform: start a new game or make a move",
      },
      col: {
        type: "number",
        description:
          "Column position for the move (0-2, required for 'move' action). Left=0, Center=1, Right=2",
        minimum: 0,
        maximum: 2,
      },
      row: {
        type: "number",
        description:
          "Row position for the move (0-2, required for 'move' action). Top=0, Middle=1, Bottom=2",
        minimum: 0,
        maximum: 2,
      },
      board: {
        type: "array",
        description:
          "Current 3x3 board state BEFORE the move (required for 'move' action). Pass the current board state as-is.",
        items: {
          type: "array",
          items: {
            type: "string",
            enum: [".", "X", "O"],
          },
        },
      },
      currentSide: {
        type: "string",
        enum: ["X", "O"],
        description:
          "Current player's side (required for 'move' action). X always goes first.",
      },
      playerNames: {
        type: "object",
        description:
          "Player assignments (required for 'move' action)",
        properties: {
          X: {
            type: "string",
            enum: ["user", "computer"],
          },
          O: {
            type: "string",
            enum: ["user", "computer"],
          },
        },
        required: ["X", "O"],
      },
      firstPlayer: {
        type: "string",
        enum: ["user", "computer"],
        description:
          "Optional: Which player should play as X (goes first) for 'new_game' action. If not specified, will be chosen randomly.",
      },
    },
    required: ["action"],
    additionalProperties: false,
  },
};

export const SYSTEM_PROMPT = `You can play Tic-Tac-Toe with users. When a user wants to play:
1. Start a new game with the "new_game" action
2. For moves, positions are: Top-Left=(0,0), Top-Center=(1,0), Top-Right=(2,0), Middle-Left=(0,1), Middle-Center=(1,1), Middle-Right=(2,1), Bottom-Left=(0,2), Bottom-Center=(1,2), Bottom-Right=(2,2)
3. Use the "move" action with row and col, passing the current board state
4. X always goes first. Win by getting 3 in a row (horizontal, vertical, or diagonal)`;
