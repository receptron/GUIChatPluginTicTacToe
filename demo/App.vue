<template>
  <div class="max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-8">{{ pluginName }} Demo</h1>

    <div class="bg-white rounded-lg p-5 mb-5 shadow-md">
      <h2 class="text-gray-600 text-xl mb-4">Actions</h2>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(sample, index) in samplesList"
          :key="index"
          @click="executeSample(sample)"
          class="py-2 px-4 bg-indigo-100 border border-indigo-200 rounded-md cursor-pointer text-sm text-indigo-700 hover:bg-indigo-200"
        >
          {{ sample.name }}
        </button>
      </div>
    </div>

    <div v-if="ViewComponent" class="bg-gray-800 rounded-lg p-5 mb-5 shadow-md">
      <h2 class="text-gray-200 text-xl mb-4">View Component</h2>
      <div class="border border-gray-600 rounded h-[500px]">
        <component
          :is="ViewComponent"
          :selectedResult="result"
          :sendTextMessage="handleSendMessage"
        />
      </div>
    </div>

    <div v-if="PreviewComponent" class="bg-white rounded-lg p-5 mb-5 shadow-md">
      <h2 class="text-gray-600 text-xl mb-4">Preview Component</h2>
      <div class="max-w-[200px]">
        <component :is="PreviewComponent" :result="result" />
      </div>
    </div>

    <div v-if="lastMessage" class="bg-white rounded-lg p-5 mb-5 shadow-md">
      <h2 class="text-gray-600 text-xl mb-4">Last Message</h2>
      <p class="text-gray-700">{{ lastMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { plugin, executeTicTacToe } from "../src/vue";
import type {
  ToolResult,
  ToolSample,
  ToolPlugin,
  SendTextMessageOptions,
} from "gui-chat-protocol/vue";
import type {
  TicTacToeArgs,
  TicTacToeState,
  TicTacToeClickData,
} from "../src/core/types";
import { playTicTacToe } from "../src/core/logic";

const currentPlugin = plugin as unknown as ToolPlugin;

const pluginName = computed(() => currentPlugin.toolDefinition.name);
const samplesList = computed(() => currentPlugin.samples || []);
const ViewComponent = computed(() => currentPlugin.viewComponent);
const PreviewComponent = computed(() => currentPlugin.previewComponent);

const lastMessage = ref<string>("");

const result = ref<ToolResult<never, TicTacToeState>>({
  toolName: pluginName.value,
  uuid: "demo-uuid",
  message: "Ready",
  title: "TicTacToe",
});

const executeSample = async (sample: ToolSample) => {
  const args = sample.args as unknown as TicTacToeArgs;
  const execResult = await executeTicTacToe({} as any, args);
  result.value = {
    ...result.value,
    ...execResult,
    uuid: `demo-${Date.now()}`,
  };
};

const handleSendMessage = (text?: string, options?: SendTextMessageOptions) => {
  lastMessage.value = text || "";
  console.log("Send message:", text, options);

  // Use data option if available (from View component click)
  if (options?.data) {
    const clickData = options.data as TicTacToeClickData;
    processUserMove(clickData.row, clickData.col, clickData.currentState);
    return;
  }

  // Fallback: Parse the message to extract row and col
  const rowMatch = text?.match(/row=(\d+)/);
  const colMatch = text?.match(/col=(\d+)/);

  if (rowMatch && colMatch && result.value.jsonData) {
    const row = parseInt(rowMatch[1], 10);
    const col = parseInt(colMatch[1], 10);
    processUserMove(row, col, result.value.jsonData);
  }
};

/**
 * Process user's move and then make computer's move
 */
const processUserMove = (row: number, col: number, currentState: TicTacToeState) => {
  // Apply user's move
  let newState = playTicTacToe({
    action: "move",
    row,
    col,
    board: currentState.board,
    currentSide: currentState.currentSide,
    playerNames: currentState.playerNames,
  });

  // Update result with user's move
  result.value = {
    ...result.value,
    jsonData: newState,
    uuid: `demo-${Date.now()}`,
  };

  // If it's now computer's turn and game is not over, make computer move
  if (
    !newState.isTerminal &&
    newState.playerNames[newState.currentSide] === "computer"
  ) {
    // Small delay for visual feedback
    setTimeout(() => {
      makeComputerMove(newState);
    }, 500);
  }
};

/**
 * Make a simple computer move (picks random legal move)
 */
const makeComputerMove = (state: TicTacToeState) => {
  if (state.legalMoves.length === 0) {
    // No legal moves (shouldn't happen in TicTacToe unless game is over)
    return;
  }

  // Pick a random legal move
  const randomIndex = Math.floor(Math.random() * state.legalMoves.length);
  const move = state.legalMoves[randomIndex];

  const newState = playTicTacToe({
    action: "move",
    row: move.row,
    col: move.col,
    board: state.board,
    currentSide: state.currentSide,
    playerNames: state.playerNames,
  });

  result.value = {
    ...result.value,
    jsonData: newState,
    uuid: `demo-${Date.now()}`,
  };
};
</script>
