/**
 * TicTacToe Plugin - Vue Implementation
 */

import "../style.css";

import type { ToolPlugin } from "gui-chat-protocol/vue";
import type { TicTacToeArgs, TicTacToeState } from "../core/types";
import { pluginCore } from "../core/plugin";
import { samples } from "../core/samples";
import View from "./View.vue";
import Preview from "./Preview.vue";

export const plugin: ToolPlugin<never, TicTacToeState, TicTacToeArgs> = {
  ...pluginCore,
  viewComponent: View,
  previewComponent: Preview,
  samples,
};

// Re-export types
export type {
  Cell,
  Side,
  TicTacToeBoard,
  PlayerType,
  TicTacToeArgs,
  NewGameCommand,
  MoveCommand,
  Command,
  TicTacToeState,
  TicTacToeClickData,
} from "../core/types";

// Re-export utilities
export {
  TOOL_NAME,
  TOOL_DEFINITION,
  SYSTEM_PROMPT,
  playTicTacToe,
  executeTicTacToe,
  pluginCore,
} from "../core/plugin";

export { samples } from "../core/samples";

export { View, Preview };

// Default export for MulmoChat compatibility
export default { plugin };
