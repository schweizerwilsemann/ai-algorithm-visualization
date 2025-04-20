import React from 'react';

const ResultDisplay = ({ result }) => {
  if (!result) {
    return null;
  }

  return (
    <div className="card">
      <h2>Result</h2>

      <div style={{ padding: '0.75rem', backgroundColor: '#333', border: '1px solid #444', borderRadius: '0.25rem' }}>
        <p style={{ fontWeight: '500' }}>
          {result.success ? (
            <>
              <span style={{ color: '#4CAF50' }}>Search successful!</span> Path found: {result.path.join(' → ')}
            </>
          ) : (
            <span style={{ color: '#f44336' }}>Search failed. No path found.</span>
          )}
        </p>

        {result.success && (
          <p style={{ marginTop: '0.5rem' }}>
            Path length: {result.path.length} nodes
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
