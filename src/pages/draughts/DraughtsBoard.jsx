import React from 'react';

// Constants for game pieces
const EMPTY = 0;
const WHITE = 1;
const WHITE_KING = 2;
const BLACK = 3;
const BLACK_KING = 4;

function DraughtsBoard({ board, selectedPiece, validMoves, onSelectPiece, onMovePiece }) {
  if (!board) return <div>Loading...</div>;
  
  const handleCellClick = (row, col) => {
    // If a piece is already selected and the clicked cell is a valid move
    if (selectedPiece && validMoves.some(move => move.row === row && move.col === col)) {
      onMovePiece(selectedPiece.row, selectedPiece.col, row, col);
    } else {
      // Otherwise, try to select a piece
      onSelectPiece(row, col);
    }
  };
  
  const isValidMove = (row, col) => {
    return validMoves.some(move => move.row === row && move.col === col);
  };
  
  const renderPiece = (piece) => {
    switch (piece) {
      case WHITE:
        return <div className="piece white"></div>;
      case WHITE_KING:
        return <div className="piece white king"></div>;
      case BLACK:
        return <div className="piece black"></div>;
      case BLACK_KING:
        return <div className="piece black king"></div>;
      default:
        return null;
    }
  };
  
  return (
    <div className="card">
      <h2>Game Board</h2>
      <div className="draughts-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => {
              const isBlackSquare = (rowIndex + colIndex) % 2 === 1;
              const isSelected = selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex;
              const isValidMoveSquare = isValidMove(rowIndex, colIndex);
              
              return (
                <div
                  key={colIndex}
                  className={`board-cell ${isBlackSquare ? 'black-square' : 'white-square'} 
                             ${isSelected ? 'selected' : ''} 
                             ${isValidMoveSquare ? 'valid-move' : ''}`}
                  onClick={() => isBlackSquare ? handleCellClick(rowIndex, colIndex) : null}
                >
                  {renderPiece(cell)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="board-labels">
        <div className="col-labels">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((label, index) => (
            <div key={index} className="label">{label}</div>
          ))}
        </div>
        <div className="row-labels">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((label, index) => (
            <div key={index} className="label">{label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DraughtsBoard;
