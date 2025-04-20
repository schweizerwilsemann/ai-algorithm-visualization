/**
 * Implementation of Best-First Search algorithm
 * 
 * @param {Object} graph - The graph representation
 * @param {string} startState - The starting node
 * @param {string} goalState - The goal node
 * @param {Function} heuristicFn - The heuristic function
 * @returns {Object} - The search result including steps and path
 */
export function bestFirstSearch(graph, startState, goalState, heuristicFn) {
  // Initialize the list with the start state
  let L = [startState];
  
  // Keep track of the steps for visualization
  const steps = [
    {
      step: 0,
      description: `Initialization: L = {${startState}}`,
      u: null,
      neighbors: null,
      L: [...L]
    }
  ];
  
  // Keep track of the path
  const cameFrom = {};
  cameFrom[startState] = null;
  
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
        L: []
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
        L: [...L]
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
      L: [...L]
    });
    stepNumber++;
    
    // Insert all neighbors into L
    for (const v of neighbors) {
      if (!(v in cameFrom)) {
        cameFrom[v] = u;
        L.push(v);
      }
    }
    
    // Sort L in ascending order by the heuristic function values
    L.sort((a, b) => heuristicFn(a) - heuristicFn(b));
    
    // Add step for neighbors
    steps.push({
      step: stepNumber,
      description: `Neighbors of ${u}: ${neighbors.join(', ')}. Sort L by heuristic.`,
      u,
      neighbors,
      L: [...L]
    });
    stepNumber++;
  }
  
  // If we get here, search fails
  steps.push({
    step: stepNumber,
    description: "L is empty. Search fails.",
    u: null,
    neighbors: null,
    L: []
  });
  
  return { success: false, steps, path: [] };
}
