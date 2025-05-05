# Heuristic and Optimal Search Algorithms: User Input to Algorithm Flow

This document explains the complete flow from user interactions in the UI components to the execution of heuristic and optimal search algorithms, with a focus on how user inputs are processed and passed to the algorithms.

## Table of Contents

1. [Overview of Search Algorithms](#overview-of-search-algorithms)
2. [Component Structure](#component-structure)
3. [User Input Flow](#user-input-flow)
   - [Graph Input](#graph-input)
   - [Heuristic and Cost Function Input](#heuristic-and-cost-function-input)
   - [Algorithm Selection and Execution](#algorithm-selection-and-execution)
4. [Algorithm Execution and Step Tracking](#algorithm-execution-and-step-tracking)
5. [Visualization of Results](#visualization-of-results)
6. [Detailed Example: A* Algorithm](#detailed-example-a-algorithm)

## Overview of Search Algorithms

The application implements four different search algorithms:

1. **Best-First Search**: A greedy search algorithm that expands the node that appears closest to the goal according to a heuristic function.
2. **Hill Climbing**: A local search algorithm that continually moves in the direction of increasing value to find the peak or maximum value.
3. **A* (A-Star)**: An informed search algorithm that combines the advantages of uniform-cost search and greedy best-first search.
4. **Branch and Bound**: An algorithm for solving optimization problems by systematically enumerating candidate solutions and discarding subsets of fruitless candidates.

Each algorithm is implemented with a step-tracking mechanism that records the state of the search at each step, allowing for visualization and educational purposes.

## Component Structure

The search algorithm visualization is built with the following components:

1. **SearchPage**: The main page component that manages the state and coordinates the other components.
2. **GraphInput**: Allows users to input the graph structure, start state, and goal state.
3. **HeuristicInput**: Allows users to input heuristic values and cost function values.
4. **AlgorithmSelector**: Allows users to select an algorithm and run it.
5. **GraphVisualization**: Displays the graph and the path found by the algorithm.
6. **StepDisplay**: Displays the state of the search at each step.
7. **ResultDisplay**: Displays the result of the search.

## User Input Flow

### Graph Input

The flow for inputting the graph structure:

1. **User Interaction**: User enters the graph structure in the textarea in the format "node: neighbor1,neighbor2,...".

2. **Event Handler**: The `handleGraphTextChange` function in `GraphInput.jsx` updates the component's state:
   ```jsx
   const handleGraphTextChange = (e) => {
     setGraphText(e.target.value);
   };
   ```

3. **Graph Parsing**: When the user clicks the "Parse Graph" button, the `parseGraph` function is called:
   ```jsx
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

       // Validation checks...

       return graph;
     } catch (err) {
       setError(err.message);
       return null;
     }
   };
   ```

4. **Parent Component Update**: The `onGraphChange` function is a prop passed from the parent `SearchPage` component:
   ```jsx
   const handleGraphChange = (newGraph) => {
     setGraph(newGraph);
   };
   ```

5. **State Update**: The `setGraph` function updates the `graph` state in the `SearchPage` component, which will be used when running the algorithms.

Similarly, the start state and goal state are handled by the `handleStartStateChange` and `handleGoalStateChange` functions, which update the state in the parent component.

### Heuristic and Cost Function Input

The flow for inputting heuristic values and cost function values:

1. **User Interaction**: User enters heuristic values in the format "node: value" and cost function values in the format "node1,node2: value".

2. **Event Handlers**: The `handleHeuristicTextChange` and `handleCostFunctionTextChange` functions update the component's state:
   ```jsx
   const handleHeuristicTextChange = (e) => {
     setHeuristicText(e.target.value);
   };

   const handleCostFunctionTextChange = (e) => {
     setCostFunctionText(e.target.value);
   };
   ```

3. **Parsing**: When the user clicks the "Parse Heuristic" or "Parse Cost Function" button, the `parseHeuristic` or `parseCostFunction` function is called:
   ```jsx
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

       setError('');
       onHeuristicChange(heuristicValues);

       // Validation checks...

       return heuristicValues;
     } catch (err) {
       setError(err.message);
       return null;
     }
   };
   ```

4. **Parent Component Update**: The `onHeuristicChange` or `onCostFunctionChange` function is a prop passed from the parent `SearchPage` component:
   ```jsx
   const handleHeuristicChange = (newHeuristicValues) => {
     setHeuristicValues(newHeuristicValues);
   };

   const handleCostFunctionChange = (newCostValues) => {
     setCostValues(newCostValues);
   };
   ```

5. **State Update**: The `setHeuristicValues` or `setCostValues` function updates the state in the `SearchPage` component, which will be used when running the algorithms.

### Algorithm Selection and Execution

The flow for selecting and running an algorithm:

1. **User Interaction**: User selects an algorithm from the dropdown and clicks the "Run Algorithm" button.

2. **Event Handlers**: The `handleAlgorithmChange` function updates the component's state, and the `onRunAlgorithm` function is called when the button is clicked:
   ```jsx
   // In AlgorithmSelector.jsx
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
   ```

3. **Parent Component Update**: The `onAlgorithmChange` and `onRunAlgorithm` functions are props passed from the parent `SearchPage` component:
   ```jsx
   const handleAlgorithmChange = (algorithm) => {
     setSelectedAlgorithm(algorithm);
   };

   const runAlgorithm = () => {
     // Validation checks...
     
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
   ```

4. **Algorithm Execution**: The selected algorithm is called with the appropriate parameters, and the result is stored in the state.

## Algorithm Execution and Step Tracking

When an algorithm is executed, it not only finds a path from the start state to the goal state but also tracks each step of the search process. This step tracking is crucial for visualization and educational purposes.

Let's look at how the A* algorithm implements step tracking:

```javascript
export function aStar(graph, startState, goalState, heuristicFn, costFn) {
  // Initialize the list with the start state
  let L = [startState];
  
  // Keep track of the steps for visualization
  const steps = [
    {
      step: 0,
      description: `Initialization: L = {${startState}}`,
      u: null,
      neighbors: null,
      L: [...L],
      g: { [startState]: 0 },
      f: { [startState]: heuristicFn(startState) }
    }
  ];
  
  // Keep track of the path
  const cameFrom = {};
  cameFrom[startState] = null;
  
  // Keep track of g(n) - the cost from start to n
  const gScore = {};
  gScore[startState] = 0;
  
  // Keep track of f(n) = g(n) + h(n)
  const fScore = {};
  fScore[startState] = heuristicFn(startState);
  
  // Keep track of the step number
  let stepNumber = 1;
  
  // Loop until L is empty or goal is found
  while (L.length > 0) {
    // Get the first node from L
    const u = L.shift();
    
    // If u is the goal, search succeeds
    if (u === goalState) {
      steps.push({
        step: stepNumber,
        description: `u = ${u} is GOAL. Search succeeds.`,
        u,
        neighbors: null,
        L: [...L],
        g: {...gScore},
        f: {...fScore}
      });
      
      // Reconstruct the path
      const path = [];
      let current = u;
      while (current !== null) {
        path.unshift(current);
        current = cameFrom[current];
      }
      
      return { success: true, steps, path };
    }
    
    // Get all neighbors of u
    const neighbors = graph[u] || [];
    
    // Add step for current node
    steps.push({
      step: stepNumber,
      description: `u = ${u}`,
      u,
      neighbors: null,
      L: [...L],
      g: {...gScore},
      f: {...fScore}
    });
    stepNumber++;
    
    // Process all neighbors
    for (const v of neighbors) {
      // Calculate g(v) = g(u) + k(u,v)
      const tentativeGScore = gScore[u] + costFn(u, v);
      
      // If v is not in gScore or if we found a better path to v
      if (!(v in gScore) || tentativeGScore < gScore[v]) {
        // Update path and scores
        cameFrom[v] = u;
        gScore[v] = tentativeGScore;
        fScore[v] = gScore[v] + heuristicFn(v);
        
        // Add v to L if it's not already there
        if (!L.includes(v)) {
          L.push(v);
        }
      }
    }
    
    // Sort L in ascending order by the values of f
    L.sort((a, b) => fScore[a] - fScore[b]);
    
    // Add step for neighbors
    steps.push({
      step: stepNumber,
      description: `Neighbors of ${u}: ${neighbors.join(', ')}. Update g and f values. Sort L by f values.`,
      u,
      neighbors,
      L: [...L],
      g: {...gScore},
      f: {...fScore}
    });
    stepNumber++;
  }
  
  // If we get here, search fails
  steps.push({
    step: stepNumber,
    description: "L is empty. Search fails.",
    u: null,
    neighbors: null,
    L: [],
    g: {...gScore},
    f: {...fScore}
  });
  
  return { success: false, steps, path: [] };
}
```

Each step of the algorithm is recorded in the `steps` array, which includes:
- The step number
- A description of what happens in this step
- The current node being processed
- The neighbors of the current node
- The current state of the list `L`
- The g and f values for each node (for A* and Branch and Bound)

This detailed step tracking allows the user to see exactly how the algorithm explores the search space and finds the optimal path.

## Visualization of Results

After the algorithm is executed, the results are visualized in three components:

1. **GraphVisualization**: Displays the graph and the path found by the algorithm.
   ```jsx
   <GraphVisualization
     graph={graph}
     startState={startState}
     goalState={goalState}
     path={result?.path}
   />
   ```

2. **ResultDisplay**: Displays the result of the search, including whether the search was successful and the path found.
   ```jsx
   <ResultDisplay result={result} />
   ```

3. **StepDisplay**: Displays the state of the search at each step, allowing the user to navigate through the steps.
   ```jsx
   <StepDisplay
     steps={steps}
     currentStep={currentStep}
     onStepChange={handleStepChange}
   />
   ```

The `StepDisplay` component is particularly important for educational purposes, as it allows the user to see exactly how the algorithm explores the search space and finds the optimal path. It includes controls for navigating through the steps:

```jsx
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
```

## Detailed Example: A* Algorithm

Let's trace through a complete example of how user input flows to the A* algorithm execution:

### 1. User Inputs

The user inputs the following:

- **Graph**:
  ```
  A: B,C
  B: A,D,E
  C: A,F
  D: B
  E: B,G
  F: C,G
  G: E,F
  ```

- **Start State**: A
- **Goal State**: G

- **Heuristic Values**:
  ```
  A: 5
  B: 4
  C: 4
  D: 5
  E: 2
  F: 1
  G: 0
  ```

- **Cost Function Values**:
  ```
  A,B: 1
  A,C: 2
  B,D: 2
  B,E: 3
  C,F: 1
  E,G: 2
  F,G: 3
  ```

### 2. Parsing and State Updates

When the user clicks the "Parse Graph" button, the `parseGraph` function is called, which parses the graph text into an adjacency list and updates the `graph` state in the `SearchPage` component:

```javascript
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'G'],
  F: ['C', 'G'],
  G: ['E', 'F']
};
```

Similarly, the heuristic values and cost function values are parsed and stored in the state:

```javascript
const heuristicValues = {
  A: 5,
  B: 4,
  C: 4,
  D: 5,
  E: 2,
  F: 1,
  G: 0
};

const costValues = {
  'A-B': 1,
  'A-C': 2,
  'B-D': 2,
  'B-E': 3,
  'C-F': 1,
  'E-G': 2,
  'F-G': 3
};
```

### 3. Algorithm Selection and Execution

The user selects "A*" from the dropdown and clicks the "Run Algorithm" button. This calls the `runAlgorithm` function in the `SearchPage` component, which creates the heuristic and cost functions and calls the A* algorithm:

```javascript
// Create heuristic function
const heuristicFn = (node) => {
  return heuristicValues[node] || 0;
};

// Create cost function
const costFn = (u, v) => {
  return costValues[`${u}-${v}`] || costValues[`${v}-${u}`] || 1;
};

// Call A* algorithm
const algorithmResult = aStar(graph, startState, goalState, heuristicFn, costFn);
```

### 4. A* Algorithm Execution

The A* algorithm is executed with the provided parameters. It initializes the necessary data structures and starts exploring the graph:

```javascript
// Initialize the list with the start state
let L = ['A'];

// Keep track of the path
const cameFrom = {};
cameFrom['A'] = null;

// Keep track of g(n) - the cost from start to n
const gScore = {};
gScore['A'] = 0;

// Keep track of f(n) = g(n) + h(n)
const fScore = {};
fScore['A'] = heuristicFn('A'); // 5
```

The algorithm then enters its main loop, where it repeatedly:
1. Removes the first node from `L`
2. Checks if it's the goal state
3. Processes all neighbors of the current node
4. Sorts `L` by the f values
5. Records each step in the `steps` array

For example, when processing node 'A':

```javascript
// Get the first node from L
const u = 'A';

// Get all neighbors of u
const neighbors = ['B', 'C'];

// Process all neighbors
for (const v of neighbors) {
  // Calculate g(v) = g(u) + k(u,v)
  const tentativeGScore = gScore[u] + costFn(u, v);
  
  // If v is not in gScore or if we found a better path to v
  if (!(v in gScore) || tentativeGScore < gScore[v]) {
    // Update path and scores
    cameFrom[v] = u;
    gScore[v] = tentativeGScore;
    fScore[v] = gScore[v] + heuristicFn(v);
    
    // Add v to L if it's not already there
    if (!L.includes(v)) {
      L.push(v);
    }
  }
}

// Sort L in ascending order by the values of f
L.sort((a, b) => fScore[a] - fScore[b]);
```

This process continues until the goal state 'G' is found or `L` becomes empty.

### 5. Result and Visualization

The A* algorithm returns an object with the search result, including whether the search was successful, the path found, and the steps taken:

```javascript
return {
  success: true,
  steps: steps,
  path: ['A', 'C', 'F', 'G']
};
```

This result is stored in the state and used to update the visualization components:

```javascript
setResult(algorithmResult);
setSteps(algorithmResult.steps);
setCurrentStep(0);
```

The `GraphVisualization` component displays the graph and the path found, the `ResultDisplay` component displays the result of the search, and the `StepDisplay` component displays the state of the search at each step.

The user can then navigate through the steps using the controls in the `StepDisplay` component, seeing exactly how the A* algorithm explored the search space and found the optimal path.

---

This document has explained the complete flow from user inputs in the UI components to the execution of heuristic and optimal search algorithms, with a focus on how user inputs are processed and passed to the algorithms. Understanding this flow is essential for working with and extending the application.
