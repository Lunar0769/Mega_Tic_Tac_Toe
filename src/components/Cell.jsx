import React from 'react';

function Cell({ value, onClick, disabled }) {
  return (
    <button className="cell" onClick={onClick} disabled={disabled}>
      {value}
    </button>
  );
}

export default Cell;