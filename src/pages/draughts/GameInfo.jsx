import React from 'react';

// Constants for game pieces
const WHITE = 1;

function GameInfo({ currentPlayer, gameStatus, moveHistory }) {
  const renderGameStatus = () => {
    switch (gameStatus) {
      case 'white-win':
        return <div className="game-result white-win">White Wins!</div>;
      case 'black-win':
        return <div className="game-result black-win">Black Wins!</div>;
      case 'draw':
        return <div className="game-result draw">Game Drawn</div>;
      default:
        return (
          <div className="current-player">
            Current Player:
            <span className={currentPlayer === WHITE ? 'white-text' : 'black-text'}>
              {currentPlayer === WHITE ? ' White' : ' Black'}
            </span>
          </div>
        );
    }
  };

  const formatMove = (move, index) => {
    const fromCol = String.fromCharCode(97 + move.from.col); // Convert to a, b, c, etc.
    const fromRow = 8 - move.from.row; // Convert to 1-8, inverted
    const toCol = String.fromCharCode(97 + move.to.col);
    const toRow = 8 - move.to.row;

    return (
      <div key={index} className={`move ${move.player === WHITE ? 'white-move' : 'black-move'}`}>
        {index + 1}. {move.player === WHITE ? 'White' : 'Black'}: {fromCol}{fromRow} → {toCol}{toRow}
      </div>
    );
  };

  return (
    <div className="card">
      <h2>Game Info</h2>

      {renderGameStatus()}

      <div className="move-history">
        <h3>Move History</h3>
        <div className="moves-list">
          {moveHistory.length === 0 ? (
            <div className="no-moves">No moves yet</div>
          ) : (
            moveHistory.map((move, index) => formatMove(move, index))
          )}
        </div>
      </div>
    </div>
  );
}

export default GameInfo;
