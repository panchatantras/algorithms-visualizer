import { useState } from 'react';
import SortingVisualizer, { drawSorting } from './components/SortingVisualizer';
import SearchingVisualizer, { drawSearching } from './components/SearchingVisualizer';
import GraphVisualizer, { drawBfsDfs, drawDijkstra, drawTopoSort } from './components/GraphVisualizer';
import ComparisonView from './components/ComparisonView';
import { sortingAlgorithms, sortingPseudocode, sortingBigO, generateRandomArray } from './algorithms/sorting';
import { searchingAlgorithms, searchingPseudocode, searchingBigO, generateSortedArray, pickRandomTarget } from './algorithms/searching';
import { graphAlgorithms, graphPseudocode, graphBigO } from './algorithms/graph';

const compareConfigs = {
  sorting: {
    Comp: () => (
      <ComparisonView
        algorithms={sortingAlgorithms}
        pseudocode={sortingPseudocode}
        bigO={sortingBigO}
        generateData={() => generateRandomArray(30)}
        generateSteps={(name, arr) => sortingAlgorithms[name](arr)}
        drawFn={drawSorting}
      />
    ),
  },
  searching: {
    Comp: () => {
      const data = generateSortedArray(20);
      return (
        <ComparisonView
          algorithms={searchingAlgorithms}
          pseudocode={searchingPseudocode}
          bigO={searchingBigO}
          generateData={() => { const a = generateSortedArray(20); return { arr: a, target: pickRandomTarget(a) }; }}
          generateSteps={(name, d) => searchingAlgorithms[name](d.arr, d.target)}
          drawFn={drawSearching}
        />
      );
    },
  },
  graph: {
    Comp: () => (
      <ComparisonView
        algorithms={graphAlgorithms}
        pseudocode={graphPseudocode}
        bigO={graphBigO}
        generateData={() => 0}
        generateSteps={(name, start) => graphAlgorithms[name](start)}
        drawFn={(ctx, w, h, step) => {
          if (step.dist !== undefined) drawDijkstra(ctx, w, h, step);
          else if (step.inDegree !== undefined) drawTopoSort(ctx, w, h, step);
          else drawBfsDfs(ctx, w, h, step);
        }}
      />
    ),
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('sorting');
  const [compareMode, setCompareMode] = useState(false);

  const renderContent = () => {
    if (compareMode) {
      const config = compareConfigs[activeTab];
      return config ? <config.Comp /> : null;
    }
    switch (activeTab) {
      case 'sorting': return <SortingVisualizer />;
      case 'searching': return <SearchingVisualizer />;
      case 'graph': return <GraphVisualizer />;
      default: return null;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Algorithm Visualizer</h1>
        <nav className="tabs">
          {['sorting', 'searching', 'graph'].map(key => (
            <button
              key={key}
              className={`tab ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </nav>
        <label className="compare-toggle">
          <input type="checkbox" checked={compareMode} onChange={e => setCompareMode(e.target.checked)} />
          Compare Mode
        </label>
      </header>
      <main className="main">
        {renderContent()}
      </main>
    </div>
  );
}
