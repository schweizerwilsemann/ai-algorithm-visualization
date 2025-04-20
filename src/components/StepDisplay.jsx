import React from 'react';

const StepDisplay = ({ steps, currentStep, onStepChange }) => {
  if (!steps || steps.length === 0) {
    return (
      <div className="card">
        <h2>Algorithm Steps</h2>
        <p>No steps to display. Run an algorithm first.</p>
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="card">
      <h2>Algorithm Steps</h2>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: '500' }}>Step {currentStep + 1} of {steps.length}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              style={{ padding: '0.25rem 0.75rem', backgroundColor: '#ccc' }}
              onClick={() => onStepChange(0)}
              disabled={currentStep === 0}
            >
              First
            </button>
            <button
              style={{ padding: '0.25rem 0.75rem', backgroundColor: '#ccc' }}
              onClick={() => onStepChange(currentStep - 1)}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <button
              style={{ padding: '0.25rem 0.75rem', backgroundColor: '#ccc' }}
              onClick={() => onStepChange(currentStep + 1)}
              disabled={currentStep === steps.length - 1}
            >
              Next
            </button>
            <button
              style={{ padding: '0.25rem 0.75rem', backgroundColor: '#ccc' }}
              onClick={() => onStepChange(steps.length - 1)}
              disabled={currentStep === steps.length - 1}
            >
              Last
            </button>
          </div>
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: '#333', border: '1px solid #444', borderRadius: '0.25rem' }}>
          <p style={{ fontWeight: '500' }}>{step.description}</p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>u</th>
              <th>Neighbors of u</th>
              <th>L</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {step.u || '-'}
              </td>
              <td>
                {step.neighbors ? step.neighbors.join(', ') : '-'}
              </td>
              <td>
                {step.L.length > 0 ? step.L.join(', ') : 'Empty'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Additional information for A* and Branch and Bound */}
      {(step.g || step.f) && (
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Additional Information</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {step.g && (
              <div>
                <h4 style={{ fontWeight: '500' }}>g values:</h4>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                  {Object.entries(step.g).map(([node, value]) => (
                    <li key={`g-${node}`}>g({node}) = {value}</li>
                  ))}
                </ul>
              </div>
            )}

            {step.f && (
              <div>
                <h4 style={{ fontWeight: '500' }}>f values:</h4>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                  {Object.entries(step.f).map(([node, value]) => (
                    <li key={`f-${node}`}>f({node}) = {value}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {step.cost !== undefined && (
            <div style={{ marginTop: '0.5rem' }}>
              <h4 style={{ fontWeight: '500' }}>Current best cost: {step.cost === Infinity ? '∞' : step.cost}</h4>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepDisplay;
