import React from 'react';
import Cell from './Cell';

function SubBoard({ cells, isActive, onCellClick }) {
  return (
    <div className={`sub-board${isActive ? '' : ' disabled'}`}>
      {cells.map((value, i) => (
        <Cell
          key={i}
          value={value}
          onClick={() => onCellClick(i)}
          disabled={!isActive || value !== null}
        />
      ))}
    </div>
  );
}

export default SubBoard;