import React, { useRef, useEffect } from 'react';

// Constants for game pieces
const WHITE = 1;
const BLACK = 3;

function MinimaxTree({ board, currentPlayer, searchDepth }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!board || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the minimax tree
    drawMinimaxTree(ctx, canvas.width, canvas.height, searchDepth);

  }, [board, currentPlayer, searchDepth]);

  const drawMinimaxTree = (ctx, width, height, depth) => {
    // Set up tree dimensions
    const nodeRadius = 25;
    const levelHeight = 80;
    const levelWidth = width - 100;

    // Draw the root node (current board state)
    const rootX = width / 2;
    const rootY = 50;

    drawNode(ctx, rootX, rootY, nodeRadius, 'A', currentPlayer === WHITE ? 'maximizer' : 'minimizer');

    // Draw the levels of the tree
    for (let level = 1; level <= depth; level++) {
      const nodesInLevel = Math.min(Math.pow(2, level), 8); // Limit to 8 nodes per level for visibility
      const isMaximizerLevel = (currentPlayer === WHITE && level % 2 === 0) ||
        (currentPlayer === BLACK && level % 2 === 1);
      const levelType = isMaximizerLevel ? 'maximizer' : 'minimizer';

      // Draw level label
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'right';
      ctx.fillText(levelType === 'maximizer' ? 'Maximizer' : 'Minimizer', width - 20, rootY + level * levelHeight);

      // Draw nodes for this level
      for (let i = 0; i < nodesInLevel; i++) {
        const x = (levelWidth / (nodesInLevel + 1)) * (i + 1) + 50;
        const y = rootY + level * levelHeight;

        // Generate a letter for the node (B, C, D, etc.)
        const nodeLetter = String.fromCharCode(66 + i + (level - 1) * 2);

        // Draw the node
        drawNode(ctx, x, y, nodeRadius, nodeLetter, levelType);

        // Draw edge to parent
        const parentIndex = Math.floor(i / 2);
        const parentX = (levelWidth / (nodesInLevel / 2 + 1)) * (parentIndex + 1) + 50;
        const parentY = rootY + (level - 1) * levelHeight;

        ctx.beginPath();
        ctx.moveTo(parentX, parentY + nodeRadius);
        ctx.lineTo(x, y - nodeRadius);
        ctx.strokeStyle = '#666';
        ctx.stroke();
      }
    }

    // Draw terminal nodes at the bottom level
    const terminalLevel = depth + 1;
    const nodesInTerminalLevel = Math.min(Math.pow(2, terminalLevel), 16); // Limit to 16 terminal nodes

    // Draw level label
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'right';
    ctx.fillText('Terminal nodes', width - 20, rootY + terminalLevel * levelHeight);

    // Draw terminal nodes
    for (let i = 0; i < nodesInTerminalLevel; i++) {
      const x = (levelWidth / (nodesInTerminalLevel + 1)) * (i + 1) + 50;
      const y = rootY + terminalLevel * levelHeight;

      // Generate a random evaluation score
      const score = Math.floor(Math.random() * 10) - 5;

      // Draw the terminal node
      drawTerminalNode(ctx, x, y, nodeRadius / 1.5, score);

      // Draw edge to parent
      const parentIndex = Math.floor(i / 2);
      const parentX = (levelWidth / (nodesInTerminalLevel / 4 + 1)) * (parentIndex + 1) + 50;
      const parentY = rootY + (terminalLevel - 1) * levelHeight;

      ctx.beginPath();
      ctx.moveTo(parentX, parentY + nodeRadius);
      ctx.lineTo(x, y - nodeRadius / 1.5);
      ctx.strokeStyle = '#666';
      ctx.stroke();
    }

    // Draw terminal values label
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('Terminal values', width / 2, rootY + (terminalLevel + 1) * levelHeight - 20);
  };

  const drawNode = (ctx, x, y, radius, label, type) => {
    // Draw circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = type === 'maximizer' ? '#e3f2fd' : '#eceff1';
    ctx.fill();
    ctx.strokeStyle = type === 'maximizer' ? '#1565c0' : '#546e7a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = type === 'maximizer' ? '#1565c0' : '#546e7a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
  };

  const drawTerminalNode = (ctx, x, y, radius, value) => {
    // Draw circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = value > 0 ? '#e8f5e9' : '#ffebee';
    ctx.fill();
    ctx.strokeStyle = value > 0 ? '#4caf50' : '#f44336';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw value
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = value > 0 ? '#4caf50' : '#f44336';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(value.toString(), x, y);
  };

  return (
    <div className="card minimax-tree-container">
      <h2>Minimax Decision Tree</h2>
      <p className="tree-info">
        Visualization of how the AI evaluates possible moves using the Minimax algorithm with Alpha-Beta pruning.
        Each level alternates between maximizing and minimizing players.
      </p>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="minimax-tree-canvas"
      />
    </div>
  );
}

export default MinimaxTree;
