# Minimax Algorithm with Alpha-Beta Pruning: Line-by-Line Explanation

This document provides a detailed explanation of the Minimax algorithm with Alpha-Beta pruning as implemented in the Draughts (Checkers) game. We'll go through the code line by line to understand how the algorithm works, how branches are pruned, and how each step contributes to finding the optimal move.

## Table of Contents

1. [Introduction to Minimax](#introduction-to-minimax)
2. [The Minimax Function](#the-minimax-function)
3. [Base Cases](#base-cases)
4. [Maximizing Player's Turn](#maximizing-players-turn)
5. [Minimizing Player's Turn](#minimizing-players-turn)
6. [Alpha-Beta Pruning](#alpha-beta-pruning)
7. [Board Evaluation](#board-evaluation)
8. [Move Generation and Execution](#move-generation-and-execution)
9. [Complete Algorithm Flow](#complete-algorithm-flow)

## Introduction to Minimax

Minimax is a decision-making algorithm used in two-player games to find the optimal move. It works by recursively exploring all possible future moves and their outcomes, assuming that both players play optimally. The algorithm alternates between maximizing and minimizing players, where:

- The **maximizing player** (usually the AI) tries to maximize the evaluation score
- The **minimizing player** (usually the opponent) tries to minimize the evaluation score

Alpha-Beta pruning is an optimization technique that reduces the number of nodes evaluated in the minimax algorithm by eliminating branches that cannot possibly influence the final decision.

## The Minimax Function

Let's start by examining the minimax function signature:

```javascript
export function minimax(board, depth, player, opponent, alpha, beta, isMaximizingPlayer) {
```

Parameters:
- `board`: The current board state (8×8 array)
- `depth`: How many moves to look ahead (search depth)
- `player`: The AI player (WHITE or BLACK)
- `opponent`: The opponent player
- `alpha`: Best score that the maximizing player can guarantee (initially -Infinity)
- `beta`: Best score that the minimizing player can guarantee (initially Infinity)
- `isMaximizingPlayer`: Boolean indicating whether the current player is maximizing

## Base Cases

The function first checks for base cases:

```javascript
// Base case: depth reached or game over
if (depth === 0) {
  return { score: evaluateBoard(board, player, opponent), move: null };
}
```

This is the first termination condition: when we've reached the maximum search depth, we evaluate the current board position using the `evaluateBoard` function and return the score. We don't return a move because we're at a leaf node.

```javascript
// Get all valid moves for the current player
const allMoves = getAllValidMoves(board, isMaximizingPlayer ? player : opponent);

// If no moves are available, this is a terminal state
if (allMoves.length === 0) {
  // If the current player has no moves, they lose
  return { 
    score: isMaximizingPlayer ? -1000 : 1000, 
    move: null 
  };
}
```

The second termination condition is when a player has no valid moves, which means they've lost the game. If the maximizing player (AI) has no moves, we return a very negative score (-1000). If the minimizing player (opponent) has no moves, we return a very positive score (1000).

## Maximizing Player's Turn

If it's the maximizing player's turn, we want to find the move that maximizes the score:

```javascript
if (isMaximizingPlayer) {
  let maxScore = -Infinity;
  let bestMove = null;
  
  for (const move of allMoves) {
    // Make the move on a copy of the board
    const newBoard = makeMove(board, move.from.row, move.from.col, move.to.row, move.to.col);
    
    // Recursively evaluate the position
    const result = minimax(newBoard, depth - 1, player, opponent, alpha, beta, false);
    
    // Update best score and move
    if (result.score > maxScore) {
      maxScore = result.score;
      bestMove = move;
    }
```

Here's what happens:
1. Initialize `maxScore` to negative infinity and `bestMove` to null
2. For each possible move:
   - Create a new board state by making the move
   - Recursively call minimax with:
     - The new board state
     - Reduced depth (depth - 1)
     - Same player and opponent
     - Current alpha and beta values
     - `isMaximizingPlayer` set to false (it will be the minimizing player's turn next)
   - If the resulting score is better than the current best score, update `maxScore` and `bestMove`

## Minimizing Player's Turn

If it's the minimizing player's turn, we want to find the move that minimizes the score:

```javascript
} else {
  let minScore = Infinity;
  let bestMove = null;
  
  for (const move of allMoves) {
    // Make the move on a copy of the board
    const newBoard = makeMove(board, move.from.row, move.from.col, move.to.row, move.to.col);
    
    // Recursively evaluate the position
    const result = minimax(newBoard, depth - 1, player, opponent, alpha, beta, true);
    
    // Update best score and move
    if (result.score < minScore) {
      minScore = result.score;
      bestMove = move;
    }
```

The process is similar to the maximizing player's turn, but with these differences:
1. Initialize `minScore` to positive infinity
2. For each possible move:
   - Create a new board state by making the move
   - Recursively call minimax with `isMaximizingPlayer` set to true (it will be the maximizing player's turn next)
   - If the resulting score is lower than the current best score, update `minScore` and `bestMove`

## Alpha-Beta Pruning

Alpha-Beta pruning is implemented in both the maximizing and minimizing player's turns:

For the maximizing player:
```javascript
// Update alpha
alpha = Math.max(alpha, maxScore);

// Alpha-beta pruning
if (beta <= alpha) {
  break;
}
```

For the minimizing player:
```javascript
// Update beta
beta = Math.min(beta, minScore);

// Alpha-beta pruning
if (beta <= alpha) {
  break;
}
```

Here's how alpha-beta pruning works:

1. **Alpha** represents the best (highest) value found so far for the maximizing player along the path to the current node.
2. **Beta** represents the best (lowest) value found so far for the minimizing player along the path to the current node.

When a node is being evaluated:
- If the maximizing player finds a move with a value greater than or equal to beta, the minimizing player would never choose this path (because they have a better option elsewhere). So we can "prune" (skip) the remaining moves.
- If the minimizing player finds a move with a value less than or equal to alpha, the maximizing player would never choose this path. So we can prune the remaining moves.

This pruning significantly reduces the number of nodes that need to be evaluated, especially when better moves are considered first.

## Board Evaluation

The `evaluateBoard` function is crucial for the minimax algorithm. It assigns a numerical score to a board position:

```javascript
function evaluateBoard(board, player, opponent) {
  let score = 0;
  
  // Piece values
  const pieceValues = {
    [WHITE]: player === WHITE ? 10 : -10,
    [WHITE_KING]: player === WHITE ? 15 : -15,
    [BLACK]: player === BLACK ? 10 : -10,
    [BLACK_KING]: player === BLACK ? 15 : -15
  };
  
  // Position values (center and edges)
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
```

The evaluation considers several factors:

1. **Material advantage**: Regular pieces are worth 10 points, kings are worth 15 points. The player's pieces contribute positively to the score, while the opponent's pieces contribute negatively.

2. **Positional advantage**: Pieces in the center of the board are worth more than pieces on the edges. The `positionValues` matrix assigns higher values to central squares.

```javascript
// Count pieces and their positions
for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const piece = board[row][col];
    if (piece !== EMPTY) {
      // Add piece value
      score += pieceValues[piece];
      
      // Add position value
      const posValue = positionValues[row][col];
      if ((piece === WHITE || piece === WHITE_KING) && player === WHITE) {
        score += posValue;
      } else if ((piece === BLACK || piece === BLACK_KING) && player === BLACK) {
        score += posValue;
      }
```

3. **King positioning**: Kings on the edge of the board get a bonus in the endgame, as they're safer there:

```javascript
// Kings near the edge are good for endgame
if ((piece === WHITE_KING && player === WHITE) || 
    (piece === BLACK_KING && player === BLACK)) {
  if (row === 0 || row === 7 || col === 0 || col === 7) {
    score += 2;
  }
}
```

4. **Mobility**: Having more available moves is advantageous, as it gives more options:

```javascript
// Mobility: count the number of valid moves
const playerMoves = getAllValidMoves(board, player).length;
const opponentMoves = getAllValidMoves(board, opponent).length;
score += (playerMoves - opponentMoves) * 0.5;
```

The difference in the number of available moves is multiplied by 0.5 to give it less weight than material advantage.

## Move Generation and Execution

The minimax algorithm relies on two key functions to explore possible future states:

1. **getAllValidMoves**: Generates all legal moves for a player in the current position
2. **makeMove**: Creates a new board state by executing a move

The `getAllValidMoves` function follows the rules of Draughts:
- Captures are mandatory
- Regular pieces can only move forward diagonally
- Kings can move diagonally in any direction

```javascript
function getAllValidMoves(board, player) {
  const moves = [];
  let hasCaptures = false;
  
  // First pass: check for captures (mandatory in checkers)
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if ((player === WHITE && (piece === WHITE || piece === WHITE_KING)) ||
          (player === BLACK && (piece === BLACK || piece === BLACK_KING))) {
        
        const captures = getValidCaptures(row, col, board, player);
        if (captures.length > 0) {
          hasCaptures = true;
          for (const capture of captures) {
            moves.push({
              from: { row, col },
              to: capture
            });
          }
        }
      }
    }
  }
  
  // If there are captures, they are mandatory
  if (hasCaptures) {
    return moves;
  }
```

If there are no captures, regular moves are considered:

```javascript
// Second pass: regular moves
for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const piece = board[row][col];
    if ((player === WHITE && (piece === WHITE || piece === WHITE_KING)) ||
        (player === BLACK && (piece === BLACK || piece === BLACK_KING))) {
      
      const regularMoves = getValidRegularMoves(row, col, board, player);
      for (const move of regularMoves) {
        moves.push({
          from: { row, col },
          to: move
        });
      }
    }
  }
}
```

The `makeMove` function creates a new board state by executing a move:

```javascript
function makeMove(board, fromRow, fromCol, toRow, toCol) {
  // Create a deep copy of the board
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
  }
  
  return newBoard;
}
```

This function:
1. Creates a deep copy of the board to avoid modifying the original
2. Moves the piece from the source to the destination
3. Promotes the piece to a king if it reaches the opponent's back row
4. Removes the captured piece if this was a capture move

## Complete Algorithm Flow

Let's trace through a simple example to understand the complete flow of the minimax algorithm:

1. The AI (WHITE) wants to find the best move in the current position
2. It calls `minimax(board, depth, WHITE, BLACK, -Infinity, Infinity, true)`
3. The algorithm generates all valid moves for WHITE
4. For each move:
   - It creates a new board state by making the move
   - It recursively calls minimax with the new board state, reduced depth, and `isMaximizingPlayer` set to false
   - The recursive call generates all valid moves for BLACK
   - For each of BLACK's moves:
     - It creates another new board state
     - It recursively calls minimax with this board state, further reduced depth, and `isMaximizingPlayer` set to true
     - This process continues until the maximum depth is reached or a terminal state is found
     - At the leaf nodes, the board is evaluated using the `evaluateBoard` function
     - The scores are propagated back up the tree, with maximizing nodes taking the maximum score and minimizing nodes taking the minimum score
     - Alpha-beta pruning is applied to skip branches that cannot affect the final decision
5. The algorithm returns the move with the highest score for WHITE

This recursive exploration of the game tree, combined with the alpha-beta pruning optimization, allows the AI to find the best move without having to evaluate every possible position.

---

This detailed explanation covers how the minimax algorithm with alpha-beta pruning works in the context of the Draughts game. The algorithm efficiently searches through possible future positions to find the move that leads to the best outcome, assuming optimal play from both sides.
