import React, { useState, useCallback } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import ParticleBackground from './components/ParticleBackground';
import { getAllBoardStatuses, checkGameWinner, isGameTie } from './utils/gameLogic';

function App() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [isSpectator, setIsSpectator] = useState(false);
  const [xIsNext, setXIsNext] = useState(true);
  const [nextBoard, setNextBoard] = useState(null);
  const [gameWinner, setGameWinner] = useState(null);
  const [gameTied, setGameTied] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [showBoardSelection, setShowBoardSelection] = useState(false);
  const [boardSelectionPlayer, setBoardSelectionPlayer] = useState(null);
  const [isHost, setIsHost] = useState(false);

  // Initialize 9 sub-boards, each with 9 null cells
  const initialBoards = Array.from({ length: 9 }, () => Array(9).fill(null));
  const [boards, setBoards] = useState(initialBoards);

  // Handle messages from WebSocket
  const handleMessage = useCallback((data) => {
    console.log('Received message:', data); // Debug log
    switch (data.type) {
      case 'roomCreated':
        setRoomId(data.roomId);
        setIsInRoom(true);
        setPlayerSymbol(data.playerSymbol);
        setIsHost(true);
        break;
      
      case 'joinSuccess':
        setIsInRoom(true);
        setPlayerSymbol(data.playerSymbol);
        break;
      
      case 'spectateApproved':
        setIsSpectator(true);
        setIsInRoom(true);
        break;
      
      case 'move':
        const { boardIndex, cellIndex, symbol } = data;
        setBoards(prev => {
          const newBoards = [...prev];
          newBoards[boardIndex] = [...newBoards[boardIndex]];
          newBoards[boardIndex][cellIndex] = symbol;
          return newBoards;
        });

        // Determine next active board and check for wins
        const target = cellIndex;
        setBoards(currentBoards => {
          const newBoards = [...currentBoards];
          newBoards[boardIndex] = [...newBoards[boardIndex]];
          newBoards[boardIndex][cellIndex] = symbol;
          
          // Check for game winner
          const boardStatuses = getAllBoardStatuses(newBoards);
          const winner = checkGameWinner(boardStatuses);
          const tie = isGameTie(boardStatuses);
          
          setGameWinner(winner);
          setGameTied(tie);
          
          // Determine next board
          const targetBoard = newBoards[target];
          const isTargetCompleted = getAllBoardStatuses([targetBoard])[0] !== null;
          setNextBoard(isTargetCompleted ? null : target);
          
          return newBoards;
        });

        // Toggle turn indicator
        setXIsNext(symbol === 'O');
        break;
      
      case 'gameState':
        console.log('Processing gameState message:', data);
        // Server sends full game state (useful for reconnection)
        if (data.boards) {
          setBoards(data.boards);
          // Check for game winner when receiving state
          const boardStatuses = getAllBoardStatuses(data.boards);
          const winner = checkGameWinner(boardStatuses);
          const tie = isGameTie(boardStatuses);
          setGameWinner(winner);
          setGameTied(tie);
        }
        if (data.nextBoard !== undefined) setNextBoard(data.nextBoard);
        if (data.xIsNext !== undefined) setXIsNext(data.xIsNext);
        if (data.gameStarted !== undefined) {
          console.log('Setting gameStarted from', gameStarted, 'to:', data.gameStarted);
          setGameStarted(data.gameStarted);
        }
        if (data.players) {
          console.log('Setting players from', players, 'to:', data.players);
          setPlayers(data.players);
        }
        console.log('After processing gameState - gameStarted:', data.gameStarted, 'players:', data.players?.length);
        break;
      
      case 'gameEnd':
        // Game has ended
        if (data.winner) setGameWinner(data.winner);
        if (data.tie) setGameTied(true);
        break;
      
      case 'gameReady':
        // Both players joined, game can start (legacy - now handled by gameState)
        setGameStarted(data.gameStarted || true);
        setPlayers(data.players);
        break;
      
      case 'boardSelectionRequired':
        // Winner of completed sub-board needs to choose next board
        // Only show modal to the player who won the sub-board
        if (data.player === playerSymbol) {
          setShowBoardSelection(true);
          setBoardSelectionPlayer(data.player);
        } else {
          // For other players, just show a message
          setBoardSelectionPlayer(data.player);
        }
        break;
      
      case 'boardSelected':
        // Board has been selected, clear the waiting state
        setShowBoardSelection(false);
        setBoardSelectionPlayer(null);
        setNextBoard(data.boardIndex);
        break;
      
      case 'gameReset':
        // Game has been reset for replay
        setBoards(initialBoards);
        setGameWinner(null);
        setGameTied(false);
        setXIsNext(true);
        setNextBoard(null);
        setPlayers(data.players);
        setShowBoardSelection(false);
        setBoardSelectionPlayer(null);
        break;
      
      case 'error':
        // Handle server errors
        console.error('Server error:', data.message);
        alert(data.message);
        break;
      
      default:
        console.log('Unknown message type:', data.type);
        break;
    }
  }, []);

  // Establish WebSocket connection
  const { send } = useWebSocket(
    process.env.NODE_ENV === 'production' 
      ? 'wss://YOUR-ACTUAL-RAILWAY-URL.railway.app' // Replace with your actual Railway URL
      : 'ws://localhost:4000', 
    handleMessage
  );

  // Create a new room (as owner)
  const handleCreateRoom = (name) => {
    setUsername(name);
    send({ type: 'createRoom', username: name });
  };

  // Join an existing room
  const handleJoinRoom = (name, room) => {
    setUsername(name);
    setRoomId(room);
    send({ type: 'joinRoom', username: name, roomId: room });
  };

  // Handle clicking on a cell
  const handleCellClick = (boardIdx, cellIdx) => {
    // If game is not ready, or we're a spectator, or game is over, do nothing
    if (!isInRoom || isSpectator || gameWinner || gameTied || !gameStarted) return;

    // Check if it's our turn
    const isMyTurn = (xIsNext && playerSymbol === 'X') || (!xIsNext && playerSymbol === 'O');
    if (!isMyTurn) return;

    // Check if click is in the allowed board
    if (nextBoard !== null && nextBoard !== boardIdx) return;

    // Check if the sub-board is already completed
    const boardStatuses = getAllBoardStatuses(boards);
    if (boardStatuses[boardIdx] !== null) return;

    // Prevent clicking on an occupied cell
    if (boards[boardIdx][cellIdx] !== null) return;

    // Send the move to server
    send({ 
      type: 'move', 
      roomId, 
      boardIndex: boardIdx, 
      cellIndex: cellIdx, 
      symbol: playerSymbol 
    });

    // Don't update local state optimistically - wait for server confirmation
    // This prevents desync issues and ensures turn validation
  };

  // Handle board selection for completed sub-games
  const handleBoardSelection = (boardIndex) => {
    send({
      type: 'selectBoard',
      roomId,
      boardIndex,
      player: boardSelectionPlayer
    });
    setShowBoardSelection(false);
    setBoardSelectionPlayer(null);
  };

  // Handle game replay
  const handleReplay = (selectedPlayers) => {
    send({
      type: 'replayGame',
      roomId,
      players: selectedPlayers
    });
  };

  return (
    <>
      <ParticleBackground />
      <div className="App">
        {!isInRoom ? (
          <Lobby onCreate={handleCreateRoom} onJoin={handleJoinRoom} />
        ) : (
          <GameBoard
            boards={boards}
            nextBoard={nextBoard}
            onCellClick={handleCellClick}
            xIsNext={xIsNext}
            roomId={roomId}
            gameWinner={gameWinner}
            isGameTie={gameTied}
            playerSymbol={playerSymbol}
            gameStarted={gameStarted}
            players={players}
            isSpectator={isSpectator}
            username={username}
            showBoardSelection={showBoardSelection}
            onSelectBoard={handleBoardSelection}
            onCloseBoardSelection={() => setShowBoardSelection(false)}
            boardSelectionPlayer={boardSelectionPlayer}
            onReplay={handleReplay}
            isHost={isHost}
          />
        )}
      </div>
    </>
  );
}

export default App;