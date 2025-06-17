// Returns "X", "O", or null if no winner
export function calculateWinner(cells) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diags
  ];
  for (let [a,b,c] of lines) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}

// Returns true if all cells are filled and no winner (tie)
export function isBoardFull(cells) {
  return cells.every(cell => cell !== null);
}