import React from 'react';

// Game modes
const PLAYER_VS_AI = 'player-vs-ai';
const AI_VS_RANDOM = 'ai-vs-random';

// Game pieces constants
const BLACK = 3;

function GameControls({ gameMode, searchDepth, currentPlayer, onGameModeChange, onSearchDepthChange, onResetGame, onMakeRandomMove }) {
  return (
    <div className="card">
      <h2>Game Controls</h2>

      <div className="control-group">
        <label>Game Mode:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value={PLAYER_VS_AI}
              checked={gameMode === PLAYER_VS_AI}
              onChange={() => onGameModeChange(PLAYER_VS_AI)}
            />
            Player vs AI
          </label>
          <label>
            <input
              type="radio"
              value={AI_VS_RANDOM}
              checked={gameMode === AI_VS_RANDOM}
              onChange={() => onGameModeChange(AI_VS_RANDOM)}
            />
            AI vs Random Bot
          </label>
        </div>
      </div>

      <div className="control-group">
        <label>AI Search Depth:</label>
        <select
          value={searchDepth}
          onChange={(e) => onSearchDepthChange(e.target.value)}
        >
          <option value="2">2 (Fast, Weak)</option>
          <option value="3">3</option>
          <option value="4">4 (Balanced)</option>
          <option value="5">5</option>
          <option value="6">6 (Slow, Strong)</option>
        </select>
        <p className="depth-info">
          Higher depth means stronger AI but slower moves.
          <br />
          Recommended: 4 for balanced play.
        </p>
      </div>

      <div className="buttons-container">
        <button
          onClick={onResetGame}
          className="reset-button"
        >
          Reset Game
        </button>

        {gameMode === AI_VS_RANDOM && (
          <div className="random-move-container">
            <button
              onClick={onMakeRandomMove}
              className="random-move-button"
              disabled={currentPlayer !== BLACK}
            >
              Make Random Move
            </button>
            {currentPlayer !== BLACK && (
              <div className="button-info">Wait for AI's move</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default GameControls;
