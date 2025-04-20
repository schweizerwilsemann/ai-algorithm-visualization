import React, { useEffect, useRef } from 'react';

const GraphVisualization = ({ graph, startState, goalState, path }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!graph || Object.keys(graph).length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get all nodes
    const nodes = Object.keys(graph);

    // Calculate positions for nodes in a circle
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;

    const nodePositions = {};

    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      nodePositions[node] = { x, y };
    });

    // Draw edges
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;

    nodes.forEach(node => {
      const neighbors = graph[node] || [];
      const { x: x1, y: y1 } = nodePositions[node];

      neighbors.forEach(neighbor => {
        if (neighbor in nodePositions) {
          const { x: x2, y: y2 } = nodePositions[neighbor];

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      });
    });

    // Draw path if available
    if (path && path.length > 1) {
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 3;

      for (let i = 0; i < path.length - 1; i++) {
        const node1 = path[i];
        const node2 = path[i + 1];

        if (node1 in nodePositions && node2 in nodePositions) {
          const { x: x1, y: y1 } = nodePositions[node1];
          const { x: x2, y: y2 } = nodePositions[node2];

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(node => {
      const { x, y } = nodePositions[node];

      // Determine node color
      let fillColor = '#3498db';

      if (node === startState) {
        fillColor = '#e74c3c';
      } else if (node === goalState) {
        fillColor = '#2ecc71';
      } else if (path && path.includes(node)) {
        fillColor = '#f39c12';
      }

      // Draw node circle
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node, x, y);
    });

  }, [graph, startState, goalState, path]);

  return (
    <div className="card">
      <h2>Graph Visualization</h2>

      <div>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '1rem', height: '1rem', backgroundColor: '#e74c3c', borderRadius: '50%', marginRight: '0.5rem' }}></div>
          <span>Start</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '1rem', height: '1rem', backgroundColor: '#2ecc71', borderRadius: '50%', marginRight: '0.5rem' }}></div>
          <span>Goal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '1rem', height: '1rem', backgroundColor: '#f39c12', borderRadius: '50%', marginRight: '0.5rem' }}></div>
          <span>Path</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '1rem', height: '1rem', backgroundColor: '#3498db', borderRadius: '50%', marginRight: '0.5rem' }}></div>
          <span>Other Nodes</span>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualization;
