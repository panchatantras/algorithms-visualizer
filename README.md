# Algorithm Visualizer

[![CI](https://github.com/panchatantras/algorithms-visualizer/actions/workflows/ci.yml/badge.svg)](https://github.com/panchatantras/algorithms-visualizer/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/panchatantras/algorithms-visualizer/actions/workflows/deploy.yml/badge.svg)](https://panchatantras.github.io/algorithms-visualizer/)

An interactive web app for visualizing data structure and algorithm operations, built with React and Vite.

## Features

### Algorithms
- **Sorting (8):** Bubble, Selection, Insertion, Merge, Quick, Heap, Shell, Cocktail Shaker
- **Searching (4):** Linear, Binary, Interpolation, Ternary
- **Graph (4):** BFS, DFS, Dijkstra (weighted), Topological Sort (DAG)

### Visualization
- Dot/point array visualization (Y position = value)
- Canvas rendering with device pixel ratio support
- Color-coded state transitions (comparing, sorted, current, etc.)
- Auto-scaling graph layout with bounding-box transform
- Animation speed slider with step counter

### Comparison Mode
- Side-by-side comparison of any two algorithms on the same data
- Shared play/pause/reset controls with independent step tracking
- Pseudocode display with active line highlighting for each algorithm

### Pseudocode
- Displayed alongside the animation for each algorithm
- Currently executing line is highlighted
- Scrollable panel with wrapping text

## Live Demo

[https://panchatantras.github.io/algorithms-visualizer/](https://panchatantras.github.io/algorithms-visualizer/)

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (default http://localhost:5173).

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run integration tests (Playwright) |
| `npm run test:all` | Run all tests |

## Usage

1. Select an algorithm tab (Sorting / Searching / Graph)
2. Choose a specific algorithm from the dropdown
3. Use Play/Pause, Reset, and New Data buttons
4. Adjust animation speed with the slider
5. Toggle **Compare Mode** to run two algorithms side by side
6. For graph algorithms, optionally select a start node

## Project Structure

```
src/
  algorithms/     Generator functions + pseudocode for each algorithm
    sorting.js    8 sorting algorithms
    searching.js  4 searching algorithms
    graph.js      4 graph algorithms
  components/    React components
    SortingVisualizer.jsx
    SearchingVisualizer.jsx
    GraphVisualizer.jsx
    ComparisonView.jsx
    Pseudocode.jsx
  App.jsx        Main app with tab routing and compare toggle
  App.css        Dark theme styles
  main.jsx       Entry point
```

## Architecture

- **Generators** yield step objects `{array, comparing, sorted, codeLine, ...}` that are collected into arrays for random-access playback.
- **Visualizers** render steps on `<canvas>` with `devicePixelRatio` scaling.
- **ComparisonView** is a generic wrapper reused across all three tabs.
- Graph draw functions auto-detect algorithm type via step properties.
