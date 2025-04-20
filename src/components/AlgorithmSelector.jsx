import React from 'react';

const AlgorithmSelector = ({ selectedAlgorithm, onAlgorithmChange, onRunAlgorithm }) => {
  const algorithms = [
    { id: 'bestFirstSearch', name: 'Best-First Search' },
    { id: 'hillClimbing', name: 'Hill Climbing' },
    { id: 'aStar', name: 'A*' },
    { id: 'branchAndBound', name: 'Branch and Bound' }
  ];

  return (
    <div className="card">
      <h2>Algorithm Selection</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <select
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
        >
          <option value="">Select an algorithm</option>
          {algorithms.map(algo => (
            <option key={algo.id} value={algo.id}>
              {algo.name}
            </option>
          ))}
        </select>

        <button
          onClick={onRunAlgorithm}
          disabled={!selectedAlgorithm}
          style={{ backgroundColor: '#4CAF50' }}
        >
          Run Algorithm
        </button>
      </div>
    </div>
  );
};

export default AlgorithmSelector;
