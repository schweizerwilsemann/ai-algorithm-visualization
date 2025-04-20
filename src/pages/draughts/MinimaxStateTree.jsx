import React, { useState, useEffect } from 'react';
import { minimaxWithTracking } from '../../algorithms/MiniMax/minimaxTracker';

// Constants for game pieces
const WHITE = 1;
const WHITE_KING = 2;
const BLACK = 3;
const BLACK_KING = 4;

function MinimaxStateTree({ board, currentPlayer, searchDepth }) {
  const [searchTree, setSearchTree] = useState(null);
  const [selectedDepth, setSelectedDepth] = useState(0);
  const [nodesAtDepth, setNodesAtDepth] = useState([]);

  // State to track if we've seen an AI move yet
  const [hasSeenAIMove, setHasSeenAIMove] = useState(false);

  // Run minimax with tracking when the board changes
  useEffect(() => {
    if (!board) return;

    // Only run this for visualization purposes
    const opponent = currentPlayer === WHITE ? BLACK : WHITE;

    // Only generate new tree for AI (WHITE) moves
    const isAITurn = currentPlayer === WHITE;

    if (isAITurn) {
      // Run minimax with tracking to get the search tree
      // Allow visualization up to the full search depth (with a reasonable upper limit)
      const visualizationDepth = Math.min(searchDepth, 6);
      const result = minimaxWithTracking(board, visualizationDepth, currentPlayer, opponent);
      setSearchTree(result.tree);
      setHasSeenAIMove(true);

      // Reset selected depth
      setSelectedDepth(0);
    }
    // Don't clear the tree when it's the random bot's turn
    // This way we keep showing the last AI move's search tree
  }, [board, currentPlayer, searchDepth]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const MAX_NODES_PER_PAGE = 12; // Maximum number of boards to show at once

  // Update nodes at the selected depth
  useEffect(() => {
    if (!searchTree) return;

    // Collect all nodes at the selected depth
    const nodes = [];

    const collectNodesAtDepth = (node, currentDepth) => {
      if (currentDepth === selectedDepth) {
        nodes.push(node);
        return;
      }

      for (const child of node.children) {
        collectNodesAtDepth(child, currentDepth + 1);
      }
    };

    collectNodesAtDepth(searchTree, 0);

    // Calculate total pages needed
    const pages = Math.ceil(nodes.length / MAX_NODES_PER_PAGE);
    setTotalPages(Math.max(1, pages));

    // Reset to first page when depth changes
    setCurrentPage(0);

    setNodesAtDepth(nodes);
  }, [searchTree, selectedDepth]);

  // Get the maximum depth of the search tree
  const getMaxDepth = () => {
    if (!searchTree) return 0;

    const findMaxDepth = (node) => {
      if (node.children.length === 0) return node.depth;

      let maxChildDepth = 0;
      for (const child of node.children) {
        const childDepth = findMaxDepth(child);
        maxChildDepth = Math.max(maxChildDepth, childDepth);
      }

      return maxChildDepth;
    };

    return findMaxDepth(searchTree);
  };

  // Render a mini board for a node
  const renderMiniBoard = (board, move = null, score = null) => {
    return (
      <div className="mini-board-container">
        <div className="mini-board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="mini-board-row">
              {row.map((cell, colIndex) => {
                const isBlackSquare = (rowIndex + colIndex) % 2 === 1;
                const isHighlighted = move &&
                  ((move.from.row === rowIndex && move.from.col === colIndex) ||
                    (move.to.row === rowIndex && move.to.col === colIndex));

                return (
                  <div
                    key={colIndex}
                    className={`mini-board-cell ${isBlackSquare ? 'mini-black-square' : 'mini-white-square'}
                               ${isHighlighted ? 'mini-highlighted' : ''}`}
                  >
                    {renderMiniPiece(cell)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {score !== null && (
          <div className={`mini-board-score ${score > 0 ? 'positive-score' : score < 0 ? 'negative-score' : ''}`}>
            {score}
          </div>
        )}
        {move && (
          <div className="mini-board-move">
            {String.fromCharCode(97 + move.from.col)}{8 - move.from.row} →
            {String.fromCharCode(97 + move.to.col)}{8 - move.to.row}
          </div>
        )}
      </div>
    );
  };

  // Render a mini piece for the mini board
  const renderMiniPiece = (piece) => {
    switch (piece) {
      case WHITE:
        return <div className="mini-piece mini-white"></div>;
      case WHITE_KING:
        return <div className="mini-piece mini-white mini-king"></div>;
      case BLACK:
        return <div className="mini-piece mini-black"></div>;
      case BLACK_KING:
        return <div className="mini-piece mini-black mini-king"></div>;
      default:
        return null;
    }
  };

  // Handle depth selection change
  const handleDepthChange = (e) => {
    setSelectedDepth(parseInt(e.target.value, 10));
  };

  if (!searchTree) {
    return (
      <div className="card minimax-state-tree">
        <h2>Minimax Search Tree</h2>
        <p>
          {hasSeenAIMove ?
            "Showing the last AI move's search tree..." :
            "Make a move to see the AI's decision process..."}
        </p>
      </div>
    );
  }

  const maxDepth = getMaxDepth();

  return (
    <div className="card minimax-state-tree">
      <h2>Minimax Search Tree</h2>
      <p className="tree-info">
        Visualization of the board states evaluated by the AI during the minimax search.
        Each level shows the possible moves and resulting positions.
        {currentPlayer === BLACK && (
          <span className="tree-status"> (Showing last AI move's search tree)</span>
        )}
      </p>

      <div className="depth-selector">
        <label>
          View Depth Level:
          <select value={selectedDepth} onChange={handleDepthChange}>
            {Array.from({ length: maxDepth + 1 }, (_, i) => (
              <option key={i} value={i}>
                {i === 0 ? 'Root (Current Board)' : `Level ${i} - ${i % 2 === 1 ? 'Minimizer' : 'Maximizer'}`}
              </option>
            ))}
          </select>
        </label>
        {maxDepth > 3 && (
          <div className="depth-warning">
            Note: Higher depth levels may show many board states and affect performance.
          </div>
        )}
      </div>

      <div className="depth-info">
        {selectedDepth === 0 ? (
          <div>Current board state</div>
        ) : (
          <div>
            {selectedDepth % 2 === 1 ? 'Minimizer' : 'Maximizer'} level -
            {selectedDepth % 2 === 1 ? ' opponent\'s' : ' AI\'s'} possible moves
          </div>
        )}
      </div>

      {nodesAtDepth.length > 0 ? (
        <>
          <div className="mini-boards-container">
            {nodesAtDepth
              .slice(currentPage * MAX_NODES_PER_PAGE, (currentPage + 1) * MAX_NODES_PER_PAGE)
              .map((node, index) => (
                <div key={index} className="mini-board-wrapper">
                  {renderMiniBoard(node.board, node.move, node.score)}
                </div>
              ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="page-indicator">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}

          <div className="board-count">
            Showing {Math.min(MAX_NODES_PER_PAGE, nodesAtDepth.length - currentPage * MAX_NODES_PER_PAGE)} of {nodesAtDepth.length} possible board states
          </div>
        </>
      ) : (
        <div className="no-boards-message">
          No board states available at this depth level.
        </div>
      )}
    </div>
  );
}

export default MinimaxStateTree;
