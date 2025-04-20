import React, { useState, useEffect } from 'react';
import DraughtsBoard from './DraughtsBoard';
import GameControls from './GameControls';
import GameInfo from './GameInfo';
import MinimaxStateTree from './MinimaxStateTree';
import { minimax } from '../../algorithms/MiniMax/minimax';
import { minimaxWithTracking } from '../../algorithms/MiniMax/minimaxTracker';

// Constants for game pieces
const EMPTY = 0;
const WHITE = 1;
const WHITE_KING = 2;
const BLACK = 3;
const BLACK_KING = 4;

// Game modes
const PLAYER_VS_AI = 'player-vs-ai';
const AI_VS_RANDOM = 'ai-vs-random';

function DraughtsPage() {
  // Game state
  const [board, setBoard] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(WHITE); // White starts
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [gameMode, setGameMode] = useState(PLAYER_VS_AI);
  const [gameStatus, setGameStatus] = useState('ongoing'); // 'ongoing', 'white-win', 'black-win', 'draw'
  const [moveHistory, setMoveHistory] = useState([]);
  const [searchDepth, setSearchDepth] = useState(4); // Default search depth for minimax

  // Initialize the board
  useEffect(() => {
    initializeBoard();
  }, []);

  // AI move logic
  useEffect(() => {
    if (!board) return;

    // Determine if AI should move
    const isAITurn =
      (gameMode === PLAYER_VS_AI && currentPlayer === BLACK) || // AI plays as BLACK in Player vs AI
      (gameMode === AI_VS_RANDOM && currentPlayer === WHITE);   // AI plays as WHITE in AI vs Random

    // Random bot moves are now triggered by button click, not automatically

    if (isAITurn) {
      // Small delay to make AI moves visible
      const timer = setTimeout(() => {
        makeAIMove();
      }, 800); // Increased delay to give more time to see the board state

      return () => clearTimeout(timer);
    }
  }, [board, currentPlayer, gameMode]);

  // Check for game over
  useEffect(() => {
    if (board) {
      checkGameOver();
    }
  }, [board, currentPlayer]);

  const initializeBoard = () => {
    // Create an 8x8 board
    const newBoard = Array(8).fill().map(() => Array(8).fill(EMPTY));

    // Set up black pieces (top of board)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) { // Only place pieces on black squares
          newBoard[row][col] = BLACK;
        }
      }
    }

    // Set up white pieces (bottom of board)
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) { // Only place pieces on black squares
          newBoard[row][col] = WHITE;
        }
      }
    }

    setBoard(newBoard);
    setCurrentPlayer(WHITE);
    setSelectedPiece(null);
    setValidMoves([]);
    setGameStatus('ongoing');
    setMoveHistory([]);
  };

  const selectPiece = (row, col) => {
    if (gameStatus !== 'ongoing') return;

    // In player vs AI mode, player can only move white pieces
    if (gameMode === PLAYER_VS_AI && currentPlayer === BLACK) return;

    // In AI vs random mode, player cannot move pieces
    if (gameMode === AI_VS_RANDOM) return;

    const piece = board[row][col];

    // Check if the piece belongs to the current player
    if ((currentPlayer === WHITE && (piece === WHITE || piece === WHITE_KING)) ||
      (currentPlayer === BLACK && (piece === BLACK || piece === BLACK_KING))) {
      setSelectedPiece({ row, col });
      setValidMoves(getValidMoves(row, col, board, currentPlayer));
    }
  };

  const movePiece = (fromRow, fromCol, toRow, toCol) => {
    if (gameStatus !== 'ongoing') return;

    const newBoard = board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol];

    // Move the piece
    newBoard[fromRow][fromCol] = EMPTY;
    newBoard[toRow][toCol] = piece;

    // Check if the piece should be promoted to king
    if (piece === WHITE && toRow === 0) {
      newBoard[toRow][toCol] = WHITE_KING;
    } else if (piece === BLACK && toRow === 7) {
      newBoard[toRow][toCol] = BLACK_KING;
    }

    // Check if this was a capture move
    if (Math.abs(fromRow - toRow) === 2) {
      const captureRow = (fromRow + toRow) / 2;
      const captureCol = (fromCol + toCol) / 2;
      newBoard[captureRow][captureCol] = EMPTY;

      // Check if there are additional captures available
      const additionalCaptures = getValidCaptures(toRow, toCol, newBoard, currentPlayer);
      if (additionalCaptures.length > 0) {
        setBoard(newBoard);
        setSelectedPiece({ row: toRow, col: toCol });
        setValidMoves(additionalCaptures);
        return; // Don't switch turns yet
      }
    }

    // Record the move
    setMoveHistory([...moveHistory, {
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      player: currentPlayer
    }]);

    // Update the board and switch turns
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === WHITE ? BLACK : WHITE);
    setSelectedPiece(null);
    setValidMoves([]);
  };

  const makeRandomMove = () => {
    if (gameStatus !== 'ongoing' || currentPlayer !== BLACK || gameMode !== AI_VS_RANDOM) return;

    // Get all valid moves for the random bot (BLACK)
    const allMoves = getAllValidMoves(board, BLACK);
    if (allMoves.length > 0) {
      // Use a more robust random selection with timestamp
      const seed = Date.now() + Math.random();
      const randomIndex = Math.floor(seed % allMoves.length);
      const randomMove = allMoves[randomIndex];

      console.log('Random bot selected move:', randomMove, 'from', allMoves.length, 'possible moves');

      // Make the move
      movePiece(randomMove.from.row, randomMove.from.col, randomMove.to.row, randomMove.to.col);
    }
  };

  const makeAIMove = () => {
    if (gameStatus !== 'ongoing') return;

    // Determine which player is moving (AI or random bot)
    const isRandomBot = gameMode === AI_VS_RANDOM && currentPlayer === BLACK;
    const playerToMove = currentPlayer; // Use the current player
    const opponentPlayer = playerToMove === WHITE ? BLACK : WHITE;

    // Use minimax to find the best move for AI
    const depth = searchDepth;

    let bestMove;
    if (isRandomBot) {
      // In manual mode, don't make random moves automatically
      // They will be triggered by the button
      return;
    } else {
      // AI uses minimax
      const result = minimax(board, depth, playerToMove, opponentPlayer, -Infinity, Infinity, true);
      bestMove = result.move;
      console.log('AI selected move using minimax:', bestMove);
    }

    if (bestMove) {
      movePiece(bestMove.from.row, bestMove.from.col, bestMove.to.row, bestMove.to.col);
    }
  };

  const getValidMoves = (row, col, board, player) => {
    const piece = board[row][col];
    const moves = [];

    // Check for captures first (mandatory in checkers)
    const captures = getValidCaptures(row, col, board, player);
    if (captures.length > 0) {
      return captures;
    }

    // Direction of movement depends on piece type
    const directions = [];
    if (piece === WHITE || piece === WHITE_KING || piece === BLACK_KING) {
      directions.push({ row: -1, col: -1 }, { row: -1, col: 1 }); // Up-left, Up-right
    }
    if (piece === BLACK || piece === BLACK_KING || piece === WHITE_KING) {
      directions.push({ row: 1, col: -1 }, { row: 1, col: 1 }); // Down-left, Down-right
    }

    // Check each direction for valid moves
    for (const dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;

      if (isValidPosition(newRow, newCol) && board[newRow][newCol] === EMPTY) {
        moves.push({ row: newRow, col: newCol });
      }
    }

    return moves;
  };

  const getValidCaptures = (row, col, board, player) => {
    const piece = board[row][col];
    const captures = [];

    // Direction of movement depends on piece type
    const directions = [];
    if (piece === WHITE || piece === WHITE_KING || piece === BLACK_KING) {
      directions.push({ row: -1, col: -1 }, { row: -1, col: 1 }); // Up-left, Up-right
    }
    if (piece === BLACK || piece === BLACK_KING || piece === WHITE_KING) {
      directions.push({ row: 1, col: -1 }, { row: 1, col: 1 }); // Down-left, Down-right
    }

    // Check each direction for valid captures
    for (const dir of directions) {
      const jumpRow = row + dir.row;
      const jumpCol = col + dir.col;
      const landRow = row + 2 * dir.row;
      const landCol = col + 2 * dir.col;

      if (isValidPosition(jumpRow, jumpCol) && isValidPosition(landRow, landCol)) {
        const jumpPiece = board[jumpRow][jumpCol];

        // Check if there's an opponent's piece to jump over
        if (((player === WHITE && (jumpPiece === BLACK || jumpPiece === BLACK_KING)) ||
          (player === BLACK && (jumpPiece === WHITE || jumpPiece === WHITE_KING))) &&
          board[landRow][landCol] === EMPTY) {
          captures.push({ row: landRow, col: landCol });
        }
      }
    }

    return captures;
  };

  const getAllValidMoves = (board, player) => {
    const moves = [];

    // Check all pieces for the current player
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if ((player === WHITE && (piece === WHITE || piece === WHITE_KING)) ||
          (player === BLACK && (piece === BLACK || piece === BLACK_KING))) {

          // Get valid moves for this piece
          const pieceMoves = getValidMoves(row, col, board, player);

          // Add to the list of all moves
          for (const move of pieceMoves) {
            moves.push({
              from: { row, col },
              to: move
            });
          }
        }
      }
    }

    return moves;
  };

  const isValidPosition = (row, col) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  const checkGameOver = () => {
    // Check if current player has any valid moves
    const allMoves = getAllValidMoves(board, currentPlayer);

    if (allMoves.length === 0) {
      // Current player has no valid moves
      if (currentPlayer === WHITE) {
        setGameStatus('black-win');
      } else {
        setGameStatus('white-win');
      }
      return;
    }

    // Check if there are any pieces left
    let whiteCount = 0;
    let blackCount = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece === WHITE || piece === WHITE_KING) {
          whiteCount++;
        } else if (piece === BLACK || piece === BLACK_KING) {
          blackCount++;
        }
      }
    }

    if (whiteCount === 0) {
      setGameStatus('black-win');
    } else if (blackCount === 0) {
      setGameStatus('white-win');
    }

    // Check for draw (could add more sophisticated draw detection)
    if (moveHistory.length > 100) { // Simple draw after 100 moves
      setGameStatus('draw');
    }
  };

  const handleGameModeChange = (mode) => {
    setGameMode(mode);
    initializeBoard(); // Reset the game when changing modes
  };

  const handleSearchDepthChange = (depth) => {
    setSearchDepth(parseInt(depth, 10));
  };

  return (
    <div>
      <header>
        <h1>Draughts (Checkers) Game</h1>
        <p>
          Play against AI using the Minimax algorithm with Alpha-Beta pruning
        </p>
      </header>

      <div className="grid">
        <div>
          <DraughtsBoard
            board={board}
            selectedPiece={selectedPiece}
            validMoves={validMoves}
            onSelectPiece={selectPiece}
            onMovePiece={movePiece}
          />

          <MinimaxStateTree
            board={board}
            currentPlayer={currentPlayer}
            searchDepth={searchDepth}
          />
        </div>

        <div>
          <GameInfo
            currentPlayer={currentPlayer}
            gameStatus={gameStatus}
            moveHistory={moveHistory}
          />

          <GameControls
            gameMode={gameMode}
            searchDepth={searchDepth}
            currentPlayer={currentPlayer}
            onGameModeChange={handleGameModeChange}
            onSearchDepthChange={handleSearchDepthChange}
            onResetGame={initializeBoard}
            onMakeRandomMove={makeRandomMove}
          />
        </div>
      </div>
    </div>
  );
}

export default DraughtsPage;
