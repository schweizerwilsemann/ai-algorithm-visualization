import React, { useState } from 'react';

const GraphInput = ({ onGraphChange, onStartStateChange, onGoalStateChange }) => {
  const [graphText, setGraphText] = useState('');
  const [startState, setStartState] = useState('');
  const [goalState, setGoalState] = useState('');
  const [error, setError] = useState('');
  const [formatError, setFormatError] = useState('');

  // Regular expression for validating graph input format
  const graphLineRegex = /^[A-Za-z0-9]+:\s*([A-Za-z0-9]+(,\s*[A-Za-z0-9]+)*)?$/;

  const validateGraphFormat = (text) => {
    if (!text.trim()) return true; // Empty input is valid during typing

    const lines = text.trim().split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !graphLineRegex.test(line)) {
        setFormatError(`Line ${i + 1} does not match format "node: neighbor1,neighbor2,..."`);
        return false;
      }
    }
    setFormatError('');
    return true;
  };

  const handleGraphTextChange = (e) => {
    const newText = e.target.value;
    setGraphText(newText);
    validateGraphFormat(newText);
  };

  const handleStartStateChange = (e) => {
    const value = e.target.value.trim();
    // Only allow single alphanumeric node names
    if (/^[A-Za-z0-9]*$/.test(value)) {
      setStartState(value);
      onStartStateChange(value);
    }
  };

  const handleGoalStateChange = (e) => {
    const value = e.target.value.trim();
    // Only allow single alphanumeric node names
    if (/^[A-Za-z0-9]*$/.test(value)) {
      setGoalState(value);
      onGoalStateChange(value);
    }
  };

  const parseGraph = () => {
    // First validate the format
    if (!validateGraphFormat(graphText)) {
      return null;
    }

    try {
      // Parse the graph text into an adjacency list
      const lines = graphText.trim().split('\n');
      const graph = {};

      for (const line of lines) {
        const [node, neighbors] = line.split(':');
        if (!node || !neighbors) {
          throw new Error('Invalid graph format. Use format "node: neighbor1,neighbor2,..."');
        }

        const nodeKey = node.trim();
        const neighborsList = neighbors.split(',').map(n => n.trim()).filter(n => n);

        graph[nodeKey] = neighborsList;
      }

      setError('');
      setFormatError('');
      onGraphChange(graph);

      // If start or goal state is not in the graph, show a warning
      if (startState && !graph[startState]) {
        setError(`Warning: Start state "${startState}" is not in the graph.`);
      }

      if (goalState && !graph[goalState]) {
        setError(`Warning: Goal state "${goalState}" is not in the graph.`);
      }

      return graph;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  return (
    <div className="card">
      <h2>Graph Input</h2>

      <div>
        <label>
          Graph (format: "node: neighbor1,neighbor2,...")
        </label>
        <textarea
          rows="6"
          value={graphText}
          onChange={handleGraphTextChange}
          placeholder="A: B,C,D&#10;B: A,E&#10;C: A,F&#10;D: A,G&#10;E: B&#10;F: C&#10;G: D"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label>
            Start State
          </label>
          <input
            type="text"
            value={startState}
            onChange={handleStartStateChange}
            placeholder="A"
          />
        </div>

        <div>
          <label>
            Goal State
          </label>
          <input
            type="text"
            value={goalState}
            onChange={handleGoalStateChange}
            placeholder="G"
          />
        </div>
      </div>

      <button
        onClick={parseGraph}
      >
        Parse Graph
      </button>

      {formatError && (
        <div style={{ color: 'red', marginTop: '0.5rem' }}>
          <strong>Format Error:</strong> {formatError}
        </div>
      )}

      {error && !formatError && (
        <div style={{ color: 'orange', marginTop: '0.5rem' }}>
          <strong>Warning:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default GraphInput;
