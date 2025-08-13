const WebSocket = require('ws');

const PORT = process.env.PORT || 4000;
const server = new WebSocket.Server({ port: PORT });

// Store rooms and their state
const rooms = new Map();

// Game logic functions
function checkWinner(board) {
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

function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

function getBoardStatus(board) {
  const winner = checkWinner(board);
  if (winner) return winner;
  if (isBoardFull(board)) return 'tie';
  return null;
}

function getAllBoardStatuses(boards) {
  return boards.map(board => getBoardStatus(board));
}

function checkGameWinner(boardStatuses) {
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

function isGameTie(boardStatuses) {
  return boardStatuses.every(status => status !== null);
}

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function broadcast(roomId, message, excludeClient = null) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.clients.forEach(client => {
    if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

server.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'createRoom':
          const roomId = generateRoomId();
          const newRoom = {
            id: roomId,
            owner: message.username,
            clients: [ws],
            players: [{ username: message.username, symbol: 'X' }],
            boards: Array.from({ length: 9 }, () => Array(9).fill(null)),
            xIsNext: true,
            nextBoard: null,
            gameStarted: false
          };
          
          rooms.set(roomId, newRoom);
          ws.roomId = roomId;
          ws.username = message.username;
          
          ws.send(JSON.stringify({
            type: 'roomCreated',
            roomId: roomId,
            playerSymbol: 'X'
          }));

          // Send initial game state to room creator
          ws.send(JSON.stringify({
            type: 'gameState',
            boards: newRoom.boards,
            xIsNext: newRoom.xIsNext,
            nextBoard: newRoom.nextBoard,
            gameStarted: newRoom.gameStarted,
            players: newRoom.players
          }));
          
          console.log(`Room ${roomId} created by ${message.username}`);
          break;

        case 'joinRoom':
          const room = rooms.get(message.roomId);
          if (!room) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Room not found'
            }));
            break;
          }

          room.clients.push(ws);
          ws.roomId = message.roomId;
          ws.username = message.username;

          if (room.players.length < 2) {
            // Add as second player
            room.players.push({ username: message.username, symbol: 'O' });
            room.gameStarted = true;
            ws.send(JSON.stringify({
              type: 'joinSuccess',
              playerSymbol: 'O'
            }));
            
            // Send updated game state to all clients
            const gameStateMessage = {
              type: 'gameState',
              boards: room.boards,
              xIsNext: room.xIsNext,
              nextBoard: room.nextBoard,
              gameStarted: room.gameStarted,
              players: room.players
            };
            console.log('Broadcasting game state:', gameStateMessage);
            broadcast(message.roomId, gameStateMessage, null); // Send to all clients including the new joiner
          } else {
            // Room is full, join as spectator
            ws.send(JSON.stringify({
              type: 'spectateApproved'
            }));

            // Send current game state to new client
            ws.send(JSON.stringify({
              type: 'gameState',
              boards: room.boards,
              xIsNext: room.xIsNext,
              nextBoard: room.nextBoard,
              gameStarted: room.gameStarted,
              players: room.players
            }));
          }

          console.log(`${message.username} joined room ${message.roomId}. Game started: ${room.gameStarted}, Players: ${room.players.length}`);
          break;

        case 'move':
          const gameRoom = rooms.get(message.roomId);
          if (!gameRoom) break;

          // Validate move
          if (!gameRoom.gameStarted) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Game not started yet'
            }));
            break;
          }

          // Check if it's the player's turn
          const currentPlayer = gameRoom.players.find(p => p.username === ws.username);
          if (!currentPlayer) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'You are not a player in this game'
            }));
            break;
          }

          const expectedSymbol = gameRoom.xIsNext ? 'X' : 'O';
          if (currentPlayer.symbol !== expectedSymbol) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Not your turn'
            }));
            break;
          }

          // Validate the move is legal
          if (gameRoom.boards[message.boardIndex][message.cellIndex] !== null) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Cell already occupied'
            }));
            break;
          }

          // Update room state
          gameRoom.boards[message.boardIndex][message.cellIndex] = message.symbol;
          
          // Check for wins
          const boardStatuses = getAllBoardStatuses(gameRoom.boards);
          const gameWinner = checkGameWinner(boardStatuses);
          const gameTie = isGameTie(boardStatuses);
          
          // Advanced logic for next board determination
          const targetBoardIndex = message.cellIndex;
          const targetBoardStatus = getBoardStatus(gameRoom.boards[targetBoardIndex]);
          
          console.log(`Target board ${targetBoardIndex} status:`, targetBoardStatus);
          
          if (targetBoardStatus !== null) {
            // Target board is completed
            const winnerSymbol = targetBoardStatus === 'tie' ? null : targetBoardStatus;
            const nextPlayerSymbol = gameRoom.xIsNext ? 'O' : 'X'; // Next player after toggle
            
            console.log(`Sub-board winner: ${winnerSymbol}, Next player: ${nextPlayerSymbol}`);
            
            if (winnerSymbol === nextPlayerSymbol) {
              // Winner of sub-board is the same as next player - they can choose any board
              gameRoom.nextBoard = null;
              console.log('Next player can choose any board');
            } else if (winnerSymbol) {
              // Winner of sub-board is different - they choose where next player plays
              gameRoom.waitingForBoardSelection = true;
              gameRoom.boardSelectionPlayer = winnerSymbol;
              
              console.log(`Board selection required by player ${winnerSymbol}`);
              
              // Notify ALL clients about board selection requirement (for UI updates)
              broadcast(message.roomId, {
                type: 'boardSelectionRequired',
                player: gameRoom.boardSelectionPlayer
              });
            } else {
              // It's a tie, current player chooses
              gameRoom.waitingForBoardSelection = true;
              gameRoom.boardSelectionPlayer = message.symbol;
              
              console.log(`Board selection required by current player ${message.symbol} (tie)`);
              
              broadcast(message.roomId, {
                type: 'boardSelectionRequired',
                player: gameRoom.boardSelectionPlayer
              });
            }
          } else {
            // Target board is available
            gameRoom.nextBoard = targetBoardIndex;
            console.log(`Next board set to ${targetBoardIndex}`);
          }
          
          // Toggle turn
          gameRoom.xIsNext = !gameRoom.xIsNext;

          // Broadcast move to all clients in room
          broadcast(message.roomId, {
            type: 'move',
            boardIndex: message.boardIndex,
            cellIndex: message.cellIndex,
            symbol: message.symbol
          });

          // If game is over, broadcast game end
          if (gameWinner || gameTie) {
            broadcast(message.roomId, {
              type: 'gameEnd',
              winner: gameWinner,
              tie: gameTie
            });
          }

          console.log(`Move in room ${message.roomId}: board ${message.boardIndex}, cell ${message.cellIndex}, symbol ${message.symbol}`);
          if (gameWinner) console.log(`Game won by ${gameWinner} in room ${message.roomId}`);
          if (gameTie) console.log(`Game tied in room ${message.roomId}`);
          break;

        case 'selectBoard':
          const selectRoom = rooms.get(message.roomId);
          if (!selectRoom || !selectRoom.waitingForBoardSelection) break;
          
          // Validate that the correct player is making the selection
          const selectingPlayer = selectRoom.players.find(p => p.username === ws.username);
          if (!selectingPlayer || selectingPlayer.symbol !== selectRoom.boardSelectionPlayer) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'You are not authorized to select the board'
            }));
            break;
          }
          
          // Validate the board selection
          const selectedBoardStatus = getBoardStatus(selectRoom.boards[message.boardIndex]);
          if (selectedBoardStatus !== null) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Selected board is already completed'
            }));
            break;
          }
          
          // Set the next board and clear waiting state
          selectRoom.nextBoard = message.boardIndex;
          selectRoom.waitingForBoardSelection = false;
          selectRoom.boardSelectionPlayer = null;
          
          // Broadcast the board selection to all clients
          broadcast(message.roomId, {
            type: 'boardSelected',
            boardIndex: message.boardIndex
          });
          
          console.log(`Board ${message.boardIndex} selected by ${ws.username} for room ${message.roomId}`);
          break;

        case 'replayGame':
          const replayRoom = rooms.get(message.roomId);
          if (!replayRoom) break;
          
          // Reset game state
          replayRoom.boards = Array.from({ length: 9 }, () => Array(9).fill(null));
          replayRoom.xIsNext = true;
          replayRoom.nextBoard = null;
          replayRoom.waitingForBoardSelection = false;
          replayRoom.boardSelectionPlayer = null;
          
          // Update players for new game
          const newPlayers = message.players.map((player, index) => ({
            ...player,
            symbol: index === 0 ? 'X' : 'O'
          }));
          
          // Keep spectators
          const spectators = replayRoom.players.filter(p => !p.symbol);
          replayRoom.players = [...newPlayers, ...spectators];
          
          // Broadcast game reset
          broadcast(message.roomId, {
            type: 'gameReset',
            players: replayRoom.players
          });
          
          console.log(`Game reset in room ${message.roomId} with players:`, newPlayers.map(p => p.username));
          break;

        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    
    // Remove client from room
    if (ws.roomId) {
      const room = rooms.get(ws.roomId);
      if (room) {
        room.clients = room.clients.filter(client => client !== ws);
        room.players = room.players.filter(player => player.username !== ws.username);
        
        // Clean up empty rooms
        if (room.clients.length === 0) {
          rooms.delete(ws.roomId);
          console.log(`Room ${ws.roomId} deleted`);
        }
      }
    }
  });
});

console.log(`WebSocket server running on port ${PORT}`);