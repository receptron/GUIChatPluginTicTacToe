/** Whether (row, col) names a square of a size×size board: whole numbers, inside it. */
export function isOnBoard(row: number, col: number, size: number): boolean {
  return [row, col].every((index) => Number.isInteger(index) && index >= 0 && index < size);
}
