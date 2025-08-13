// @ts-nocheck
import React from 'react';

function PlayerCount({ players, currentUser, isSpectator }) {
  const activePlayers = players.filter(p => p.symbol);
  const spectators = players.filter(p => !p.symbol);

  return (
    <div className="player-count">
      <h3>Players in Room ({players.length})</h3>
      
      <div className="players-list">
        {activePlayers.map((player, index) => (
          <div key={player.username} className="player-item">
            <span className={player.username === currentUser ? 'current-user' : ''}>
              {player.username} {player.username === currentUser ? '(You)' : ''}
            </span>
            <div className={`player-symbol ${player.symbol}`}>
              {player.symbol}
            </div>
          </div>
        ))}
        
        {spectators.length > 0 && (
          <div className="spectators">
            <div className="spectator-count">
              👥 {spectators.length} Spectator{spectators.length > 1 ? 's' : ''}
            </div>
            {spectators.map(spectator => (
              <div key={spectator.username} className="player-item">
                <span className={spectator.username === currentUser ? 'current-user' : ''}>
                  {spectator.username} {spectator.username === currentUser ? '(You)' : ''}
                </span>
                <div className="player-symbol spectator">👁️</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerCount;