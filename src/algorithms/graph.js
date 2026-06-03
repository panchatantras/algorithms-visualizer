const graph = {
  0: [1, 3],
  1: [0, 2, 4],
  2: [1, 5],
  3: [0, 4],
  4: [1, 3, 5, 6],
  5: [2, 4],
  6: [4],
};

const edges = [
  [0, 1], [0, 3], [1, 2], [1, 4], [2, 5], [3, 4], [4, 5], [4, 6],
];

const nodePositions = {
  0: { x: 300, y: 80 },
  1: { x: 470, y: 180 },
  2: { x: 600, y: 320 },
  3: { x: 180, y: 280 },
  4: { x: 380, y: 340 },
  5: { x: 550, y: 460 },
  6: { x: 300, y: 480 },
};

const weightedGraph = {
  0: { 1: 4, 3: 2 },
  1: { 0: 4, 2: 5, 4: 1 },
  2: { 1: 5, 5: 3 },
  3: { 0: 2, 4: 8 },
  4: { 1: 1, 3: 8, 5: 6, 6: 3 },
  5: { 2: 3, 4: 6 },
  6: { 4: 3 },
};

const weightedEdges = [
  [0, 1, 4], [0, 3, 2], [1, 2, 5], [1, 4, 1], [2, 5, 3], [3, 4, 8], [4, 5, 6], [4, 6, 3],
];

const dag = {
  0: [1, 2],
  1: [3],
  2: [3],
  3: [4],
  4: [],
  5: [3],
};

const dagEdges = [
  [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [5, 3],
];

const dagNodePositions = {
  0: { x: 200, y: 100 },
  1: { x: 350, y: 220 },
  2: { x: 500, y: 220 },
  3: { x: 400, y: 360 },
  4: { x: 400, y: 480 },
  5: { x: 100, y: 360 },
};

function* bfsGen(startNode) {
  const visited = new Set();
  const queue = [startNode];
  yield { visited: [], current: -1, queue: [...queue], codeLine: 0 };
  while (queue.length > 0) {
    const node = queue.shift();
    yield { visited: [...visited], current: node, queue: [...queue], codeLine: 2 };
    if (!visited.has(node)) {
      visited.add(node);
      yield { visited: [...visited], current: node, queue: [...queue], codeLine: 3 };
      for (const neighbor of graph[node]) {
        yield { visited: [...visited], current: node, queue: [...queue], codeLine: 5 };
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor);
          yield { visited: [...visited], current: node, queue: [...queue], codeLine: 6 };
        }
      }
    }
  }
  yield { visited: [...visited], current: -1, queue: [], codeLine: 10 };
}

function* dfsGen(startNode) {
  const visited = new Set();
  const stack = [startNode];
  yield { visited: [], current: -1, stack: [...stack], codeLine: 0 };
  while (stack.length > 0) {
    const node = stack.pop();
    yield { visited: [...visited], current: node, stack: [...stack], codeLine: 2 };
    if (!visited.has(node)) {
      visited.add(node);
      yield { visited: [...visited], current: node, stack: [...stack], codeLine: 3 };
      const neighbors = [...graph[node]];
      neighbors.reverse();
      for (const neighbor of neighbors) {
        yield { visited: [...visited], current: node, stack: [...stack], codeLine: 5 };
        if (!visited.has(neighbor) && !stack.includes(neighbor)) {
          stack.push(neighbor);
          yield { visited: [...visited], current: node, stack: [...stack], codeLine: 6 };
        }
      }
    }
  }
  yield { visited: [...visited], current: -1, stack: [], codeLine: 10 };
}

function* dijkstraGen(startNode) {
  const dist = {};
  const prev = {};
  const unvisited = new Set(Object.keys(weightedGraph).map(Number));
  for (const node of unvisited) {
    dist[node] = Infinity;
    prev[node] = null;
  }
  dist[startNode] = 0;

  yield { visited: [], current: -1, dist: { ...dist }, queue: [...unvisited], codeLine: 0 };

  while (unvisited.size > 0) {
    let current = null;
    let minDist = Infinity;
    for (const node of unvisited) {
      if (dist[node] < minDist) {
        minDist = dist[node];
        current = node;
      }
    }
    if (current === null || dist[current] === Infinity) break;

    unvisited.delete(current);
    yield { visited: [...new Set(Object.keys(dist).filter(n => dist[n] !== Infinity && !unvisited.has(Number(n))).map(Number))], current, dist: { ...dist }, queue: [...unvisited], codeLine: 4 };

    for (const [neighbor, weight] of Object.entries(weightedGraph[current])) {
      const nb = Number(neighbor);
      const newDist = dist[current] + weight;
      yield { visited: [...new Set(Object.keys(dist).filter(n => dist[n] !== Infinity && !unvisited.has(Number(n))).map(Number))], current, dist: { ...dist }, queue: [...unvisited], codeLine: 6 };
      if (newDist < dist[nb]) {
        dist[nb] = newDist;
        prev[nb] = current;
        yield { visited: [...new Set(Object.keys(dist).filter(n => dist[n] !== Infinity && !unvisited.has(Number(n))).map(Number))], current: -1, dist: { ...dist }, queue: [...unvisited], codeLine: 7 };
      }
    }
  }

  const all = Object.keys(dist).map(Number);
  yield { visited: all, current: -1, dist: { ...dist }, queue: [], codeLine: 14 };
}

function* topologicalSortGen() {
  const inDegree = {};
  const nodes = Object.keys(dag).map(Number);
  for (const node of nodes) inDegree[node] = 0;
  for (const node of nodes) {
    for (const neighbor of dag[node]) {
      inDegree[neighbor] = (inDegree[neighbor] || 0) + 1;
    }
  }

  const queue = nodes.filter(n => inDegree[n] === 0);
  const topOrder = [];

  yield { visited: [], current: -1, queue: [...queue], topOrder: [...topOrder], inDegree: { ...inDegree }, codeLine: 0 };

  while (queue.length > 0) {
    const node = queue.shift();
    topOrder.push(node);
    yield { visited: [...topOrder], current: node, queue: [...queue], topOrder: [...topOrder], inDegree: { ...inDegree }, codeLine: 4 };

    for (const neighbor of dag[node]) {
      inDegree[neighbor]--;
      yield { visited: [...topOrder], current: node, queue: [...queue], topOrder: [...topOrder], inDegree: { ...inDegree }, codeLine: 6 };
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
        yield { visited: [...topOrder], current: node, queue: [...queue], topOrder: [...topOrder], inDegree: { ...inDegree }, codeLine: 8 };
      }
    }
    yield { visited: [...topOrder], current: -1, queue: [...queue], topOrder: [...topOrder], inDegree: { ...inDegree }, codeLine: 3 };
  }

  yield { visited: [...topOrder], current: -1, queue: [], topOrder: [...topOrder], inDegree: { ...inDegree }, codeLine: 12 };
}

function collectSteps(generator, ...args) {
  const steps = [];
  for (const step of generator(...args)) {
    steps.push(step);
  }
  return steps;
}

export function generateBfsSteps(startNode = 0) {
  return collectSteps(bfsGen, startNode);
}

export function generateDfsSteps(startNode = 0) {
  return collectSteps(dfsGen, startNode);
}

export { graph, edges, nodePositions, weightedGraph, weightedEdges, dag, dagEdges, dagNodePositions };

export const graphAlgorithms = {
  'BFS (Breadth-First Search)': generateBfsSteps,
  'DFS (Depth-First Search)': generateDfsSteps,
  "Dijkstra's Algorithm": (startNode = 0) => collectSteps(dijkstraGen, startNode),
  'Topological Sort': () => collectSteps(topologicalSortGen),
};

export const graphBigO = {
  'BFS (Breadth-First Search)': { time: 'O(V + E)', space: 'O(V)' },
  'DFS (Depth-First Search)': { time: 'O(V + E)', space: 'O(V)' },
  "Dijkstra's Algorithm": { time: 'O((V + E) log V)', space: 'O(V)' },
  'Topological Sort': { time: 'O(V + E)', space: 'O(V)' },
};

export const graphPseudocode = {
  'BFS (Breadth-First Search)': [
    'procedure BFS(graph, start)',
    '  queue = [start]',
    '  visited = {}',
    '  while queue not empty',
    '    node = queue.dequeue()',
    '    if node not visited',
    '      mark node as visited',
    '      for each neighbor of node',
    '        if neighbor not visited',
    '          queue.enqueue(neighbor)',
    '        end if',
    '      end for',
    '    end if',
    '  end while',
    'end procedure',
  ],
  'DFS (Depth-First Search)': [
    'procedure DFS(graph, start)',
    '  stack = [start]',
    '  visited = {}',
    '  while stack not empty',
    '    node = stack.pop()',
    '    if node not visited',
    '      mark node as visited',
    '      for each neighbor of node',
    '        if neighbor not visited',
    '          stack.push(neighbor)',
    '        end if',
    '      end for',
    '    end if',
    '  end while',
    'end procedure',
  ],
  "Dijkstra's Algorithm": [
    'procedure Dijkstra(graph, start)',
    '  for each node v',
    '    dist[v] = INF, prev[v] = null',
    '  dist[start] = 0',
    '  unvisited = all nodes',
    '  while unvisited not empty',
    '    u = node with smallest dist in unvisited',
    '    remove u from unvisited',
    '    for each neighbor v of u',
    '      newDist = dist[u] + weight(u,v)',
    '      if newDist < dist[v]',
    '        dist[v] = newDist',
    '        prev[v] = u',
    '      end if',
    '    end for',
    '  end while',
    '  return dist, prev',
    'end procedure',
  ],
  'Topological Sort': [
    'procedure topologicalSort(graph)',
    '  compute in-degree for each node',
    '  queue = nodes with in-degree 0',
    '  topOrder = []',
    '  while queue not empty',
    '    node = queue.dequeue()',
    '    topOrder.append(node)',
    '    for each neighbor of node',
    '      in-degree[neighbor]--',
    '      if in-degree[neighbor] == 0',
    '        queue.enqueue(neighbor)',
    '      end if',
    '    end for',
    '  end while',
    '  if topOrder.size != n',
    '    error: graph has cycle',
    '  return topOrder',
    'end procedure',
  ],
};
