/**
 * TicTacToe Plugin - Core (Framework-agnostic)
 */

// Export plugin-specific types
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
} from "./types";

// Export plugin utilities
export {
  TOOL_NAME,
  TOOL_DEFINITION,
  SYSTEM_PROMPT,
  playTicTacToe,
  executeTicTacToe,
  pluginCore,
} from "./plugin";

// Export samples
export { samples } from "./samples";
