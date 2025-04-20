import React, { useState } from 'react';

const HeuristicInput = ({ graph, onHeuristicChange, onCostFunctionChange }) => {
  const [heuristicText, setHeuristicText] = useState('');
  const [costFunctionText, setCostFunctionText] = useState('');
  const [error, setError] = useState('');

  const handleHeuristicTextChange = (e) => {
    setHeuristicText(e.target.value);
  };

  const handleCostFunctionTextChange = (e) => {
    setCostFunctionText(e.target.value);
  };

  const parseHeuristic = () => {
    try {
      // Parse the heuristic text into values
      const lines = heuristicText.trim().split('\n');
      const heuristicValues = {};

      for (const line of lines) {
        const [node, value] = line.split(':');
        if (!node || !value) {
          throw new Error('Invalid heuristic format. Use format "node: value"');
        }

        const nodeKey = node.trim();
        const heuristicValue = parseFloat(value.trim());

        if (isNaN(heuristicValue)) {
          throw new Error(`Invalid heuristic value for node ${nodeKey}`);
        }

        heuristicValues[nodeKey] = heuristicValue;
      }

      // Store the heuristic values

      setError('');
      onHeuristicChange(heuristicValues);

      // Check if all nodes in the graph have a heuristic value
      if (graph) {
        const missingNodes = Object.keys(graph).filter(node => !(node in heuristicValues));
        if (missingNodes.length > 0) {
          setError(`Warning: Missing heuristic values for nodes: ${missingNodes.join(', ')}`);
        }
      }

      return heuristicValues;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const parseCostFunction = () => {
    try {
      // Parse the cost function text into values
      const lines = costFunctionText.trim().split('\n');
      const costValues = {};

      for (const line of lines) {
        const [edge, value] = line.split(':');
        if (!edge || !value) {
          throw new Error('Invalid cost function format. Use format "node1,node2: value"');
        }

        const [node1, node2] = edge.split(',').map(n => n.trim());
        if (!node1 || !node2) {
          throw new Error('Invalid edge format. Use format "node1,node2: value"');
        }

        const costValue = parseFloat(value.trim());

        if (isNaN(costValue)) {
          throw new Error(`Invalid cost value for edge ${node1},${node2}`);
        }

        costValues[`${node1},${node2}`] = costValue;
      }

      // Store the cost values

      setError('');
      onCostFunctionChange(costValues);

      return costValues;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  return (
    <div className="card">
      <h2>Heuristic and Cost Functions</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label>
            Heuristic Function h(n) (format: "node: value")
          </label>
          <textarea
            rows="6"
            value={heuristicText}
            onChange={handleHeuristicTextChange}
            placeholder="A: 10&#10;B: 8&#10;C: 5&#10;D: 7&#10;E: 3&#10;F: 6&#10;G: 0"
          />
          <button
            style={{ marginTop: '0.5rem' }}
            onClick={parseHeuristic}
          >
            Parse Heuristic
          </button>
        </div>

        <div>
          <label>
            Cost Function k(u,v) (format: "node1,node2: value")
          </label>
          <textarea
            rows="6"
            value={costFunctionText}
            onChange={handleCostFunctionTextChange}
            placeholder="A,B: 1&#10;A,C: 2&#10;A,D: 4&#10;B,E: 5&#10;C,F: 3&#10;D,G: 2"
          />
          <button
            style={{ marginTop: '0.5rem' }}
            onClick={parseCostFunction}
          >
            Parse Cost Function
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: '0.5rem' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default HeuristicInput;
