import React from 'react';
import SubBoard from './SubBoard';

function GameBoard({ boards, nextBoard, onCellClick }) {
  return (
    <div className="mega-board">
      {boards.map((cells, boardIdx) => (
        <SubBoard
          key={boardIdx}
          cells={cells}
          isActive={nextBoard === null || nextBoard === boardIdx}
          onCellClick={cellIdx => onCellClick(boardIdx, cellIdx)}
        />
      ))}
    </div>
  );
}

export default GameBoard;