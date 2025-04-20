/**
 * Implementation of A* algorithm
 * 
 * @param {Object} graph - The graph representation
 * @param {string} startState - The starting node
 * @param {string} goalState - The goal node
 * @param {Function} heuristicFn - The heuristic function h(n)
 * @param {Function} costFn - The cost function k(u,v)
 * @returns {Object} - The search result including steps and path
 */
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
    // If L is empty, search fails
    if (L.length === 0) {
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
