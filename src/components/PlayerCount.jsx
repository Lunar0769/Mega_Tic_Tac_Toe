import React from 'react';

const PlayerCount = ({ players, username, isSpectator }) => {
  const activePlayers = players.filter(p => p.symbol);
  const spectators = players.filter(p => !p.symbol);

  return (
    <div className="player-count">
      <div className="players-section">
        <h3>Players ({activePlayers.length}/2)</h3>
        <div className="players-list">
          {activePlayers.map((player, index) => (
            <div 
              key={index} 
              className={`player-item ${player.username === username ? 'current-user' : ''}`}
            >
              <span className="player-symbol">{player.symbol}</span>
              <span className="player-name">{player.username}</span>
              {player.isHost && <span className="host-badge">HOST</span>}
            </div>
          ))}
        </div>
      </div>
      
      {spectators.length > 0 && (
        <div className="spectators-section">
          <h3>Spectators ({spectators.length})</h3>
          <div className="spectators-list">
            {spectators.map((spectator, index) => (
              <div 
                key={index} 
                className={`spectator-item ${spectator.username === username ? 'current-user' : ''}`}
              >
                <span className="spectator-name">{spectator.username}</span>
                {spectator.isHost && <span className="host-badge">HOST</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCount;