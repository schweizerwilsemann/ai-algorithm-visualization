# User Input to Algorithm Flow: Detailed Explanation

This document explains the complete flow from user interactions in the UI components (JSX files) to the execution of algorithms in the JavaScript files, with a focus on the handle functions that process user inputs.

## Table of Contents

1. [Overview of the Flow](#overview-of-the-flow)
2. [User Input: Search Depth Change Example](#user-input-search-depth-change-example)
3. [User Input: Making a Move Example](#user-input-making-a-move-example)
4. [User Input: Running a Search Algorithm Example](#user-input-running-a-search-algorithm-example)
5. [Component Communication Pattern](#component-communication-pattern)
6. [Handle Functions in Detail](#handle-functions-in-detail)

## Overview of the Flow

The general flow from user input to algorithm execution follows these steps:

1. **User Interaction**: User interacts with a UI component (button click, dropdown selection, etc.)
2. **Event Handler**: The interaction triggers an event handler in the JSX component
3. **State Update**: The handler updates the component's state or calls a parent component's function
4. **Algorithm Execution**: The state change triggers the execution of an algorithm
5. **Result Processing**: The algorithm's result is processed and used to update the UI

Let's examine specific examples to understand this flow in detail.

## User Input: Search Depth Change Example

Let's trace the flow when a user changes the AI search depth in the Draughts game:

### 1. UI Component (GameControls.jsx)

```jsx
<select
  value={searchDepth}
  onChange={(e) => onSearchDepthChange(e.target.value)}
>
  <option value="2">2 (Fast, Weak)</option>
  <option value="3">3</option>
  <option value="4">4 (Balanced)</option>
  <option value="5">5</option>
  <option value="6">6 (Slow, Strong)</option>
</select>
```

When the user selects a different option from the dropdown, the `onChange` event fires, calling the `onSearchDepthChange` function with the selected value.

### 2. Parent Component (DraughtsPage.jsx)

The `GameControls` component receives the `onSearchDepthChange` function as a prop from its parent:

```jsx
<GameControls
  gameMode={gameMode}
  searchDepth={searchDepth}
  currentPlayer={currentPlayer}
  onGameModeChange={handleGameModeChange}
  onSearchDepthChange={handleSearchDepthChange}
  onResetGame={initializeBoard}
  onMakeRandomMove={makeRandomMove}
/>
```

### 3. Handle Function in Parent Component

In `DraughtsPage.jsx`, the `handleSearchDepthChange` function is defined:

```jsx
const handleSearchDepthChange = (depth) => {
  setSearchDepth(parseInt(depth, 10));
};
```

This function parses the string value from the dropdown to an integer and updates the `searchDepth` state variable.

### 4. Effect on Algorithm Execution

The updated `searchDepth` value is used in the `makeAIMove` function:

```jsx
const makeAIMove = () => {
  if (gameStatus !== 'ongoing') return;

  // Determine which player is moving (AI or random bot)
  const isRandomBot = gameMode === AI_VS_RANDOM && currentPlayer === BLACK;
  const playerToMove = currentPlayer;
  const opponentPlayer = playerToMove === WHITE ? BLACK : WHITE;

  // Use minimax to find the best move for AI
  const depth = searchDepth;

  let bestMove;
  if (isRandomBot) {
    // In manual mode, don't make random moves automatically
    return;
  } else {
    // AI uses minimax
    const result = minimax(board, depth, playerToMove, opponentPlayer, -Infinity, Infinity, true);
    bestMove = result.move;
    console.log('AI selected move using minimax:', bestMove);
  }

  if (bestMove) {
    movePiece(bestMove.from.row, bestMove.from.col, bestMove.to.row, bestMove.to.col);
  }
};
```

The `searchDepth` value is passed directly to the `minimax` function, affecting how deep the AI searches for the best move.

### 5. Algorithm Execution (minimax.js)

The `minimax` function uses the `depth` parameter to determine how deep to search:

```javascript
export function minimax(board, depth, player, opponent, alpha, beta, isMaximizingPlayer) {
  // Base case: depth reached or game over
  if (depth === 0) {
    return { score: evaluateBoard(board, player, opponent), move: null };
  }
  
  // ... rest of the algorithm
  
  // Recursive calls with depth - 1
  const result = minimax(newBoard, depth - 1, player, opponent, alpha, beta, false);
```

### 6. Visualization Update

The `searchDepth` is also passed to the `MinimaxStateTree` component:

```jsx
<MinimaxStateTree
  board={board}
  currentPlayer={currentPlayer}
  searchDepth={searchDepth}
/>
```

Which uses it to determine the visualization depth:

```jsx
// Allow visualization up to the full search depth (with a reasonable upper limit)
const visualizationDepth = Math.min(searchDepth, 6);
const result = minimaxWithTracking(board, visualizationDepth, currentPlayer, opponent);
```

## User Input: Making a Move Example

Let's trace the flow when a user makes a move in the Draughts game:

### 1. UI Component (DraughtsBoard.jsx)

```jsx
const handleCellClick = (row, col) => {
  // If a piece is already selected and the clicked cell is a valid move
  if (selectedPiece && validMoves.some(move => move.row === row && move.col === col)) {
    onMovePiece(selectedPiece.row, selectedPiece.col, row, col);
  } else {
    // Otherwise, try to select a piece
    onSelectPiece(row, col);
  }
};
```

When the user clicks on a cell, the `handleCellClick` function is called, which either selects a piece or makes a move depending on the current state.

### 2. Parent Component (DraughtsPage.jsx)

The `DraughtsBoard` component receives the `onSelectPiece` and `onMovePiece` functions as props:

```jsx
<DraughtsBoard
  board={board}
  selectedPiece={selectedPiece}
  validMoves={validMoves}
  onSelectPiece={selectPiece}
  onMovePiece={movePiece}
/>
```

### 3. Handle Functions in Parent Component

In `DraughtsPage.jsx`, the `selectPiece` and `movePiece` functions are defined:

```jsx
const selectPiece = (row, col) => {
  if (gameStatus !== 'ongoing') return;

  // In player vs AI mode, player can only move white pieces
  if (gameMode === PLAYER_VS_AI && currentPlayer === BLACK) return;

  // In AI vs random mode, player cannot move pieces
  if (gameMode === AI_VS_RANDOM) return;

  const piece = board[row][col];

  // Check if the piece belongs to the current player
  if ((currentPlayer === WHITE && (piece === WHITE || piece === WHITE_KING)) ||
    (currentPlayer === BLACK && (piece === BLACK || piece === BLACK_KING))) {
    setSelectedPiece({ row, col });
    setValidMoves(getValidMoves(row, col, board, currentPlayer));
  }
};

const movePiece = (fromRow, fromCol, toRow, toCol) => {
  if (gameStatus !== 'ongoing') return;

  const newBoard = board.map(row => [...row]);
  const piece = newBoard[fromRow][fromCol];

  // Move the piece
  newBoard[fromRow][fromCol] = EMPTY;
  newBoard[toRow][toCol] = piece;

  // Check if the piece should be promoted to king
  if (piece === WHITE && toRow === 0) {
    newBoard[toRow][toCol] = WHITE_KING;
  } else if (piece === BLACK && toRow === 7) {
    newBoard[toRow][toCol] = BLACK_KING;
  }

  // Check if this was a capture move
  if (Math.abs(fromRow - toRow) === 2) {
    const captureRow = (fromRow + toRow) / 2;
    const captureCol = (fromCol + toCol) / 2;
    newBoard[captureRow][captureCol] = EMPTY;

    // Check if there are additional captures available
    const additionalCaptures = getValidCaptures(toRow, toCol, newBoard, currentPlayer);
    if (additionalCaptures.length > 0) {
      setBoard(newBoard);
      setSelectedPiece({ row: toRow, col: toCol });
      setValidMoves(additionalCaptures);
      return; // Don't switch turns yet
    }
  }

  // Record the move
  setMoveHistory([...moveHistory, {
    from: { row: fromRow, col: fromCol },
    to: { row: toRow, col: toCol },
    player: currentPlayer
  }]);

  // Update the board and switch turns
  setBoard(newBoard);
  setCurrentPlayer(currentPlayer === WHITE ? BLACK : WHITE);
  setSelectedPiece(null);
  setValidMoves([]);
};
```

### 4. Effect on AI Move

After the player makes a move, the `currentPlayer` state is updated, which triggers the AI to make a move through a useEffect hook:

```jsx
// AI move logic
useEffect(() => {
  if (!board) return;

  // Determine if AI should move
  const isAITurn =
    (gameMode === PLAYER_VS_AI && currentPlayer === BLACK) || // AI plays as BLACK in Player vs AI
    (gameMode === AI_VS_RANDOM && currentPlayer === WHITE);   // AI plays as WHITE in AI vs Random

  if (isAITurn) {
    // Small delay to make AI moves visible
    const timer = setTimeout(() => {
      makeAIMove();
    }, 800); // Increased delay to give more time to see the board state

    return () => clearTimeout(timer);
  }
}, [board, currentPlayer, gameMode]);
```

### 5. Algorithm Execution

The `makeAIMove` function calls the `minimax` algorithm to find the best move:

```jsx
const makeAIMove = () => {
  // ... (code from previous example)
  
  const result = minimax(board, depth, playerToMove, opponentPlayer, -Infinity, Infinity, true);
  bestMove = result.move;
  
  // ... (make the move)
};
```

## User Input: Running a Search Algorithm Example

Let's trace the flow when a user runs a search algorithm in the Search page:

### 1. UI Component (AlgorithmSelector.jsx)

```jsx
<button onClick={onRunAlgorithm}>
  Run Algorithm
</button>
```

When the user clicks the "Run Algorithm" button, the `onRunAlgorithm` function is called.

### 2. Parent Component (SearchPage.jsx)

The `AlgorithmSelector` component receives the `onRunAlgorithm` function as a prop:

```jsx
<AlgorithmSelector
  selectedAlgorithm={selectedAlgorithm}
  onAlgorithmChange={handleAlgorithmChange}
  onRunAlgorithm={runAlgorithm}
/>
```

### 3. Handle Function in Parent Component

In `SearchPage.jsx`, the `runAlgorithm` function is defined:

```jsx
const runAlgorithm = () => {
  if (!graph || Object.keys(graph).length === 0) {
    alert('Please create a graph first.');
    return;
  }

  if (!startState) {
    alert('Please select a start state.');
    return;
  }

  if (!goalState) {
    alert('Please select a goal state.');
    return;
  }

  // Create heuristic function
  const heuristicFn = (node) => {
    return heuristicValues[node] || 0;
  };

  // Create cost function
  const costFn = (u, v) => {
    return costValues[`${u}-${v}`] || 1;
  };

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

This function performs validation, creates the necessary functions for the algorithms, calls the appropriate algorithm based on the selected algorithm, and updates the state with the results.

### 4. Algorithm Execution

The selected algorithm (e.g., `aStar`) is called with the appropriate parameters:

```jsx
algorithmResult = aStar(graph, startState, goalState, heuristicFn, costFn);
```

### 5. Algorithm Implementation (aStar.js)

The `aStar` function implements the A* algorithm and tracks the steps:

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
  
  // ... (rest of the algorithm)
  
  return { success: true, steps, path };
}
```

### 6. Result Display

The results are stored in the state and used to update the UI components:

```jsx
setResult(algorithmResult);
setSteps(algorithmResult.steps);
setCurrentStep(0);
```

These state updates trigger re-renders of the `ResultDisplay`, `StepDisplay`, and `GraphVisualization` components, which show the algorithm's results.

## Component Communication Pattern

The application follows a common React pattern for component communication:

1. **Props Down**: Parent components pass state and handler functions down to child components as props
2. **Events Up**: Child components call the handler functions when user interactions occur
3. **State Management**: State is managed in the parent component and passed down to children

This pattern allows for a clear flow of data and actions through the component hierarchy.

## Handle Functions in Detail

Handle functions in the JSX files serve several important purposes:

1. **Input Validation**: They validate user inputs before processing them
2. **State Updates**: They update the component's state based on user inputs
3. **Algorithm Invocation**: They call the appropriate algorithms with the necessary parameters
4. **UI Updates**: They update the UI based on the algorithm results

Let's examine the `handleSearchDepthChange` function in more detail:

```jsx
const handleSearchDepthChange = (depth) => {
  setSearchDepth(parseInt(depth, 10));
};
```

This function:
1. Takes the string value from the dropdown as input
2. Converts it to an integer using `parseInt`
3. Updates the `searchDepth` state variable with the new value

The state update triggers:
1. A re-render of the `GameControls` component with the new `searchDepth` value
2. The next time the AI makes a move, it will use the new `searchDepth` value
3. The next time the minimax tree is visualized, it will use the new `searchDepth` value (up to a maximum of 6)

This simple handle function demonstrates how user inputs flow through the application to affect both the UI and the algorithm behavior.

---

This document has explained the complete flow from user inputs in the JSX components to the execution of algorithms in the JavaScript files, with a focus on the handle functions that process user inputs. Understanding this flow is essential for working with and extending the application.
