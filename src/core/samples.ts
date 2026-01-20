/**
 * TicTacToe Plugin - Sample Data
 */

import type { ToolSample } from "gui-chat-protocol";

export const samples: ToolSample[] = [
  {
    name: "New Game (User plays X)",
    args: {
      action: "new_game",
      firstPlayer: "user",
    },
  },
  {
    name: "New Game (Computer plays X)",
    args: {
      action: "new_game",
      firstPlayer: "computer",
    },
  },
];
