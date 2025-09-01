import React from 'react';

const BoardSelectionModal = ({ 
  isOpen, 
  onSelectBoard, 
  onClose, 
  playerName,
  availableBoards = []
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="board-selection-modal">
        <h3>Choose Next Board</h3>
        <p>{playerName}, select which board to play on next:</p>
        
        <div className="board-grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(boardIndex => (
            <button
              key={boardIndex}
              className={`board-option ${availableBoards.includes(boardIndex) ? 'available' : 'disabled'}`}
              onClick={() => availableBoards.includes(boardIndex) && onSelectBoard(boardIndex)}
              disabled={!availableBoards.includes(boardIndex)}
            >
              {boardIndex + 1}
            </button>
          ))}
        </div>
        
        <button className="close-modal" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BoardSelectionModal;