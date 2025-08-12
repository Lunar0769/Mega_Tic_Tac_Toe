// Check if there's a winner in a 3x3 board
export function checkWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// Check if a board is full (tie)
export function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

// Get the status of a sub-board: 'X', 'O', 'tie', or null
export function getBoardStatus(board) {
  const winner = checkWinner(board);
  if (winner) return winner;
  if (isBoardFull(board)) return 'tie';
  return null;
}

// Get the status of all sub-boards
export function getAllBoardStatuses(boards) {
  return boards.map(board => getBoardStatus(board));
}

// Check if the overall game has a winner
export function checkGameWinner(boardStatuses) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (boardStatuses[a] && 
        boardStatuses[a] === boardStatuses[b] && 
        boardStatuses[a] === boardStatuses[c] &&
        boardStatuses[a] !== 'tie') {
      return boardStatuses[a];
    }
  }
  return null;
}

// Check if the overall game is a tie
export function isGameTie(boardStatuses) {
  return boardStatuses.every(status => status !== null);
}