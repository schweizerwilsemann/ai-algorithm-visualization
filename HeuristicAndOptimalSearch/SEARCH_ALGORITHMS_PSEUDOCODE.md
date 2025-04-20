# Search Algorithms Pseudocode

This document provides pseudocode for the search algorithms implemented in the application, including how they track each step of the search process.

## Table of Contents

1. [Best-First Search](#best-first-search)
2. [Hill Climbing](#hill-climbing)
3. [A* (A-Star) Algorithm](#a-a-star-algorithm)
4. [Branch and Bound](#branch-and-bound)
5. [Step Tracking Mechanism](#step-tracking-mechanism)
6. [Step-by-Step Execution Example](#step-by-step-execution-example)

## Best-First Search

```
function bestFirstSearch(graph, startState, goalState, heuristicFn):
    // Initialize the list with the start state
    L = [startState]
    
    // Initialize step tracking
    steps = [
        {
            step: 0,
            description: "Initialization: L = {startState}",
            u: null,
            neighbors: null,
            L: copy(L)
        }
    ]
    
    // Keep track of the path
    cameFrom = {}
    cameFrom[startState] = null
    
    // Keep track of the step number
    stepNumber = 1
    
    // Loop until L is empty or goal is found
    while L is not empty:
        // Get the first node from L
        u = L.removeFirst()
        
        // If u is the goal, search succeeds
        if u == goalState:
            // Add step for goal found
            steps.add({
                step: stepNumber,
                description: "u = {u} is GOAL. Search succeeds.",
                u: u,
                neighbors: null,
                L: copy(L)
            })
            
            // Reconstruct the path
            path = []
            current = u
            while current != null:
                path.addToFront(current)
                current = cameFrom[current]
            
            return {success: true, steps: steps, path: path}
        
        // Get all neighbors of u
        neighbors = graph[u] or []
        
        // Add step for current node
        steps.add({
            step: stepNumber,
            description: "u = {u}",
            u: u,
            neighbors: null,
            L: copy(L)
        })
        stepNumber++
        
        // Insert all neighbors into L
        for each v in neighbors:
            if v is not in cameFrom:
                cameFrom[v] = u
                L.add(v)
        
        // Sort L in ascending order by the heuristic function values
        L.sortBy(node => heuristicFn(node))
        
        // Add step for neighbors
        steps.add({
            step: stepNumber,
            description: "Neighbors of {u}: {neighbors}. Sort L by heuristic.",
            u: u,
            neighbors: neighbors,
            L: copy(L)
        })
        stepNumber++
    
    // If we get here, search fails
    steps.add({
        step: stepNumber,
        description: "L is empty. Search fails.",
        u: null,
        neighbors: null,
        L: []
    })
    
    return {success: false, steps: steps, path: []}
```

## Hill Climbing

```
function hillClimbing(graph, startState, goalState, heuristicFn):
    // Initialize the list with the start state
    L = [startState]
    
    // Initialize step tracking
    steps = [
        {
            step: 0,
            description: "Initialization: L = {startState}",
            u: null,
            neighbors: null,
            L: copy(L)
        }
    ]
    
    // Keep track of the path
    cameFrom = {}
    cameFrom[startState] = null
    
    // Keep track of the step number
    stepNumber = 1
    
    // Loop until L is empty or goal is found
    while L is not empty:
        // Get the first node from L
        u = L.removeFirst()
        
        // If u is the goal, search succeeds
        if u == goalState:
            // Add step for goal found
            steps.add({
                step: stepNumber,
                description: "u = {u} is GOAL. Search succeeds.",
                u: u,
                neighbors: null,
                L: copy(L)
            })
            
            // Reconstruct the path
            path = []
            current = u
            while current != null:
                path.addToFront(current)
                current = cameFrom[current]
            
            return {success: true, steps: steps, path: path}
        
        // Get all neighbors of u
        neighbors = graph[u] or []
        
        // Add step for current node
        steps.add({
            step: stepNumber,
            description: "u = {u}",
            u: u,
            neighbors: null,
            L: copy(L)
        })
        stepNumber++
        
        // Create L1 for neighbors
        L1 = []
        
        // Insert all neighbors into L1
        for each v in neighbors:
            if v is not in cameFrom:
                cameFrom[v] = u
                L1.add(v)
        
        // Sort L1 in ascending order by the heuristic function values
        L1.sortBy(node => heuristicFn(node))
        
        // Insert L1 at the beginning of L
        L = concatenate(L1, L)
        
        // Add step for neighbors
        steps.add({
            step: stepNumber,
            description: "Neighbors of {u}: {neighbors}. Sort L1 by heuristic and insert at beginning of L.",
            u: u,
            neighbors: neighbors,
            L: copy(L)
        })
        stepNumber++
    
    // If we get here, search fails
    steps.add({
        step: stepNumber,
        description: "L is empty. Search fails.",
        u: null,
        neighbors: null,
        L: []
    })
    
    return {success: false, steps: steps, path: []}
```

## A* (A-Star) Algorithm

```
function aStar(graph, startState, goalState, heuristicFn, costFn):
    // Initialize the list with the start state
    L = [startState]
    
    // Initialize step tracking
    steps = [
        {
            step: 0,
            description: "Initialization: L = {startState}",
            u: null,
            neighbors: null,
            L: copy(L),
            g: {startState: 0},
            f: {startState: heuristicFn(startState)}
        }
    ]
    
    // Keep track of the path
    cameFrom = {}
    cameFrom[startState] = null
    
    // Keep track of g(n) - the cost from start to n
    gScore = {}
    gScore[startState] = 0
    
    // Keep track of f(n) = g(n) + h(n)
    fScore = {}
    fScore[startState] = heuristicFn(startState)
    
    // Keep track of the step number
    stepNumber = 1
    
    // Loop until L is empty or goal is found
    while L is not empty:
        // Get the first node from L
        u = L.removeFirst()
        
        // If u is the goal, search succeeds
        if u == goalState:
            // Add step for goal found
            steps.add({
                step: stepNumber,
                description: "u = {u} is GOAL. Search succeeds.",
                u: u,
                neighbors: null,
                L: copy(L),
                g: copy(gScore),
                f: copy(fScore)
            })
            
            // Reconstruct the path
            path = []
            current = u
            while current != null:
                path.addToFront(current)
                current = cameFrom[current]
            
            return {success: true, steps: steps, path: path}
        
        // Get all neighbors of u
        neighbors = graph[u] or []
        
        // Add step for current node
        steps.add({
            step: stepNumber,
            description: "u = {u}",
            u: u,
            neighbors: null,
            L: copy(L),
            g: copy(gScore),
            f: copy(fScore)
        })
        stepNumber++
        
        // Process all neighbors
        for each v in neighbors:
            // Calculate g(v) = g(u) + k(u,v)
            tentativeGScore = gScore[u] + costFn(u, v)
            
            // If v is not in gScore or if we found a better path to v
            if v is not in gScore or tentativeGScore < gScore[v]:
                // Update path and scores
                cameFrom[v] = u
                gScore[v] = tentativeGScore
                fScore[v] = gScore[v] + heuristicFn(v)
                
                // Add v to L if it's not already there
                if v is not in L:
                    L.add(v)
        
        // Sort L in ascending order by the values of f
        L.sortBy(node => fScore[node])
        
        // Add step for neighbors
        steps.add({
            step: stepNumber,
            description: "Neighbors of {u}: {neighbors}. Update g and f values. Sort L by f values.",
            u: u,
            neighbors: neighbors,
            L: copy(L),
            g: copy(gScore),
            f: copy(fScore)
        })
        stepNumber++
    
    // If we get here, search fails
    steps.add({
        step: stepNumber,
        description: "L is empty. Search fails.",
        u: null,
        neighbors: null,
        L: [],
        g: copy(gScore),
        f: copy(fScore)
    })
    
    return {success: false, steps: steps, path: []}
```

## Branch and Bound

```
function branchAndBound(graph, startState, goalState, heuristicFn, costFn):
    // Initialize the list with the start state
    L = [startState]
    
    // Initialize cost to infinity
    cost = Infinity
    
    // Initialize step tracking
    steps = [
        {
            step: 0,
            description: "Initialization: L = {startState}; cost = ∞",
            u: null,
            neighbors: null,
            L: copy(L),
            cost: cost,
            g: {startState: 0},
            f: {startState: heuristicFn(startState)}
        }
    ]
    
    // Keep track of the path
    cameFrom = {}
    cameFrom[startState] = null
    
    // Keep track of g(n) - the cost from start to n
    gScore = {}
    gScore[startState] = 0
    
    // Keep track of f(n) = g(n) + h(n)
    fScore = {}
    fScore[startState] = heuristicFn(startState)
    
    // Keep track of the best path
    bestPath = []
    
    // Keep track of the step number
    stepNumber = 1
    
    // Loop until L is empty
    while L is not empty:
        // Get the first node from L
        u = L.removeFirst()
        
        // Add step for current node
        steps.add({
            step: stepNumber,
            description: "u = {u}",
            u: u,
            neighbors: null,
            L: copy(L),
            cost: cost,
            g: copy(gScore),
            f: copy(fScore)
        })
        stepNumber++
        
        // If u is the goal, check if we found a better solution
        if u == goalState:
            if gScore[u] <= cost:
                cost = gScore[u]
                
                // Reconstruct the path
                bestPath = []
                current = u
                while current != null:
                    bestPath.addToFront(current)
                    current = cameFrom[current]
                
                steps.add({
                    step: stepNumber,
                    description: "u = {u} is GOAL. g(u) = {gScore[u]} <= cost = {cost}. Update cost = {gScore[u]}.",
                    u: u,
                    neighbors: null,
                    L: copy(L),
                    cost: cost,
                    g: copy(gScore),
                    f: copy(fScore)
                })
                stepNumber++
            else:
                steps.add({
                    step: stepNumber,
                    description: "u = {u} is GOAL. g(u) = {gScore[u]} > cost = {cost}. No update.",
                    u: u,
                    neighbors: null,
                    L: copy(L),
                    cost: cost,
                    g: copy(gScore),
                    f: copy(fScore)
                })
                stepNumber++
            
            // Continue searching for better solutions
            continue
        
        // If f(u) > cost, skip this node
        if fScore[u] > cost:
            steps.add({
                step: stepNumber,
                description: "f({u}) = {fScore[u]} > cost = {cost}. Skip this node.",
                u: u,
                neighbors: null,
                L: copy(L),
                cost: cost,
                g: copy(gScore),
                f: copy(fScore)
            })
            stepNumber++
            continue
        
        // Get all neighbors of u
        neighbors = graph[u] or []
        
        // Create L1 for neighbors
        L1 = []
        
        // Process all neighbors
        for each v in neighbors:
            // Calculate g(v) = g(u) + k(u,v)
            tentativeGScore = gScore[u] + costFn(u, v)
            
            // If v is not in gScore or if we found a better path to v
            if v is not in gScore or tentativeGScore < gScore[v]:
                // Update path and scores
                cameFrom[v] = u
                gScore[v] = tentativeGScore
                fScore[v] = gScore[v] + heuristicFn(v)
                
                // Add v to L1
                L1.add(v)
        
        // Sort L1 in ascending order by the values of f
        L1.sortBy(node => fScore[node])
        
        // Insert L1 at the beginning of L
        L = concatenate(L1, L)
        
        // Add step for neighbors
        steps.add({
            step: stepNumber,
            description: "Neighbors of {u}: {neighbors}. Update g and f values. Sort L1 by f values and insert at beginning of L.",
            u: u,
            neighbors: neighbors,
            L: copy(L),
            cost: cost,
            g: copy(gScore),
            f: copy(fScore)
        })
        stepNumber++
    
    // If we get here, return the best path found
    return {success: bestPath is not empty, steps: steps, path: bestPath}
```

## Step Tracking Mechanism

The step tracking mechanism is a common pattern across all search algorithms. It records the state of the search at each step for visualization and educational purposes.

```
// Initialize step tracking
steps = [
    {
        step: 0,
        description: "Initialization: L = {startState}",
        u: null,
        neighbors: null,
        L: copy(L),
        // Additional algorithm-specific information
        g: {startState: 0},                    // For A* and Branch and Bound
        f: {startState: heuristicFn(startState)}, // For A* and Branch and Bound
        cost: cost                             // For Branch and Bound
    }
]

// Keep track of the step number
stepNumber = 1

// Add step for current node
steps.add({
    step: stepNumber,
    description: "u = {u}",
    u: u,
    neighbors: null,
    L: copy(L),
    // Additional algorithm-specific information
    g: copy(gScore),                       // For A* and Branch and Bound
    f: copy(fScore),                       // For A* and Branch and Bound
    cost: cost                             // For Branch and Bound
})
stepNumber++

// Add step for neighbors
steps.add({
    step: stepNumber,
    description: "Neighbors of {u}: {neighbors}. [Algorithm-specific description]",
    u: u,
    neighbors: neighbors,
    L: copy(L),
    // Additional algorithm-specific information
    g: copy(gScore),                       // For A* and Branch and Bound
    f: copy(fScore),                       // For A* and Branch and Bound
    cost: cost                             // For Branch and Bound
})
stepNumber++
```

## Step-by-Step Execution Example

Let's trace through a simple example to illustrate how the A* algorithm works with step tracking:

Consider a simple graph:
```
A -- 1 --> B -- 2 --> C
|          |
3          1
|          |
v          v
D -- 2 --> E -- 1 --> F
```

With heuristic values:
```
h(A) = 5
h(B) = 4
h(C) = 0 (goal)
h(D) = 3
h(E) = 2
h(F) = 1
```

Let's trace the A* algorithm with start state A and goal state C:

### Step 0: Initialization
```
L = [A]
g(A) = 0
f(A) = g(A) + h(A) = 0 + 5 = 5
```

### Step 1: Process node A
```
u = A
L = []
```

### Step 2: Process neighbors of A
```
Neighbors of A: B, D
Calculate:
  g(B) = g(A) + cost(A,B) = 0 + 1 = 1
  f(B) = g(B) + h(B) = 1 + 4 = 5
  g(D) = g(A) + cost(A,D) = 0 + 3 = 3
  f(D) = g(D) + h(D) = 3 + 3 = 6
Sort L by f values:
L = [B, D]
```

### Step 3: Process node B
```
u = B
L = [D]
```

### Step 4: Process neighbors of B
```
Neighbors of B: C, E
Calculate:
  g(C) = g(B) + cost(B,C) = 1 + 2 = 3
  f(C) = g(C) + h(C) = 3 + 0 = 3
  g(E) = g(B) + cost(B,E) = 1 + 1 = 2
  f(E) = g(E) + h(E) = 2 + 2 = 4
Sort L by f values:
L = [C, E, D]
```

### Step 5: Process node C
```
u = C
C is the goal state. Search succeeds.
Path: A -> B -> C
```

The step tracking mechanism records each of these steps, allowing the user to see exactly how the algorithm explores the search space and finds the optimal path.

---

This pseudocode provides a comprehensive overview of the search algorithms implemented in the application, including how they track each step of the search process. The step-by-step execution example illustrates how the A* algorithm works with step tracking.
