import React, { useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';

function App() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [isSpectator, setIsSpectator] = useState(false);
  const [xIsNext, setXIsNext] = useState(true);
  const [nextBoard, setNextBoard] = useState(null); // 0-8 or null for any
  const initialBoards = Array.from({ length: 9 }, () => Array(9).fill(null));
  const [boards, setBoards] = useState(initialBoards);

  // Handle incoming WebSocket messages
  const handleMessage = (data) => {
    switch (data.type) {
      case 'roomCreated':
        setRoomId(data.roomId);
        setIsInRoom(true);
        break;
      case 'joinSuccess':
        setIsInRoom(true);
        break;
      case 'spectateApproved':
        setIsSpectator(true);
        setIsInRoom(true);
        break;
      case 'move': {
        const { boardIndex, cellIndex, symbol } = data;
        setBoards(prev => {
          const newBoards = prev.map(arr => arr.slice());
          newBoards[boardIndex][cellIndex] = symbol;
          return newBoards;
        });
        // Next board logic
        const target = cellIndex;
        const targetBoard = boards[target];
        const isTargetFilled = !targetBoard?.some(cell => cell === null);
        setNextBoard(isTargetFilled ? null : target);
        setXIsNext(symbol === 'O');
        break;
      }
      default:
        break;
    }
  };

  // Use WebSocket hook (point to your server)
  const { send } = useWebSocket('ws://localhost:4000', handleMessage);

  // Room creation
  const handleCreateRoom = (name) => {
    setUsername(name);
    send({ type: 'createRoom', username: name });
  };

  // Room join
  const handleJoinRoom = (name, room) => {
    setUsername(name);
    setRoomId(room);
    send({ type: 'joinRoom', username: name, roomId: room });
  };

  // On cell click, send move and update local state
  const handleCellClick = (boardIdx, cellIdx) => {
    if (!isInRoom || isSpectator) return;
    if (nextBoard !== null && nextBoard !== boardIdx) return;
    if (boards[boardIdx][cellIdx] !== null) return;
    const symbol = xIsNext ? 'X' : 'O';
    send({ type: 'move', roomId, boardIndex: boardIdx, cellIndex: cellIdx, symbol });
    setBoards(prev => {
      const newBoards = prev.map(arr => arr.slice());
      newBoards[boardIdx][cellIdx] = symbol;
      return newBoards;
    });
    // Next board logic
    const target = cellIdx;
    const targetBoard = boards[target];
    const isTargetFilled = targetBoard?.every(cell => cell !== null);
    setNextBoard(isTargetFilled ? null : target);
    setXIsNext(!xIsNext);
  };

  return (
    <div className="App">
      {!isInRoom ? (
        <Lobby onCreate={handleCreateRoom} onJoin={handleJoinRoom} />
      ) : (
        <GameBoard
          boards={boards}
          nextBoard={nextBoard}
          onCellClick={handleCellClick}
        />
      )}
    </div>
  );
}

export default App;