# ChangeLog

## @gui-chat-plugin/tictactoe@2.1.1 (2026-10-22)

- **Reject fractional move coordinates** (#35, fixes #34): `playTicTacToe` threw on a fractional `row` and reported a fractional `col` as an occupied square; both now get the out-of-bounds response. Adds `yarn test` and runs it in CI.

