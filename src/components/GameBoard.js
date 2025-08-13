import React from 'react';
import SubBoard from './SubBoard';
import PlayerCount from './PlayerCount';
import ReplayControls from './ReplayControls';
import BoardSelectionModal from './BoardSelectionModal';
import { getAllBoardStatuses } from '../utils/gameLogic';

function GameBoard({ 
  boards, 
  nextBoard, 
  onCellClick, 
  xIsNext, 
  roomId, 
  gameWinner, 
  isGameTie, 
  playerSymbol, 
  gameStarted, 
  players, 
  isSpectator, 
  username,
  showBoardSelection,
  onSelectBoard,
  onCloseBoardSelection,
  boardSelectionPlayer,
  onReplay,
  isHost
}) {
  const boardStatuses = getAllBoardStatuses(boards);
  const isMyTurn = (xIsNext && playerSymbol === 'X') || (!xIsNext && playerSymbol === 'O');
  const gameEnded = gameWinner || isGameTie;

  return (
    <div className="game-container">
      {/* Main Game Area */}
      <div className="game-main">
        <div className="game-info-compact">
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
              Waiting for another player to join...
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
              {boardSelectionPlayer && !showBoardSelection ? (
                <div className="board-selection-waiting">
                  <div className="waiting-message">
                    ⏳ Player {boardSelectionPlayer} is choosing the next board...
                  </div>
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

      {/* Sidebar */}
      <div className="game-sidebar">
        <PlayerCount 
          players={players} 
          currentUser={username} 
          isSpectator={isSpectator} 
        />

        {gameEnded && (
          <ReplayControls
            players={players}
            isHost={isHost}
            onReplay={onReplay}
          />
        )}
      </div>

      {/* Board Selection Modal */}
      {showBoardSelection && (
        <BoardSelectionModal
          boards={boards}
          onSelectBoard={onSelectBoard}
          onClose={onCloseBoardSelection}
          currentPlayer={boardSelectionPlayer}
        />
      )}
    </div>
  );
}

export default GameBoard;