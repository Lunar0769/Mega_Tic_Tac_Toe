import React, { useState } from 'react';

function Lobby({ onCreate, onJoin }) {
  const [name, setName] = useState('');
  const [roomInput, setRoomInput] = useState('');

  return (
    <div className="lobby">
      <div className="lobby-header">
        <h1>Mega Tic Tac Toe</h1>
        <p className="lobby-subtitle">Ultimate multiplayer strategy game</p>
        <div className="lobby-description">
          <p>🎯 Play on 9 interconnected boards</p>
          <p>🧠 Strategic moves determine opponent's next board</p>
          <p>🏆 Win by conquering three boards in a row</p>
        </div>
      </div>
      
      <div className="lobby-form">
        <div className="input-group">
          <label>Enter Your Name</label>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="lobby-input"
          />
        </div>
        
        <div className="lobby-actions">
          <button
            className="primary-button"
            onClick={() => {
              if (name.trim()) {
                onCreate(name.trim());
              }
            }}
            disabled={!name.trim()}
          >
            🎮 Create New Room
          </button>
          
          <div className="divider">
            <span>OR</span>
          </div>
          
          <div className="input-group">
            <label>Join Existing Room</label>
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomInput}
              onChange={e => setRoomInput(e.target.value)}
              className="lobby-input"
            />
          </div>
          
          <button
            className="secondary-button"
            onClick={() => {
              if (name.trim() && roomInput.trim()) {
                onJoin(name.trim(), roomInput.trim());
              }
            }}
            disabled={!name.trim() || !roomInput.trim()}
          >
            🚪 Join Room
          </button>
        </div>
      </div>
      
      <div className="lobby-footer">
        <p>💡 Share the Room ID with friends to play together!</p>
      </div>
    </div>
  );
}

export default Lobby;