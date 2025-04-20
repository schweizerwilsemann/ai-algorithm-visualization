import React, { useState } from 'react';

const GraphInput = ({ onGraphChange, onStartStateChange, onGoalStateChange }) => {
  const [graphText, setGraphText] = useState('');
  const [startState, setStartState] = useState('');
  const [goalState, setGoalState] = useState('');
  const [error, setError] = useState('');

  const handleGraphTextChange = (e) => {
    setGraphText(e.target.value);
  };

  const handleStartStateChange = (e) => {
    setStartState(e.target.value);
    onStartStateChange(e.target.value);
  };

  const handleGoalStateChange = (e) => {
    setGoalState(e.target.value);
    onGoalStateChange(e.target.value);
  };

  const parseGraph = () => {
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

      {error && (
        <div style={{ color: 'red', marginTop: '0.5rem' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default GraphInput;
