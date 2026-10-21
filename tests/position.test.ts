import { test, describe } from "node:test";
import assert from "node:assert";
import { isOnBoard } from "../src/core/position.js";
import { playTicTacToe } from "../src/core/logic.js";

const SIZE = 3;
const playerNames = { X: "user", O: "computer" };
const opening = () => playTicTacToe({ action: "new_game", playerNames });
const moveTo = (row: number, col: number) => playTicTacToe({ action: "move", row, col, board: opening().board, currentSide: "X", playerNames });

describe("isOnBoard", () => {
  test("accepts every square", () => {
    [0, 1, 2].forEach((row) => [0, 1, 2].forEach((col) => assert.equal(isOnBoard(row, col, SIZE), true)));
  });

  test("rejects positions just outside each edge", () => {
    [
      [-1, 0],
      [0, -1],
      [SIZE, 0],
      [0, SIZE],
    ].forEach(([row, col]) => assert.equal(isOnBoard(row, col, SIZE), false));
  });

  test("rejects values that are not whole numbers", () => {
    [0.5, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, -0.5].forEach((value) => {
      assert.equal(isOnBoard(value, 0, SIZE), false);
      assert.equal(isOnBoard(0, value, SIZE), false);
    });
  });

  test("rejects a non-number from an untyped caller", () => {
    const fromJson: { row: number } = JSON.parse('{"row":"__proto__"}');
    assert.equal(isOnBoard(fromJson.row, 0, SIZE), false);
  });
});

describe("playTicTacToe move coordinates", () => {
  test("a square on the board is played", () => {
    const state = moveTo(1, 1);
    assert.equal(state.error, undefined);
    assert.equal(state.board[1][1], "X");
  });

  test("a square off the board or between squares is out of bounds, not a throw", () => {
    [
      [-1, 0],
      [0, -1],
      [SIZE, 0],
      [0, SIZE],
      [1.5, 0],
      [0, 0.5],
      [Number.NaN, 0],
    ].forEach(([row, col]) => {
      const state = moveTo(row, col);
      assert.match(state.error ?? "", /out of bounds/);
      assert.deepEqual(state.board, opening().board);
    });
  });
});
