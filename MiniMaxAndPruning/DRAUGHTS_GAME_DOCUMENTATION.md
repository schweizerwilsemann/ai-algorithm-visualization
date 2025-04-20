# Draughts Game with Minimax AI

This document provides a comprehensive explanation of the Draughts (Checkers) game implementation, including the game rules, board representation, and the Minimax algorithm used for the AI opponent.

## Table of Contents

1. [Game Overview](#game-overview)
2. [Game Rules](#game-rules)
3. [Board Representation](#board-representation)
4. [Game Mechanics](#game-mechanics)
5. [AI Implementation](#ai-implementation)
   - [Minimax Algorithm](#minimax-algorithm)
   - [Alpha-Beta Pruning](#alpha-beta-pruning)
   - [Board Evaluation](#board-evaluation)
6. [Visualization Features](#visualization-features)
   - [Minimax Search Tree](#minimax-search-tree)
   - [Search Depth](#search-depth)
7. [Code Structure](#code-structure)

## Game Overview

This application implements the game of Draughts (also known as Checkers in American English), a two-player board game played on an 8×8 checkered board. The game features:

- Player vs AI mode
- AI vs Random Bot mode
- Adjustable AI difficulty (search depth)
- Visualization of the AI's decision-making process

## Game Rules

The game follows standard international draughts rules:

1. **Board Setup**: The game is played on an 8×8 board with alternating dark and light squares. Each player starts with 12 pieces placed on the dark squares of the three rows closest to them.

2. **Piece Movement**:
   - Regular pieces move diagonally forward one square
   - Kings (crowned pieces) can move diagonally forward or backward
   - Pieces capture by jumping over an opponent's piece to an empty square beyond

3. **Captures**:
   - Captures are mandatory
   - Multiple captures in a single turn are allowed and required when possible
   - After a capture, the captured piece is removed from the board

4. **Promotion**: When a piece reaches the opponent's back row, it is promoted to a king, which can move and capture diagonally in any direction.

5. **Winning**: A player wins by capturing all of the opponent's pieces or by leaving the opponent with no legal moves.

## Board Representation

The game board is represented as an 8×8 two-dimensional array with the following values:

```javascript
const EMPTY = 0;
const WHITE = 1;
const WHITE_KING = 2;
const BLACK = 3;
const BLACK_KING = 4;
```

The board is oriented with row 0 at the top and row 7 at the bottom. White pieces move upward (decreasing row numbers), and black pieces move downward (increasing row numbers).

## Game Mechanics

### Piece Selection and Movement

The game allows players to:
1. Select a piece by clicking on it
2. View valid moves highlighted on the board
3. Move the selected piece by clicking on a valid destination square

### Valid Moves

The `getValidMoves` function determines all legal moves for a piece:

```javascript
const getValidMoves = (row, col, board, player) => {
  // Check for captures first (mandatory in checkers)
  const captures = getValidCaptures(row, col, board, player);
  if (captures.length > 0) {
    return captures;
  }

  // If no captures, return regular moves
  // Direction depends on piece type (regular or king)
  // ...
};
```

### Capturing

Captures are mandatory in Draughts. The `getValidCaptures` function identifies all possible capture moves:

```javascript
const getValidCaptures = (row, col, board, player) => {
  // Check all possible capture directions
  // For each direction, check if there's an opponent's piece
  // and an empty square beyond it
  // ...
};
```

### Promotion to King

Pieces are automatically promoted to kings when they reach the opponent's back row:

```javascript
// Check if the piece should be promoted to king
if (piece === WHITE && toRow === 0) {
  newBoard[toRow][toCol] = WHITE_KING;
} else if (piece === BLACK && toRow === 7) {
  newBoard[toRow][toCol] = BLACK_KING;
}
```

## AI Implementation

The AI uses the Minimax algorithm with Alpha-Beta pruning to determine the best move.

### Minimax Algorithm

Minimax is a decision-making algorithm used in two-player games to find the optimal move. It works by:

1. Building a game tree of all possible future moves
2. Evaluating the final positions using a heuristic function
3. Working backward to determine the best move, assuming both players play optimally

The implementation recursively explores the game tree to a specified depth:

```javascript
export function minimax(board, depth, player, opponent, alpha, beta, isMaximizingPlayer) {
  // Base case: depth reached or game over
  if (depth === 0) {
    return { score: evaluateBoard(board, player, opponent), move: null };
  }
  
  // Get all valid moves for the current player
  const allMoves = getAllValidMoves(board, isMaximizingPlayer ? player : opponent);
  
  // If no moves are available, this is a terminal state
  if (allMoves.length === 0) {
    return { 
      score: isMaximizingPlayer ? -1000 : 1000, 
      move: null 
    };
  }
  
  // Recursive exploration of the game tree
  // ...
}
```

### Alpha-Beta Pruning

Alpha-Beta pruning is an optimization technique that reduces the number of nodes evaluated in the minimax algorithm. It works by:

1. Keeping track of the best already-explored option for the maximizing player (alpha)
2. Keeping track of the best already-explored option for the minimizing player (beta)
3. Skipping evaluation of moves that cannot possibly be better than already-explored options

```javascript
// In maximizing player's turn
alpha = Math.max(alpha, maxScore);
if (beta <= alpha) {
  break; // Prune the remaining moves
}

// In minimizing player's turn
beta = Math.min(beta, minScore);
if (beta <= alpha) {
  break; // Prune the remaining moves
}
```

### Board Evaluation

The AI evaluates board positions using several heuristics:

```javascript
function evaluateBoard(board, player, opponent) {
  let score = 0;
  
  // 1. Piece values - Kings are worth more than regular pieces
  const pieceValues = {
    [WHITE]: player === WHITE ? 10 : -10,
    [WHITE_KING]: player === WHITE ? 15 : -15,
    [BLACK]: player === BLACK ? 10 : -10,
    [BLACK_KING]: player === BLACK ? 15 : -15
  };
  
  // 2. Position values - Center squares are more valuable than edge squares
  const positionValues = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 2, 2, 2, 2, 1, 0],
    [0, 1, 2, 3, 3, 2, 1, 0],
    [0, 1, 2, 3, 3, 2, 1, 0],
    [0, 1, 2, 2, 2, 2, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];
  
  // 3. Special case: Kings near the edge are good for endgame
  
  // 4. Mobility: count the number of valid moves
  const playerMoves = getAllValidMoves(board, player).length;
  const opponentMoves = getAllValidMoves(board, opponent).length;
  score += (playerMoves - opponentMoves) * 0.5;
  
  return score;
}
```

The evaluation function considers:
1. **Material advantage**: Kings are worth 15 points, regular pieces 10 points
2. **Positional advantage**: Pieces in the center are worth more than pieces on the edge
3. **King positioning**: Kings on the edge are given a bonus in the endgame
4. **Mobility**: Having more available moves is advantageous

## Visualization Features

### Minimax Search Tree

The application visualizes the AI's decision-making process by showing the search tree generated by the minimax algorithm. This is implemented using a modified version of the minimax algorithm that tracks all evaluated board states:

```javascript
export function minimaxWithTracking(board, depth, player, opponent) {
  // Initialize the tree structure to track states
  const treeRoot = {
    board: board,
    children: [],
    score: null,
    move: null,
    depth: 0,
    isMaximizing: true,
    player: player
  };
  
  // Run minimax with tracking
  const result = minimaxTrack(
    board, 
    depth, 
    player, 
    opponent, 
    -Infinity, 
    Infinity, 
    true, 
    treeRoot
  );
  
  return {
    move: result.move,
    tree: treeRoot
  };
}
```

The visualization shows:
- The current board state (root)
- All possible moves at each level
- The evaluation score for each board state
- The alternating maximizing and minimizing levels

### Search Depth

The AI's search depth can be adjusted from 2 to 6:

- **Depth 2**: Fast but weak AI
- **Depth 3**: Balanced speed and strength
- **Depth 4**: Recommended for balanced play
- **Depth 5**: Stronger but slower
- **Depth 6**: Strongest but slowest

Higher search depths allow the AI to look further ahead in the game tree, resulting in stronger play but requiring more computation time.

The visualization can now display the full search tree up to the selected depth, with pagination to handle the potentially large number of board states at deeper levels.

## Code Structure

The application is organized into several key components:

1. **DraughtsPage.jsx**: Main game component that manages game state and logic
2. **DraughtsBoard.jsx**: Renders the game board and handles user interactions
3. **GameControls.jsx**: Provides controls for game mode and AI settings
4. **GameInfo.jsx**: Displays game status and move history
5. **MinimaxStateTree.jsx**: Visualizes the minimax search tree
6. **minimax.js**: Implements the minimax algorithm for AI decision-making
7. **minimaxTracker.js**: Modified minimax that tracks all evaluated states for visualization

The game uses React's state management to handle the game state, with separate components for different aspects of the UI.

---

This implementation provides both an enjoyable game experience and an educational tool for understanding how the minimax algorithm works in game AI. The visualization features help to demystify the AI's decision-making process by showing exactly how it evaluates different possible moves.
