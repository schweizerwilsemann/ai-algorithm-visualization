# Minimax Algorithm Pseudocode

This document provides pseudocode for both the standard Minimax algorithm with Alpha-Beta pruning and the tracking version used for visualization in the Draughts game.

## Table of Contents

1. [Standard Minimax with Alpha-Beta Pruning](#standard-minimax-with-alpha-beta-pruning)
2. [Minimax with Tree Tracking](#minimax-with-tree-tracking)
3. [Supporting Functions](#supporting-functions)
4. [Comparison Between Versions](#comparison-between-versions)
5. [Step-by-Step Execution Example](#step-by-step-execution-example)

## Standard Minimax with Alpha-Beta Pruning

```
function minimax(board, depth, player, opponent, alpha, beta, isMaximizingPlayer):
    // Base case: depth reached or game over
    if depth == 0:
        return {score: evaluateBoard(board, player, opponent), move: null}
    
    // Get all valid moves for the current player
    allMoves = getAllValidMoves(board, isMaximizingPlayer ? player : opponent)
    
    // If no moves are available, this is a terminal state
    if allMoves.length == 0:
        return {
            score: isMaximizingPlayer ? -1000 : 1000,
            move: null
        }
    
    bestMove = null
    
    if isMaximizingPlayer:
        maxScore = -Infinity
        
        for each move in allMoves:
            // Make the move on a copy of the board
            newBoard = makeMove(board, move.from, move.to)
            
            // Recursively evaluate the position
            result = minimax(newBoard, depth - 1, player, opponent, alpha, beta, false)
            
            // Update best score and move
            if result.score > maxScore:
                maxScore = result.score
                bestMove = move
            
            // Update alpha
            alpha = max(alpha, maxScore)
            
            // Alpha-beta pruning
            if beta <= alpha:
                break
        
        return {score: maxScore, move: bestMove}
    else:
        minScore = Infinity
        
        for each move in allMoves:
            // Make the move on a copy of the board
            newBoard = makeMove(board, move.from, move.to)
            
            // Recursively evaluate the position
            result = minimax(newBoard, depth - 1, player, opponent, alpha, beta, true)
            
            // Update best score and move
            if result.score < minScore:
                minScore = result.score
                bestMove = move
            
            // Update beta
            beta = min(beta, minScore)
            
            // Alpha-beta pruning
            if beta <= alpha:
                break
        
        return {score: minScore, move: bestMove}
```

## Minimax with Tree Tracking

The tracking version of minimax builds a tree structure to visualize the search process:

```
function minimaxWithTracking(board, depth, player, opponent):
    // Initialize the tree structure to track states
    treeRoot = {
        board: board,
        children: [],
        score: null,
        move: null,
        depth: 0,
        isMaximizing: true,
        player: player
    }
    
    // Run minimax with tracking
    result = minimaxTrack(board, depth, player, opponent, -Infinity, Infinity, true, treeRoot)
    
    return {
        move: result.move,
        tree: treeRoot
    }

function minimaxTrack(board, depth, player, opponent, alpha, beta, isMaximizingPlayer, node):
    // Base case: depth reached or game over
    if depth == 0:
        score = evaluateBoard(board, player, opponent)
        node.score = score
        return {score, move: null}
    
    // Get all valid moves for the current player
    currentPlayer = isMaximizingPlayer ? player : opponent
    allMoves = getAllValidMoves(board, currentPlayer)
    
    // If no moves are available, this is a terminal state
    if allMoves.length == 0:
        score = isMaximizingPlayer ? -1000 : 1000
        node.score = score
        return {score, move: null}
    
    bestMove = null
    
    if isMaximizingPlayer:
        maxScore = -Infinity
        
        for each move in allMoves:
            // Make the move on a copy of the board
            newBoard = makeMove(board, move.from, move.to)
            
            // Create a child node for this move
            childNode = {
                board: newBoard,
                children: [],
                score: null,
                move: move,
                depth: node.depth + 1,
                isMaximizing: false,
                player: opponent
            }
            node.children.push(childNode)
            
            // Recursively evaluate the position
            result = minimaxTrack(
                newBoard, 
                depth - 1, 
                player, 
                opponent, 
                alpha, 
                beta, 
                false, 
                childNode
            )
            
            // Update best score and move
            if result.score > maxScore:
                maxScore = result.score
                bestMove = move
            
            // Update alpha
            alpha = max(alpha, maxScore)
            
            // Alpha-beta pruning
            if beta <= alpha:
                break
        
        node.score = maxScore
        return {score: maxScore, move: bestMove}
    else:
        minScore = Infinity
        
        for each move in allMoves:
            // Make the move on a copy of the board
            newBoard = makeMove(board, move.from, move.to)
            
            // Create a child node for this move
            childNode = {
                board: newBoard,
                children: [],
                score: null,
                move: move,
                depth: node.depth + 1,
                isMaximizing: true,
                player: player
            }
            node.children.push(childNode)
            
            // Recursively evaluate the position
            result = minimaxTrack(
                newBoard, 
                depth - 1, 
                player, 
                opponent, 
                alpha, 
                beta, 
                true, 
                childNode
            )
            
            // Update best score and move
            if result.score < minScore:
                minScore = result.score
                bestMove = move
            
            // Update beta
            beta = min(beta, minScore)
            
            // Alpha-beta pruning
            if beta <= alpha:
                break
        
        node.score = minScore
        return {score: minScore, move: bestMove}
```

## Supporting Functions

These are the key supporting functions used by the minimax algorithm:

```
function evaluateBoard(board, player, opponent):
    score = 0
    
    // Define piece values
    pieceValues = {
        WHITE: player == WHITE ? 10 : -10,
        WHITE_KING: player == WHITE ? 15 : -15,
        BLACK: player == BLACK ? 10 : -10,
        BLACK_KING: player == BLACK ? 15 : -15
    }
    
    // Define position values (center and edges)
    positionValues = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 2, 2, 2, 2, 1, 0],
        [0, 1, 2, 3, 3, 2, 1, 0],
        [0, 1, 2, 3, 3, 2, 1, 0],
        [0, 1, 2, 2, 2, 2, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ]
    
    // Count pieces and their positions
    for each row, col in board:
        piece = board[row][col]
        if piece != EMPTY:
            // Add piece value
            score += pieceValues[piece]
            
            // Add position value
            posValue = positionValues[row][col]
            if (piece is player's piece):
                score += posValue
            
            // Kings near the edge are good for endgame
            if (piece is player's king) and (row == 0 or row == 7 or col == 0 or col == 7):
                score += 2
    
    // Mobility: count the number of valid moves
    playerMoves = getAllValidMoves(board, player).length
    opponentMoves = getAllValidMoves(board, opponent).length
    score += (playerMoves - opponentMoves) * 0.5
    
    return score

function makeMove(board, fromRow, fromCol, toRow, toCol):
    // Create a deep copy of the board
    newBoard = copy(board)
    
    piece = newBoard[fromRow][fromCol]
    
    // Move the piece
    newBoard[fromRow][fromCol] = EMPTY
    newBoard[toRow][toCol] = piece
    
    // Check if the piece should be promoted to king
    if (piece == WHITE and toRow == 0):
        newBoard[toRow][toCol] = WHITE_KING
    else if (piece == BLACK and toRow == 7):
        newBoard[toRow][toCol] = BLACK_KING
    
    // Check if this was a capture move
    if abs(fromRow - toRow) == 2:
        captureRow = (fromRow + toRow) / 2
        captureCol = (fromCol + toCol) / 2
        newBoard[captureRow][captureCol] = EMPTY
    
    return newBoard

function getAllValidMoves(board, player):
    moves = []
    hasCaptures = false
    
    // First pass: check for captures (mandatory in checkers)
    for each row, col in board:
        piece = board[row][col]
        if piece belongs to player:
            captures = getValidCaptures(row, col, board, player)
            if captures.length > 0:
                hasCaptures = true
                for each capture in captures:
                    moves.push({from: {row, col}, to: capture})
    
    // If there are captures, they are mandatory
    if hasCaptures:
        return moves
    
    // Second pass: regular moves
    for each row, col in board:
        piece = board[row][col]
        if piece belongs to player:
            regularMoves = getValidRegularMoves(row, col, board, player)
            for each move in regularMoves:
                moves.push({from: {row, col}, to: move})
    
    return moves

function getValidCaptures(row, col, board, player):
    piece = board[row][col]
    captures = []
    
    // Determine possible movement directions based on piece type
    directions = []
    if piece can move upward:
        directions.push({row: -1, col: -1}, {row: -1, col: 1})  // Up-left, Up-right
    if piece can move downward:
        directions.push({row: 1, col: -1}, {row: 1, col: 1})    // Down-left, Down-right
    
    // Check each direction for valid captures
    for each dir in directions:
        jumpRow = row + dir.row
        jumpCol = col + dir.col
        landRow = row + 2 * dir.row
        landCol = col + 2 * dir.col
        
        if isValidPosition(jumpRow, jumpCol) and isValidPosition(landRow, landCol):
            jumpPiece = board[jumpRow][jumpCol]
            
            // Check if there's an opponent's piece to jump over
            if jumpPiece belongs to opponent and board[landRow][landCol] == EMPTY:
                captures.push({row: landRow, col: landCol})
    
    return captures

function getValidRegularMoves(row, col, board, player):
    piece = board[row][col]
    moves = []
    
    // Determine possible movement directions based on piece type
    directions = []
    if piece can move upward:
        directions.push({row: -1, col: -1}, {row: -1, col: 1})  // Up-left, Up-right
    if piece can move downward:
        directions.push({row: 1, col: -1}, {row: 1, col: 1})    // Down-left, Down-right
    
    // Check each direction for valid moves
    for each dir in directions:
        newRow = row + dir.row
        newCol = col + dir.col
        
        if isValidPosition(newRow, newCol) and board[newRow][newCol] == EMPTY:
            moves.push({row: newRow, col: newCol})
    
    return moves

function isValidPosition(row, col):
    return row >= 0 and row < 8 and col >= 0 and col < 8
```

## Comparison Between Versions

The key differences between the standard minimax and the tracking version are:

1. **Tree Structure**: The tracking version builds a tree structure to represent the search process:
   - Each node contains a board state, score, move, depth, and player information
   - Child nodes represent possible future states

2. **Node Creation**: The tracking version creates a node for each board state evaluated:
   ```
   childNode = {
       board: newBoard,
       children: [],
       score: null,
       move: move,
       depth: node.depth + 1,
       isMaximizing: !isMaximizingPlayer,
       player: isMaximizingPlayer ? opponent : player
   }
   node.children.push(childNode)
   ```

3. **Score Storage**: The tracking version stores the score in each node:
   ```
   node.score = maxScore  // or minScore
   ```

4. **Return Value**: The tracking version returns both the best move and the complete search tree:
   ```
   return {
       move: result.move,
       tree: treeRoot
   }
   ```

The tracking version maintains the same logic and pruning as the standard version but adds the tree-building functionality for visualization purposes.

## Step-by-Step Execution Example

Let's trace through a simple example to illustrate how the minimax algorithm works:

Consider a simplified 3×3 Draughts board with a search depth of 2:

```
Initial board:
[ 0, 3, 0 ]
[ 0, 0, 0 ]
[ 0, 1, 0 ]

Where:
0 = EMPTY
1 = WHITE (AI)
3 = BLACK (opponent)
```

1. **Call minimax(board, 2, WHITE, BLACK, -Infinity, Infinity, true)**

2. **Generate moves for WHITE**:
   - WHITE can move from (2,1) to (1,0) or (1,2)
   - Let's call these moves A and B

3. **For move A (WHITE moves to (1,0))**:
   - New board after move A:
     ```
     [ 0, 3, 0 ]
     [ 1, 0, 0 ]
     [ 0, 0, 0 ]
     ```
   - Call minimax(boardA, 1, WHITE, BLACK, -Infinity, Infinity, false)
   - Generate moves for BLACK:
     - BLACK can move from (0,1) to (1,0) or (1,2)
     - Let's call these moves A1 and A2
   - For move A1 (BLACK captures WHITE):
     - New board after move A1:
       ```
       [ 0, 0, 0 ]
       [ 0, 0, 0 ]
       [ 0, 0, 0 ]
       ```
     - Evaluate board: score = -10 (WHITE lost a piece)
   - For move A2 (BLACK moves to (1,2)):
     - New board after move A2:
       ```
       [ 0, 0, 0 ]
       [ 1, 0, 3 ]
       [ 0, 0, 0 ]
       ```
     - Evaluate board: score = 0 (equal material)
   - BLACK chooses move A1 with score -10 (minimizing)
   - Return score -10 for move A

4. **For move B (WHITE moves to (1,2))**:
   - New board after move B:
     ```
     [ 0, 3, 0 ]
     [ 0, 0, 1 ]
     [ 0, 0, 0 ]
     ```
   - Call minimax(boardB, 1, WHITE, BLACK, -10, Infinity, false)
   - Generate moves for BLACK:
     - BLACK can move from (0,1) to (1,0)
     - Let's call this move B1
   - For move B1 (BLACK moves to (1,0)):
     - New board after move B1:
       ```
       [ 0, 0, 0 ]
       [ 3, 0, 1 ]
       [ 0, 0, 0 ]
       ```
     - Evaluate board: score = 0 (equal material)
   - BLACK chooses move B1 with score 0 (minimizing)
   - Return score 0 for move B

5. **WHITE chooses move B with score 0 (maximizing)**

6. **Return move B as the best move**

In this example, WHITE chooses move B (moving to (1,2)) because it leads to a better outcome (score 0) than move A (score -10).

The tracking version would build a tree structure like this:

```
Root (board, score=0)
├── Node A (boardA, score=-10)
│   ├── Node A1 (boardA1, score=-10)
│   └── Node A2 (boardA2, score=0)
└── Node B (boardB, score=0)
    └── Node B1 (boardB1, score=0)
```

This tree can then be visualized to show how the AI evaluated different moves and made its decision.

---

This pseudocode provides a comprehensive overview of both the standard minimax algorithm with alpha-beta pruning and the tracking version used for visualization. The step-by-step example illustrates how the algorithm evaluates different moves and chooses the best one.
