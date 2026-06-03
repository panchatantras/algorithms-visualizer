# Algorithm Visualizer — LLM Context

## Stack
- React 18 + Vite 5, ES modules (no TypeScript)
- Canvas 2D for rendering, no animation libraries
- Styling: plain CSS, dark theme (`#0d1117` bg, `#58a6ff` accent)
- Test: Vitest

## Architecture

### Algorithm Generators (`src/algorithms/`)
Each algorithm is a generator function that yields step objects. Steps are collected into arrays for random-access playback (supports restart, replay, forward/backward).

**Step object shape:**
```js
{ array: [...], comparing: [...], sorted: [...], codeLine: number }
```
Searching steps add `{ left, right, mid, found, target, checked }` or `{ mid1, mid2 }` for ternary.
Graph steps add `{ visited, current, queue/stack/dist/inDegree/topOrder }`.

**Files:**
- `sorting.js` — 8 sort generators + pseudocode arrays per algorithm + `generateRandomArray(size)`
- `searching.js` — 4 search generators + pseudocode + `generateSortedArray(size)` + `pickRandomTarget(arr)`
- `graph.js` — 4 graph generators + pseudocode + graph data structures (`graph`, `edges`, `nodePositions`, `weightedGraph`, `weightedEdges`, `dag`, `dagEdges`, `dagNodePositions`)

### Components (`src/components/`)
- **SortingVisualizer** — canvas + pseudocode side-by-side. Exports `drawSorting(ctx, w, h, step)`.
- **SearchingVisualizer** — same layout, includes target display. Exports `drawSearching(ctx, w, h, step)`.
- **GraphVisualizer** — same layout. Exports `drawBfsDfs`, `drawDijkstra`, `drawTopoSort`, `getTransform`.
- **ComparisonView** — generic side-by-side wrapper. Props: `{ algorithms, pseudocode, generateData, generateSteps, drawFn }`.
- **Pseudocode** — renders lines with active-line highlighting. Props: `{ lines: string[], currentLine: number }`.

### State & Animation
- Generators run once on mount/algorithm change; steps stored as array.
- `useEffect` with step counter in deps schedules `setTimeout` for each frame.
- Canvas read `getBoundingClientRect()` each render, scale by `devicePixelRatio`.
- Speed slider controls delay: `max(10, 500 - speed * 4.5)` ms per step.

### Graph Rendering
- Hardcoded node positions, auto-scaled via `getTransform()` bounding-box computation.
- Draw functions detect algorithm type from step properties (`step.dist` → Dijkstra, `step.inDegree` → TopoSort, else BFS/DFS).

### Layout
- `.visualizer` — card with 1px border, 8px border-radius
- `.controls` — flex row with padding, border-bottom, dark background
- `.viz-body` — flex row containing canvas (`flex: 1`) and pseudocode (420px fixed width)
- `.pseudocode` — 420px wide, 440px tall, `overflow-y: auto`, `white-space: pre-wrap`
- Compare mode: `.compare-view` with `.compare-columns` (flex row, 1px gap), each column has canvas (240px) + pseudocode below (max-height 460px)

### Big-O Notation
- Each algorithm file exports `sortingBigO`, `searchingBigO`, `graphBigO` — objects mapping algorithm name to `{ time, space }`.
- `Pseudocode` component accepts optional `bigO` prop and renders a `.bigo-info` bar at the top.
- Visualizer components and `ComparisonView` import the Big-O object and pass the current algorithm's entry to `Pseudocode`.

### Visual Style
- `drawSorting(ctx, w, h, step, style)` and `drawSearching(ctx, w, h, step, style)` accept a `style` parameter (`'dots'` or `'bars'`).
- `SortingVisualizer`, `SearchingVisualizer`, and `ComparisonView` each have a `visualStyle` state with toggle buttons (`● Dots` / `▬ Bars`) in the controls.
- Graph visualizations skip bars (nodes are always circles).
- In bar mode, each element is rendered as a vertical rectangle: `fillRect(x, y, barW, barH)` with width = `dw/n - 1`.

### Key Gotchas
- `overflow: hidden` on `.visualizer` clips content at border-radius — removed in current version to avoid clipping pseudocode
- Generic `.canvas { height: 300px }` must be overridden by `.viz-body .canvas { height: 440px }` (specificity war)
- Animation `useEffect` must include step counter in dependency array or animation renders only one frame
- Pseudocode needs `align-self: flex-start` removed to stretch to full row height (avoid "floating box")

## Algorithm Data

### Sorting algorithms registered:
`Bubble Sort`, `Selection Sort`, `Insertion Sort`, `Merge Sort`, `Quick Sort`, `Heap Sort`, `Shell Sort`, `Cocktail Shaker Sort`

### Searching algorithms registered:
`Linear Search`, `Binary Search`, `Interpolation Search`, `Ternary Search`

### Graph algorithms registered:
`BFS (Breadth-First Search)`, `DFS (Depth-First Search)`, `Dijkstra's Algorithm`, `Topological Sort`

## Graph Data Structures

```js
// BFS/DFS graph (unweighted)
graph = { 0: [1, 3], 1: [0, 2, 4], ... }
edges = [[0, 1], [0, 3], ...]
nodePositions = { 0: { x: 300, y: 80 }, ... }

// Dijkstra graph (weighted)
weightedGraph = { 0: { 1: 4, 3: 2 }, ... }
weightedEdges = [[0, 1, 4], ...]

// Topological Sort DAG
dag = { 0: [1, 2], ... }
dagEdges = [[0, 1], ...]
dagNodePositions = { 0: { x: 200, y: 100 }, ... }
```

## Configuration
- App max-width: 960px
- Canvas height: 440px (single), 240px (compare)
- Pseudocode: 420px wide, 440px tall (single), no fixed height + max-height 460px (compare)
- Array size: 30 (sorting), 20 (searching)
- Sort values: random 10-99
