<template>
  <div class="p-3 bg-gray-50 rounded">
    <div v-if="result.jsonData" class="space-y-2">
      <!-- TicTacToe board display -->
      <div class="flex justify-center">
        <div class="inline-block bg-gray-600 p-0.5 rounded">
          <div class="grid grid-cols-3 gap-0.5">
            <template
              v-for="(row, rowIndex) in result.jsonData.board"
              :key="rowIndex"
            >
              <div
                v-for="(cell, colIndex) in row"
                :key="`${rowIndex}-${colIndex}`"
                class="w-6 h-6 flex items-center justify-center bg-white rounded-sm"
                :class="isWinningCell(rowIndex, colIndex) ? 'bg-yellow-200' : ''"
              >
                <!-- X mark -->
                <svg
                  v-if="cell === 'X'"
                  class="w-4 h-4 text-blue-600"
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
                  v-else-if="cell === 'O'"
                  class="w-4 h-4 text-red-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <circle cx="12" cy="12" r="8" />
                </svg>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- Game info -->
      <div class="text-xs text-center space-y-1">
        <div v-if="!result.jsonData.isTerminal" class="text-gray-600">
          <span :class="result.jsonData.currentSide === 'X' ? 'text-blue-600' : 'text-red-600'">
            {{ result.jsonData.currentSide }}
          </span>
          {{ capitalizeFirst(result.jsonData.playerNames[result.jsonData.currentSide]) }}
          to play
        </div>
        <div v-else class="font-medium" :class="getResultClass()">
          {{ getGameResult(result.jsonData) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ToolResult } from "gui-chat-protocol/vue";
import type { TicTacToeState } from "../core/types";

const props = defineProps<{
  result: ToolResult<never, TicTacToeState>;
}>();

function isWinningCell(row: number, col: number): boolean {
  return props.result.jsonData?.winningLine?.some(
    (pos) => pos.row === row && pos.col === col,
  ) ?? false;
}

function getGameResult(gameState: TicTacToeState): string {
  if (!gameState.isTerminal) return "";
  if (gameState.winner === "draw") return "Draw!";
  if (gameState.winner === "X") return "X Wins!";
  if (gameState.winner === "O") return "O Wins!";
  return "Game Over";
}

function getResultClass(): string {
  if (!props.result.jsonData?.isTerminal) return "";
  if (props.result.jsonData.winner === "draw") return "text-gray-600";
  if (props.result.jsonData.winner === "X") return "text-blue-600";
  if (props.result.jsonData.winner === "O") return "text-red-600";
  return "";
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>
