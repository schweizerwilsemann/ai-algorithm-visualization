import React from 'react';
import {
  GraphInput,
  HeuristicInput,
  AlgorithmSelector,
  StepDisplay,
  ResultDisplay,
  GraphVisualization
} from '../../components';
import {
  bestFirstSearch,
  hillClimbing,
  aStar,
  branchAndBound
} from '../../algorithms';
import { useState } from 'react';

function SearchPage() {
  // State for graph and algorithm inputs
  const [graph, setGraph] = useState(null);
  const [startState, setStartState] = useState('');
  const [goalState, setGoalState] = useState('');
  const [heuristicValues, setHeuristicValues] = useState({});
  const [costValues, setCostValues] = useState({});
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  
  // Create heuristic and cost functions from the values
  const heuristicFn = (node) => {
    if (node in heuristicValues) {
      return heuristicValues[node];
    }
    return Infinity; // Default value for nodes not in the heuristic
  };
  
  const costFn = (node1, node2) => {
    const key = `${node1},${node2}`;
    if (key in costValues) {
      return costValues[key];
    }
    return 1; // Default cost for edges not specified
  };
  
  // State for algorithm execution
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleGraphChange = (newGraph) => {
    setGraph(newGraph);
    // Reset result when graph changes
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
  };
  
  const handleStartStateChange = (newStartState) => {
    setStartState(newStartState);
    // Reset result when start state changes
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
  };
  
  const handleGoalStateChange = (newGoalState) => {
    setGoalState(newGoalState);
    // Reset result when goal state changes
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
  };
  
  const handleHeuristicChange = (heuristicData) => {
    setHeuristicValues(heuristicData);
    // Reset result when heuristic changes
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
  };
  
  const handleCostFunctionChange = (costData) => {
    setCostValues(costData);
    // Reset result when cost function changes
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
  };
  
  const handleAlgorithmChange = (newAlgorithm) => {
    setSelectedAlgorithm(newAlgorithm);
    // Reset result when algorithm changes
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
  };
  
  const handleStepChange = (newStep) => {
    setCurrentStep(newStep);
  };
  
  const runAlgorithm = () => {
    if (!graph || !startState || !goalState || Object.keys(heuristicValues).length === 0 || !selectedAlgorithm) {
      alert('Please provide all required inputs: graph, start state, goal state, and heuristic function.');
      return;
    }
    
    let algorithmResult;
    
    switch (selectedAlgorithm) {
      case 'bestFirstSearch':
        algorithmResult = bestFirstSearch(graph, startState, goalState, heuristicFn);
        break;
      case 'hillClimbing':
        algorithmResult = hillClimbing(graph, startState, goalState, heuristicFn);
        break;
      case 'aStar':
        if (Object.keys(costValues).length === 0) {
          alert('A* algorithm requires a cost function.');
          return;
        }
        algorithmResult = aStar(graph, startState, goalState, heuristicFn, costFn);
        break;
      case 'branchAndBound':
        if (Object.keys(costValues).length === 0) {
          alert('Branch and Bound algorithm requires a cost function.');
          return;
        }
        algorithmResult = branchAndBound(graph, startState, goalState, heuristicFn, costFn);
        break;
      default:
        alert('Please select a valid algorithm.');
        return;
    }
    
    setResult(algorithmResult);
    setSteps(algorithmResult.steps);
    setCurrentStep(0);
  };

  return (
    <div>
      <header>
        <h1>Search Algorithms Visualization</h1>
        <p>
          Visualize and compare different search algorithms: Best-First Search, Hill Climbing, A*, and Branch and Bound
        </p>
      </header>
      
      <div className="grid">
        <div>
          <GraphInput
            onGraphChange={handleGraphChange}
            onStartStateChange={handleStartStateChange}
            onGoalStateChange={handleGoalStateChange}
          />
          
          <HeuristicInput
            graph={graph}
            onHeuristicChange={handleHeuristicChange}
            onCostFunctionChange={handleCostFunctionChange}
          />
          
          <AlgorithmSelector
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmChange={handleAlgorithmChange}
            onRunAlgorithm={runAlgorithm}
          />
        </div>
        
        <div>
          <GraphVisualization
            graph={graph}
            startState={startState}
            goalState={goalState}
            path={result?.path}
          />
          
          <ResultDisplay result={result} />
          
          <StepDisplay
            steps={steps}
            currentStep={currentStep}
            onStepChange={handleStepChange}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
