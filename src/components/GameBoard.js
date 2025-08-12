import React from 'react';
import SubBoard from './SubBoard';
import { getAllBoardStatuses } from '../utils/gameLogic';

function GameBoard({ boards, nextBoard, onCellClick, xIsNext, roomId, gameWinner, isGameTie, playerSymbol, gameStarted, players, isSpectator, username }) {
  const boardStatuses = getAllBoardStatuses(boards);
  const isMyTurn = (xIsNext && playerSymbol === 'X') || (!xIsNext && playerSymbol === 'O');

  return (
    <div>
      <div className="game-info">
        <div>Room: {roomId}</div>
        <div className="player-info">
          {isSpectator ? (
            <span>{username} - Spectating</span>
          ) : (
            <span>{username} - Player {playerSymbol}</span>
          )}
        </div>
        {!gameStarted ? (
          <div className="waiting">
            Waiting for another player to join... (Debug: gameStarted={gameStarted.toString()}, players={players.length})
            <br />
            <button onClick={() => console.log('Current state:', { gameStarted, players, playerSymbol, isSpectator })}>
              Debug State
            </button>
          </div>
        ) : gameWinner ? (
          <div className="game-winner">
            🎉 Player {gameWinner} wins the game! 🎉
          </div>
        ) : isGameTie ? (
          <div className="game-tie">
            🤝 Game is a tie! 🤝
          </div>
        ) : (
          <>
            <div className={`turn-indicator ${isMyTurn ? 'my-turn' : 'opponent-turn'}`}>
              {isMyTurn ? 'Your turn' : `Player ${xIsNext ? 'X' : 'O'}'s turn`}
            </div>
            <div>
              {nextBoard !== null 
                ? `Play in board ${nextBoard + 1}` 
                : 'Play in any available board'
              }
            </div>
          </>
        )}
      </div>
      <div className="mega-board">
        {boards.map((cells, boardIdx) => (
          <SubBoard
            key={boardIdx}
            cells={cells}
            isActive={!gameWinner && !isGameTie && (nextBoard === null || nextBoard === boardIdx)}
            onCellClick={cellIdx => onCellClick(boardIdx, cellIdx)}
            canClick={isMyTurn && gameStarted && !isSpectator}
            boardStatus={boardStatuses[boardIdx]}
          />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;