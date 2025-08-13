// @ts-nocheck
import React, { useState } from 'react';

function ReplayControls({ players, isHost, onReplay }) {
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const activePlayers = players.filter(p => p.symbol);
  const availablePlayers = players.filter(p => p.username); // All players including spectators

  const handlePlayerToggle = (player) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.find(p => p.username === player.username);
      if (isSelected) {
        return prev.filter(p => p.username !== player.username);
      } else if (prev.length < 2) {
        return [...prev, player];
      }
      return prev;
    });
  };

  const handleReplay = () => {
    if (selectedPlayers.length === 2) {
      onReplay(selectedPlayers);
    }
  };

  if (!isHost) {
    return (
      <div className="replay-controls">
        <h3>Game Over!</h3>
        <p>Waiting for host to start a new game...</p>
      </div>
    );
  }

  return (
    <div className="replay-controls">
      <h3>🎮 Start New Game</h3>
      <p>Select 2 players for the next game:</p>
      
      <div className="player-selection">
        {availablePlayers.map(player => (
          <div
            key={player.username}
            className={`player-option ${selectedPlayers.find(p => p.username === player.username) ? 'selected' : ''}`}
            onClick={() => handlePlayerToggle(player)}
          >
            <span>{player.username}</span>
            <span>
              {selectedPlayers.find(p => p.username === player.username) 
                ? selectedPlayers.findIndex(p => p.username === player.username) === 0 ? '❌' : '⭕'
                : '⚪'
              }
            </span>
          </div>
        ))}
      </div>
      
      <button
        className="replay-button"
        onClick={handleReplay}
        disabled={selectedPlayers.length !== 2}
        style={{
          opacity: selectedPlayers.length === 2 ? 1 : 0.5,
          cursor: selectedPlayers.length === 2 ? 'pointer' : 'not-allowed'
        }}
      >
        Start New Game ({selectedPlayers.length}/2 players selected)
      </button>
    </div>
  );
}

export default ReplayControls;