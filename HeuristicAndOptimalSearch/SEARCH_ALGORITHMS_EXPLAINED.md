# Search Algorithms: Detailed Explanation

This document provides a comprehensive explanation of the search algorithms implemented in the application, including how they work, how they track each step, and how they visualize the search process.

## Table of Contents

1. [Introduction to Search Algorithms](#introduction-to-search-algorithms)
2. [Best-First Search](#best-first-search)
3. [Hill Climbing](#hill-climbing)
4. [A* (A-Star) Algorithm](#a-a-star-algorithm)
5. [Branch and Bound](#branch-and-bound)
6. [Step Tracking Mechanism](#step-tracking-mechanism)
7. [Visualization Components](#visualization-components)

## Introduction to Search Algorithms

Search algorithms are methods for finding a path from a start state to a goal state in a graph or search space. In this application, four different search algorithms are implemented:

1. **Best-First Search**: A greedy search algorithm that expands the node that appears closest to the goal according to a heuristic function.
2. **Hill Climbing**: A local search algorithm that continually moves in the direction of increasing value to find the peak or maximum value.
3. **A* (A-Star)**: An informed search algorithm that combines the advantages of uniform-cost search and greedy best-first search.
4. **Branch and Bound**: An algorithm for solving optimization problems by systematically enumerating candidate solutions and discarding subsets of fruitless candidates.

Each algorithm is implemented with a step-tracking mechanism that records the state of the search at each step, allowing for visualization and educational purposes.

## Best-First Search

Best-First Search is a search algorithm that explores a graph by expanding the most promising node according to a specified heuristic function.

### How Best-First Search Works

1. **Initialization**:
   - Start with a list `L` containing only the start state
   - Initialize a `cameFrom` map to track the path

2. **Main Loop**:
   - While `L` is not empty:
     - Remove the first node `u` from `L`
     - If `u` is the goal state, return the path
     - Get all neighbors of `u`
     - Add all unvisited neighbors to `L`
     - Sort `L` by the heuristic function values (lowest first)

3. **Path Reconstruction**:
   - When the goal is found, use the `cameFrom` map to reconstruct the path

### Line-by-Line Explanation

```javascript
export function bestFirstSearch(graph, startState, goalState, heuristicFn) {
  // Initialize the list with the start state
  let L = [startState];
  
  // Keep track of the path
  const cameFrom = {};
  cameFrom[startState] = null;
```

The algorithm starts by initializing a list `L` with the start state and a `cameFrom` map to track the path. The `cameFrom` map stores for each node the node that led to it.

```javascript
  // Loop until L is empty or goal is found
  while (L.length > 0) {
    // Get the first node from L
    const u = L.shift();
    
    // If u is the goal, search succeeds
    if (u === goalState) {
      // Reconstruct the path
      const path = [];
      let current = u;
      while (current !== null) {
        path.unshift(current);
        current = cameFrom[current];
      }
      
      return { success: true, steps, path };
    }
```

In each iteration, the algorithm removes the first node `u` from `L`. If `u` is the goal state, the search succeeds, and the path is reconstructed using the `cameFrom` map.

```javascript
    // Get all neighbors of u
    const neighbors = graph[u] || [];
    
    // Insert all neighbors into L
    for (const v of neighbors) {
      if (!(v in cameFrom)) {
        cameFrom[v] = u;
        L.push(v);
      }
    }
    
    // Sort L in ascending order by the heuristic function values
    L.sort((a, b) => heuristicFn(a) - heuristicFn(b));
```

The algorithm gets all neighbors of `u` and adds them to `L` if they haven't been visited before. Then, it sorts `L` by the heuristic function values, so the most promising nodes (with the lowest heuristic values) are explored first.

## Hill Climbing

Hill Climbing is a local search algorithm that continually moves in the direction of increasing value to find the peak or maximum value. In the context of path finding, it's adapted to move toward decreasing heuristic values.

### How Hill Climbing Works

1. **Initialization**:
   - Start with a list `L` containing only the start state
   - Initialize a `cameFrom` map to track the path

2. **Main Loop**:
   - While `L` is not empty:
     - Remove the first node `u` from `L`
     - If `u` is the goal state, return the path
     - Get all neighbors of `u`
     - Create a new list `L1` with all unvisited neighbors
     - Sort `L1` by the heuristic function values (lowest first)
     - Insert `L1` at the beginning of `L`

3. **Path Reconstruction**:
   - When the goal is found, use the `cameFrom` map to reconstruct the path

### Line-by-Line Explanation

```javascript
export function hillClimbing(graph, startState, goalState, heuristicFn) {
  // Initialize the list with the start state
  let L = [startState];
  
  // Keep track of the path
  const cameFrom = {};
  cameFrom[startState] = null;
```

Similar to Best-First Search, Hill Climbing starts by initializing a list `L` with the start state and a `cameFrom` map to track the path.

```javascript
  // Loop until L is empty or goal is found
  while (L.length > 0) {
    // Get the first node from L
    const u = L.shift();
    
    // If u is the goal, search succeeds
    if (u === goalState) {
      // Reconstruct the path
      const path = [];
      let current = u;
      while (current !== null) {
        path.unshift(current);
        current = cameFrom[current];
      }
      
      return { success: true, steps, path };
    }
```

The main loop is similar to Best-First Search, removing the first node `u` from `L` and checking if it's the goal state.

```javascript
    // Get all neighbors of u
    const neighbors = graph[u] || [];
    
    // Create L1 for neighbors
    let L1 = [];
    
    // Insert all neighbors into L1
    for (const v of neighbors) {
      if (!(v in cameFrom)) {
        cameFrom[v] = u;
        L1.push(v);
      }
    }
    
    // Sort L1 in ascending order by the heuristic function values
    L1.sort((a, b) => heuristicFn(a) - heuristicFn(b));
    
    // Insert L1 at the beginning of L
    L = [...L1, ...L];
```

The key difference from Best-First Search is that Hill Climbing creates a new list `L1` for the neighbors, sorts it by the heuristic function values, and then inserts `L1` at the beginning of `L`. This ensures that the most promising neighbors of the current node are explored before any other nodes in `L`.

## A* (A-Star) Algorithm

A* is an informed search algorithm that combines the advantages of uniform-cost search (which finds the shortest path) and greedy best-first search (which uses a heuristic to search toward the goal).

### How A* Works

1. **Initialization**:
   - Start with a list `L` containing only the start state
   - Initialize a `cameFrom` map to track the path
   - Initialize `gScore` map with the cost from start to each node
   - Initialize `fScore` map with the estimated total cost from start to goal through each node

2. **Main Loop**:
   - While `L` is not empty:
     - Remove the first node `u` from `L`
     - If `u` is the goal state, return the path
     - Get all neighbors of `u`
     - For each neighbor `v`:
       - Calculate the tentative `gScore` for `v`
       - If this path to `v` is better than any previous one:
         - Update `cameFrom`, `gScore`, and `fScore` for `v`
         - Add `v` to `L` if it's not already there
     - Sort `L` by the `fScore` values (lowest first)

3. **Path Reconstruction**:
   - When the goal is found, use the `cameFrom` map to reconstruct the path

### Line-by-Line Explanation

```javascript
export function aStar(graph, startState, goalState, heuristicFn, costFn) {
  // Initialize the list with the start state
  let L = [startState];
  
  // Keep track of the path
  const cameFrom = {};
  cameFrom[startState] = null;
  
  // Keep track of g(n) - the cost from start to n
  const gScore = {};
  gScore[startState] = 0;
  
  // Keep track of f(n) = g(n) + h(n)
  const fScore = {};
  fScore[startState] = heuristicFn(startState);
```

A* initializes a list `L` with the start state, a `cameFrom` map to track the path, a `gScore` map to track the cost from start to each node, and an `fScore` map to track the estimated total cost from start to goal through each node.

```javascript
  // Loop until L is empty or goal is found
  while (L.length > 0) {
    // Get the first node from L
    const u = L.shift();
    
    // If u is the goal, search succeeds
    if (u === goalState) {
      // Reconstruct the path
      const path = [];
      let current = u;
      while (current !== null) {
        path.unshift(current);
        current = cameFrom[current];
      }
      
      return { success: true, steps, path };
    }
```

The main loop is similar to the previous algorithms, removing the first node `u` from `L` and checking if it's the goal state.

```javascript
    // Get all neighbors of u
    const neighbors = graph[u] || [];
    
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

For each neighbor `v` of `u`, A* calculates the tentative `gScore` for `v` (the cost from start to `v` through `u`). If this path to `v` is better than any previous one, it updates the path and scores for `v` and adds `v` to `L` if it's not already there. Then, it sorts `L` by the `fScore` values, so the most promising nodes (with the lowest estimated total cost) are explored first.

## Branch and Bound

Branch and Bound is an algorithm for solving optimization problems by systematically enumerating candidate solutions and discarding subsets of fruitless candidates.

### How Branch and Bound Works

1. **Initialization**:
   - Start with a list `L` containing only the start state
   - Initialize `cost` to infinity (the best solution found so far)
   - Initialize a `cameFrom` map to track the path
   - Initialize `gScore` map with the cost from start to each node
   - Initialize `fScore` map with the estimated total cost from start to goal through each node

2. **Main Loop**:
   - While `L` is not empty:
     - Remove the first node `u` from `L`
     - If `u` is the goal state:
       - If `gScore[u]` <= `cost`, update `cost` and the best path
     - If `fScore[u]` > `cost`, skip this node
     - Get all neighbors of `u`
     - For each neighbor `v`:
       - Calculate the tentative `gScore` for `v`
       - If this path to `v` is better than any previous one:
         - Update `cameFrom`, `gScore`, and `fScore` for `v`
         - Add `v` to a new list `L1`
     - Sort `L1` by the `fScore` values (lowest first)
     - Insert `L1` at the beginning of `L`

3. **Result**:
   - Return the best path found

### Line-by-Line Explanation

```javascript
export function branchAndBound(graph, startState, goalState, heuristicFn, costFn) {
  // Initialize the list with the start state
  let L = [startState];
  
  // Initialize cost to infinity
  let cost = Infinity;
  
  // Keep track of the path
  const cameFrom = {};
  cameFrom[startState] = null;
  
  // Keep track of g(n) - the cost from start to n
  const gScore = {};
  gScore[startState] = 0;
  
  // Keep track of f(n) = g(n) + h(n)
  const fScore = {};
  fScore[startState] = heuristicFn(startState);
  
  // Keep track of the best path
  let bestPath = [];
```

Branch and Bound initializes a list `L` with the start state, a `cost` variable to track the best solution found so far, a `cameFrom` map to track the path, a `gScore` map to track the cost from start to each node, an `fScore` map to track the estimated total cost, and a `bestPath` variable to store the best path found.

```javascript
  // Loop until L is empty
  while (L.length > 0) {
    // Get the first node from L
    const u = L.shift();
    
    // If u is the goal, check if we found a better solution
    if (u === goalState) {
      if (gScore[u] <= cost) {
        cost = gScore[u];
        
        // Reconstruct the path
        bestPath = [];
        let current = u;
        while (current !== null) {
          bestPath.unshift(current);
          current = cameFrom[current];
        }
      }
      
      // Continue searching for better solutions
      continue;
    }
```

In each iteration, the algorithm removes the first node `u` from `L`. If `u` is the goal state, it checks if the path to `u` is better than the best solution found so far. If it is, it updates the `cost` and `bestPath` variables. Then, it continues searching for better solutions.

```javascript
    // If f(u) > cost, skip this node
    if (fScore[u] > cost) {
      continue;
    }
    
    // Get all neighbors of u
    const neighbors = graph[u] || [];
    
    // Create L1 for neighbors
    let L1 = [];
    
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
        
        // Add v to L1
        L1.push(v);
      }
    }
    
    // Sort L1 in ascending order by the values of f
    L1.sort((a, b) => fScore[a] - fScore[b]);
    
    // Insert L1 at the beginning of L
    L = [...L1, ...L];
```

If `fScore[u]` > `cost`, the algorithm skips this node because it cannot lead to a better solution than the one already found. Otherwise, it processes all neighbors of `u` similar to A*, but adds them to a new list `L1` instead of directly to `L`. Then, it sorts `L1` by the `fScore` values and inserts `L1` at the beginning of `L`.

## Step Tracking Mechanism

All four search algorithms include a step tracking mechanism that records the state of the search at each step. This is used for visualization and educational purposes.

### How Step Tracking Works

1. **Initialization**:
   - Create a `steps` array to store the state of the search at each step
   - Add an initial step with the start state

2. **During Search**:
   - Add a step before processing each node
   - Add a step after processing the neighbors of each node
   - Add a step when the goal is found or the search fails

3. **Step Structure**:
   - Each step includes:
     - `step`: The step number
     - `description`: A description of what happens in this step
     - `u`: The current node being processed
     - `neighbors`: The neighbors of the current node
     - `L`: The current state of the list `L`
     - Additional algorithm-specific information (e.g., `g` and `f` values for A* and Branch and Bound)

### Example Step Tracking Code

```javascript
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

// Keep track of the step number
let stepNumber = 1;

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
```

## Visualization Components

The application includes several components for visualizing the search process:

1. **GraphVisualization**: Displays the graph and the path found by the algorithm
2. **StepDisplay**: Displays the state of the search at each step
3. **ResultDisplay**: Displays the result of the search (success or failure, path length, etc.)

### GraphVisualization

The `GraphVisualization` component displays the graph as a network of nodes and edges. It highlights the start state, goal state, and the path found by the algorithm.

```javascript
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
});
```

### StepDisplay

The `StepDisplay` component displays the state of the search at each step. It includes:
- The step number and description
- The current node being processed
- The neighbors of the current node
- The current state of the list `L`
- Additional algorithm-specific information (e.g., `g` and `f` values for A* and Branch and Bound)

```javascript
<div style={{ padding: '0.75rem', backgroundColor: '#333', border: '1px solid #444', borderRadius: '0.25rem' }}>
  <p style={{ fontWeight: '500' }}>{step.description}</p>
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
```

### ResultDisplay

The `ResultDisplay` component displays the result of the search, including whether the search was successful, the path found, and the path length.

---

This detailed explanation covers how the search algorithms work, how they track each step, and how they visualize the search process. The step tracking mechanism is particularly important for educational purposes, as it allows users to see exactly how the algorithms explore the search space and find the optimal path.
