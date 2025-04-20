/**
 * Implementation of Branch and Bound algorithm
 * 
 * @param {Object} graph - The graph representation
 * @param {string} startState - The starting node
 * @param {string} goalState - The goal node
 * @param {Function} heuristicFn - The heuristic function h(n)
 * @param {Function} costFn - The cost function k(u,v)
 * @returns {Object} - The search result including steps and path
 */
export function branchAndBound(graph, startState, goalState, heuristicFn, costFn) {
  // Initialize the list with the start state
  let L = [startState];
  
  // Initialize cost to infinity
  let cost = Infinity;
  
  // Keep track of the steps for visualization
  const steps = [
    {
      step: 0,
      description: `Initialization: L = {${startState}}; cost = ∞`,
      u: null,
      neighbors: null,
      L: [...L],
      cost,
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
  
  // Keep track of the best path
  let bestPath = [];
  
  // Keep track of the step number
  let stepNumber = 1;
  
  // Loop until L is empty
  while (L.length > 0) {
    // If L is empty, search fails
    if (L.length === 0) {
      steps.push({
        step: stepNumber,
        description: "L is empty. Search fails.",
        u: null,
        neighbors: null,
        L: [],
        cost,
        g: {...gScore},
        f: {...fScore}
      });
      return { success: bestPath.length > 0, steps, path: bestPath };
    }
    
    // Get the first node from L
    const u = L.shift();
    
    // Add step for current node
    steps.push({
      step: stepNumber,
      description: `u = ${u}`,
      u,
      neighbors: null,
      L: [...L],
      cost,
      g: {...gScore},
      f: {...fScore}
    });
    stepNumber++;
    
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
        
        steps.push({
          step: stepNumber,
          description: `u = ${u} is GOAL. g(u) = ${gScore[u]} <= cost = ${cost}. Update cost = ${gScore[u]}.`,
          u,
          neighbors: null,
          L: [...L],
          cost,
          g: {...gScore},
          f: {...fScore}
        });
        stepNumber++;
      } else {
        steps.push({
          step: stepNumber,
          description: `u = ${u} is GOAL. g(u) = ${gScore[u]} > cost = ${cost}. No update.`,
          u,
          neighbors: null,
          L: [...L],
          cost,
          g: {...gScore},
          f: {...fScore}
        });
        stepNumber++;
      }
      
      // Continue searching for better solutions
      continue;
    }
    
    // If f(u) > cost, skip this node
    if (fScore[u] > cost) {
      steps.push({
        step: stepNumber,
        description: `f(${u}) = ${fScore[u]} > cost = ${cost}. Skip this node.`,
        u,
        neighbors: null,
        L: [...L],
        cost,
        g: {...gScore},
        f: {...fScore}
      });
      stepNumber++;
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
    
    // Add step for neighbors
    steps.push({
      step: stepNumber,
      description: `Neighbors of ${u}: ${neighbors.join(', ')}. Update g and f values. Sort L1 by f values and insert at beginning of L.`,
      u,
      neighbors,
      L: [...L],
      cost,
      g: {...gScore},
      f: {...fScore}
    });
    stepNumber++;
  }
  
  // If we get here, return the best path found
  return { success: bestPath.length > 0, steps, path: bestPath };
}
