// @ts-nocheck
import React from 'react';
import { getAllBoardStatuses } from '../utils/gameLogic';

function BoardSelectionModal({ boards, onSelectBoard, onClose, currentPlayer }) {
  const boardStatuses = getAllBoardStatuses(boards);

  const handleBoardSelect = (boardIndex) => {
    if (boardStatuses[boardIndex] === null) {
      onSelectBoard(boardIndex);
      onClose();
    }
  };

  return (
    <div className="board-selection-modal" onClick={onClose}>
      <div className="board-selection-content" onClick={e => e.stopPropagation()}>
        <h3>Choose a Board to Play</h3>
        <p>Player {currentPlayer}, select which board your opponent should play in:</p>
        
        <div className="board-selection-grid">
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className={`board-selection-cell ${boardStatuses[index] !== null ? 'completed' : ''}`}
              onClick={() => handleBoardSelect(index)}
            >
              {boardStatuses[index] === 'tie' ? 'TIE' : boardStatuses[index] || (index + 1)}
            </div>
          ))}
        </div>
        
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '16px' }}>
          Click on an available board (grayed out boards are completed)
        </p>
      </div>
    </div>
  );
}

export default BoardSelectionModal;