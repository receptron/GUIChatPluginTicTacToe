<template>
  <div class="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-100">
    <div v-if="gameState" class="flex flex-col items-center">
      <!-- Game title -->
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Tic-Tac-Toe</h1>

      <!-- Turn indicator -->
      <div class="text-lg font-semibold mb-4 text-center" :class="turnIndicatorClass">
        <template v-if="gameState.isTerminal">
          <span v-if="gameState.winner === 'draw'">It's a Draw!</span>
          <span v-else>{{ gameState.winner }} Wins!</span>
        </template>
        <template v-else>
          {{ currentPlayerName }}'s Turn ({{ gameState.currentSide }})
        </template>
      </div>

      <!-- Game board -->
      <div class="grid grid-cols-3 gap-1 p-2 bg-gray-700 rounded-lg shadow-lg">
        <div
          v-for="(cell, index) in flatBoard"
          :key="index"
          :class="getCellClass(cell, index)"
          @click="handleCellClick(index)"
          @mouseenter="handleCellHover(index, true)"
          @mouseleave="handleCellHover(index, false)"
        >
          <!-- X mark -->
          <svg
            v-if="cell.piece === 'X'"
            class="w-16 h-16 text-blue-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          >
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>

          <!-- O mark -->
          <svg
            v-else-if="cell.piece === 'O'"
            class="w-16 h-16 text-red-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <circle cx="12" cy="12" r="8" />
          </svg>

          <!-- Hover preview for user turn -->
          <svg
            v-else-if="cell.isLegalMove && !isComputerTurn && hoveredCell === index"
            class="w-16 h-16 opacity-30"
            :class="gameState.currentSide === 'X' ? 'text-blue-400' : 'text-red-400'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          >
            <template v-if="gameState.currentSide === 'X'">
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </template>
            <circle v-else cx="12" cy="12" r="8" />
          </svg>
        </div>
      </div>

      <!-- Score display -->
      <div class="mt-4 flex gap-8 text-lg">
        <div class="flex items-center gap-2">
          <span class="text-blue-600 font-bold">X:</span>
          <span>{{ gameState.counts.X }}</span>
          <span class="text-gray-500 text-sm">({{ gameState.playerNames.X }})</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-red-600 font-bold">O:</span>
          <span>{{ gameState.counts.O }}</span>
          <span class="text-gray-500 text-sm">({{ gameState.playerNames.O }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { ToolResult, SendTextMessageOptions } from "gui-chat-protocol/vue";
import type { TicTacToeState, TicTacToeClickData } from "../core/types";

const props = defineProps<{
  selectedResult: ToolResult<never, TicTacToeState> | null;
  sendTextMessage?: (text: string, options?: SendTextMessageOptions) => void;
}>();

const gameState = ref<TicTacToeState | null>(null);
const hoveredCell = ref<number | null>(null);

watch(
  () => props.selectedResult,
  (newResult) => {
    if (newResult?.toolName === "playTicTacToe" && newResult.jsonData) {
      gameState.value = newResult.jsonData;
    }
  },
  { immediate: true },
);

const currentPlayerName = computed(() => {
  if (!gameState.value?.playerNames) return "";
  const player = gameState.value.playerNames[gameState.value.currentSide];
  return player.charAt(0).toUpperCase() + player.slice(1);
});

const isComputerTurn = computed(() => {
  return (
    gameState.value?.playerNames &&
    gameState.value.playerNames[gameState.value.currentSide] === "computer"
  );
});

const turnIndicatorClass = computed(() => {
  if (!gameState.value) return "";
  if (gameState.value.isTerminal) {
    return gameState.value.winner === "draw"
      ? "text-gray-600"
      : gameState.value.winner === "X"
        ? "text-blue-600"
        : "text-red-600";
  }
  return gameState.value.currentSide === "X" ? "text-blue-600" : "text-red-600";
});

interface FlatBoardCell {
  row: number;
  col: number;
  piece: string | null;
  isLegalMove: boolean;
  isWinningCell: boolean;
}

const flatBoard = computed((): FlatBoardCell[] => {
  if (!gameState.value?.board) return [];

  const board: FlatBoardCell[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cellValue = gameState.value.board[row][col];
      const isLegalMove = gameState.value.legalMoves?.some(
        (move) => move.row === row && move.col === col,
      );
      const isWinningCell = gameState.value.winningLine?.some(
        (pos) => pos.row === row && pos.col === col,
      );

      board.push({
        row,
        col,
        piece: cellValue !== "." ? cellValue : null,
        isLegalMove: isLegalMove ?? false,
        isWinningCell: isWinningCell ?? false,
      });
    }
  }
  return board;
});

function getCellClass(cell: FlatBoardCell, index: number) {
  const baseClasses =
    "w-24 h-24 flex items-center justify-center bg-white rounded";

  let stateClasses = "";

  if (cell.isWinningCell) {
    stateClasses = "bg-yellow-200 ring-2 ring-yellow-400";
  } else if (
    cell.isLegalMove &&
    !isComputerTurn.value &&
    !gameState.value?.isTerminal
  ) {
    stateClasses =
      hoveredCell.value === index
        ? "bg-gray-200 cursor-pointer"
        : "hover:bg-gray-100 cursor-pointer";
  }

  return `${baseClasses} ${stateClasses}`;
}

function handleCellClick(index: number): void {
  if (!gameState.value || gameState.value.isTerminal || isComputerTurn.value)
    return;

  const cell = flatBoard.value[index];
  if (!cell.isLegalMove) return;

  const rowNames = ["top", "middle", "bottom"];
  const colNames = ["left", "center", "right"];
  const positionName = `${rowNames[cell.row]}-${colNames[cell.col]}`;

  const clickData: TicTacToeClickData = {
    row: cell.row,
    col: cell.col,
    currentState: gameState.value,
  };

  props.sendTextMessage?.(
    `I want to play at ${positionName}, which is row=${cell.row}, col=${cell.col}`,
    { data: clickData },
  );
}

function handleCellHover(index: number, isEntering: boolean): void {
  if (!gameState.value || gameState.value.isTerminal || isComputerTurn.value)
    return;

  const cell = flatBoard.value[index];
  if (!cell.isLegalMove) return;

  hoveredCell.value = isEntering ? index : null;
}
</script>
