import React, { useState } from 'react';

function Lobby({ onCreate, onJoin }) {
  const [name, setName] = useState('');
  const [roomInput, setRoomInput] = useState('');

  return (
    <div className="lobby">
      <h2>Create or Join a Room</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button
        onClick={() => {
          if (name.trim()) {
            onCreate(name.trim());
          }
        }}
      >
        Create Room
      </button>

      <hr />

      <input
        type="text"
        placeholder="Room ID"
        value={roomInput}
        onChange={e => setRoomInput(e.target.value)}
      />
      <button
        onClick={() => {
          if (name.trim() && roomInput.trim()) {
            onJoin(name.trim(), roomInput.trim());
          }
        }}
      >
        Join Room
      </button>
    </div>
  );
}

export default Lobby;