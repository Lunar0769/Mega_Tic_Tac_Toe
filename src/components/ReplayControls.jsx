import React from 'react';

const ReplayControls = ({ isHost, onReplay, gameStarted, players }) => {
  if (!isHost) return null;

  const activePlayers = players.filter(p => p.symbol);
  const canStartGame = activePlayers.length >= 2;

  return (
    <div className="replay-controls">
      {!gameStarted ? (
        <button 
          className="start-game-btn"
          onClick={onReplay}
          disabled={!canStartGame}
        >
          {canStartGame ? 'Start Game' : `Waiting for players (${activePlayers.length}/2)`}
        </button>
      ) : (
        <button 
          className="new-game-btn"
          onClick={onReplay}
        >
          Start New Game
        </button>
      )}
    </div>
  );
};

export default ReplayControls;