# #34 — reject fractional move coordinates

The bounds check (`row < 0 || row > 2 || …`) let a fractional value through, so `row: 1.5` threw a `TypeError` and `col: 0.5` was reported as an occupied square.

## How
- `src/core/position.ts`: `isOnBoard(row, col, size)` — both are whole numbers inside the board. Pure, so it is tested on its own.
- `playTicTacToe` uses it in place of the range comparison, so these moves get the out-of-bounds response.
- `tests/position.test.ts` covers the check in both directions and `playTicTacToe` with off-board and fractional moves. Run with `yarn test`, the same `tsx --test` setup the other plugins use; CI now runs it.

## Left out
- Validating the shape of a caller-supplied `board`.
