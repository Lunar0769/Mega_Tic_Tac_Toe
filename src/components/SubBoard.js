import React from 'react';
import Cell from './Cell';

function SubBoard({ cells, isActive, onCellClick, boardStatus, canClick = true }) {
  const isCompleted = boardStatus !== null;
  
  return (
    <div className={`sub-board ${isActive && canClick ? 'active' : 'disabled'} ${isCompleted ? 'completed' : ''} ${!canClick ? 'not-my-turn' : ''}`}>
      {isCompleted ? (
        <div className="board-winner">
          {boardStatus === 'tie' ? 'TIE' : boardStatus}
        </div>
      ) : (
        cells.map((value, i) => (
          <Cell
            key={i}
            value={value}
            onClick={() => onCellClick(i)}
            disabled={!isActive || value !== null || isCompleted || !canClick}
          />
        ))
      )}
    </div>
  );
}

export default SubBoard;