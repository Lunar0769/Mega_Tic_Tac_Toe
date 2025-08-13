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

  // Debug logging
  console.log('GameBoard render - showBoardSelection:', showBoardSelection, 'boardSelectionPlayer:', boardSelectionPlayer);

  return (
    <div className="game-container">
      {/* Main Game Area - Pure Game Board Only */}
      <div className="game-main">
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

      {/* Sidebar - All Game Info */}
      <div className="game-sidebar">
        {/* Room Info */}
        <div className="room-info">
          <div className="room-title">Room: {roomId}</div>
          <div className="player-info">
            {isSpectator ? (
              <span>{username} - Spectating</span>
            ) : (
              <span>{username} - Player {playerSymbol}</span>
            )}
          </div>
        </div>

        {/* Game Status */}
        <div className="game-status">
          {!gameStarted ? (
            <div className="waiting">
              Waiting for another player to join...
            </div>
          ) : gameWinner ? (
            <div className="game-winner">
              🎉 Player {gameWinner} wins! 🎉
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
                  <div className="board-instruction">
                    {nextBoard !== null 
                      ? `Play in board ${nextBoard + 1}` 
                      : 'Play in any available board'
                    }
                  </div>
                </>
              )}
            </>
          )}
          
          {/* Debug Info */}
          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '8px' }}>
            Debug: showModal={showBoardSelection.toString()}, selector={boardSelectionPlayer || 'none'}, mySymbol={playerSymbol || 'none'}
            <br />
            <button 
              onClick={() => {
                console.log('Manual board selection test - showing modal');
                // Temporarily show the modal for testing
                if (window.confirm('Show board selection modal for testing?')) {
                  // This is a hack for testing - we'll call the parent's state setter
                  console.log('Triggering board selection modal');
                }
              }}
              style={{ fontSize: '0.7rem', padding: '4px 8px', marginTop: '4px' }}
            >
              Test Modal
            </button>
          </div>
        </div>

        {/* Player Count */}
        <PlayerCount 
          players={players} 
          currentUser={username} 
          isSpectator={isSpectator} 
        />

        {/* Replay Controls */}
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