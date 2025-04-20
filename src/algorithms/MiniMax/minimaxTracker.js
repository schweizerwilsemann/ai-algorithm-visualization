// Constants for game pieces
const EMPTY = 0;
const WHITE = 1;
const WHITE_KING = 2;
const BLACK = 3;
const BLACK_KING = 4;

/**
 * Minimax algorithm with alpha-beta pruning for Draughts/Checkers
 * This version tracks all board states evaluated during the search
 * 
 * @param {Array} board - The current board state
 * @param {Number} depth - How many moves to look ahead
 * @param {Number} player - The current player (WHITE or BLACK)
 * @param {Number} opponent - The opponent player
 * @returns {Object} - Best move and tree of evaluated states
 */
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

/**
 * Helper function for minimax that tracks the search tree
 */
function minimaxTrack(board, depth, player, opponent, alpha, beta, isMaximizingPlayer, node) {
  // Base case: depth reached or game over
  if (depth === 0) {
    const score = evaluateBoard(board, player, opponent);
    node.score = score;
    return { score, move: null };
  }
  
  // Get all valid moves for the current player
  const currentPlayer = isMaximizingPlayer ? player : opponent;
  const allMoves = getAllValidMoves(board, currentPlayer);
  
  // If no moves are available, this is a terminal state
  if (allMoves.length === 0) {
    const score = isMaximizingPlayer ? -1000 : 1000;
    node.score = score;
    return { score, move: null };
  }
  
  let bestMove = null;
  
  if (isMaximizingPlayer) {
    let maxScore = -Infinity;
    
    for (const move of allMoves) {
      // Make the move on a copy of the board
      const newBoard = makeMove(board, move.from.row, move.from.col, move.to.row, move.to.col);
      
      // Create a child node for this move
      const childNode = {
        board: newBoard,
        children: [],
        score: null,
        move: move,
        depth: node.depth + 1,
        isMaximizing: false,
        player: opponent
      };
      node.children.push(childNode);
      
      // Recursively evaluate the position
      const result = minimaxTrack(
        newBoard, 
        depth - 1, 
        player, 
        opponent, 
        alpha, 
        beta, 
        false, 
        childNode
      );
      
      // Update best score and move
      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move;
      }
      
      // Update alpha
      alpha = Math.max(alpha, maxScore);
      
      // Alpha-beta pruning
      if (beta <= alpha) {
        break;
      }
    }
    
    node.score = maxScore;
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    
    for (const move of allMoves) {
      // Make the move on a copy of the board
      const newBoard = makeMove(board, move.from.row, move.from.col, move.to.row, move.to.col);
      
      // Create a child node for this move
      const childNode = {
        board: newBoard,
        children: [],
        score: null,
        move: move,
        depth: node.depth + 1,
        isMaximizing: true,
        player: player
      };
      node.children.push(childNode);
      
      // Recursively evaluate the position
      const result = minimaxTrack(
        newBoard, 
        depth - 1, 
        player, 
        opponent, 
        alpha, 
        beta, 
        true, 
        childNode
      );
      
      // Update best score and move
      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move;
      }
      
      // Update beta
      beta = Math.min(beta, minScore);
      
      // Alpha-beta pruning
      if (beta <= alpha) {
        break;
      }
    }
    
    node.score = minScore;
    return { score: minScore, move: bestMove };
  }
}

/**
 * Evaluate the board position for the given player
 * 
 * @param {Array} board - The board to evaluate
 * @param {Number} player - The player to evaluate for
 * @param {Number} opponent - The opponent player
 * @returns {Number} - Score for the position
 */
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
        
        // Kings near the edge are good for endgame
        if ((piece === WHITE_KING && player === WHITE) || 
            (piece === BLACK_KING && player === BLACK)) {
          if (row === 0 || row === 7 || col === 0 || col === 7) {
            score += 2;
          }
        }
      }
    }
  }
  
  // Mobility: count the number of valid moves
  const playerMoves = getAllValidMoves(board, player).length;
  const opponentMoves = getAllValidMoves(board, opponent).length;
  score += (playerMoves - opponentMoves) * 0.5;
  
  return score;
}

/**
 * Make a move on a copy of the board
 * 
 * @param {Array} board - The current board
 * @param {Number} fromRow - Starting row
 * @param {Number} fromCol - Starting column
 * @param {Number} toRow - Target row
 * @param {Number} toCol - Target column
 * @returns {Array} - New board after the move
 */
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

/**
 * Get all valid moves for a player
 * 
 * @param {Array} board - The current board
 * @param {Number} player - The player to get moves for
 * @returns {Array} - List of valid moves
 */
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
  
  return moves;
}

/**
 * Get valid captures for a piece
 * 
 * @param {Number} row - The piece's row
 * @param {Number} col - The piece's column
 * @param {Array} board - The current board
 * @param {Number} player - The current player
 * @returns {Array} - List of valid capture destinations
 */
function getValidCaptures(row, col, board, player) {
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
}

/**
 * Get valid regular moves for a piece
 * 
 * @param {Number} row - The piece's row
 * @param {Number} col - The piece's column
 * @param {Array} board - The current board
 * @param {Number} player - The current player
 * @returns {Array} - List of valid move destinations
 */
function getValidRegularMoves(row, col, board, player) {
  const piece = board[row][col];
  const moves = [];
  
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
}

/**
 * Check if a position is valid on the board
 * 
 * @param {Number} row - Row to check
 * @param {Number} col - Column to check
 * @returns {Boolean} - Whether the position is valid
 */
function isValidPosition(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}
