import { describe, it, expect } from 'vitest';
import {
  graphAlgorithms, generateBfsSteps, generateDfsSteps,
  graph, edges, nodePositions, weightedGraph, weightedEdges,
  dag, dagEdges, dagNodePositions,
} from './graph';

describe('Graph Data Structures', () => {
  it('BFS/DFS graph should have valid edges', () => {
    for (const [from, toList] of Object.entries(graph)) {
      const nid = Number(from);
      for (const to of toList) {
        expect(graph[to]).toContain(nid);
      }
    }
  });

  it('all node positions should have x and y', () => {
    for (const [id, pos] of Object.entries(nodePositions)) {
      expect(pos).toHaveProperty('x');
      expect(pos).toHaveProperty('y');
      expect(typeof pos.x).toBe('number');
      expect(typeof pos.y).toBe('number');
    }
  });

  it('edges should reference valid nodes', () => {
    const validNodes = new Set(Object.keys(graph).map(Number));
    for (const [from, to] of edges) {
      expect(validNodes.has(from)).toBe(true);
      expect(validNodes.has(to)).toBe(true);
    }
  });

  it('DAG should have valid edges', () => {
    for (const [from, toList] of Object.entries(dag)) {
      const nid = Number(from);
      for (const to of toList) {
        expect(dag[to]).toBeDefined();
      }
    }
  });
});

function collectSteps(gen, ...args) {
  const steps = [];
  for (const step of gen(...args)) {
    steps.push(step);
  }
  return steps;
}

function* bfsGen(startNode) {
  const visited = new Set();
  const queue = [startNode];
  yield { visited: [], current: -1, queue: [...queue], codeLine: 0 };
  while (queue.length > 0) {
    const node = queue.shift();
    if (!visited.has(node)) {
      visited.add(node);
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor);
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
    if (!visited.has(node)) {
      visited.add(node);
      const neighbors = [...graph[node]];
      neighbors.reverse();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && !stack.includes(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }
  yield { visited: [...visited], current: -1, stack: [], codeLine: 10 };
}

describe('BFS', () => {
  it('should visit all nodes from start 0', () => {
    const steps = generateBfsSteps(0);
    const lastStep = steps[steps.length - 1];
    expect(new Set(lastStep.visited).size).toBe(Object.keys(graph).length);
  });

  it('should visit all nodes from start 3', () => {
    const steps = generateBfsSteps(3);
    const lastStep = steps[steps.length - 1];
    expect(new Set(lastStep.visited).size).toBe(Object.keys(graph).length);
  });

  it('should start with the start node', () => {
    const steps = generateBfsSteps(2);
    expect(steps[0].queue).toContain(2);
  });

  it('should produce steps with codeLine', () => {
    const steps = generateBfsSteps(0);
    expect(steps.length).toBeGreaterThan(0);
    for (const step of steps) {
      expect(step).toHaveProperty('codeLine');
      expect(step).toHaveProperty('visited');
      expect(step).toHaveProperty('queue');
    }
  });
});

describe('DFS', () => {
  it('should visit all nodes from start 0', () => {
    const steps = generateDfsSteps(0);
    const lastStep = steps[steps.length - 1];
    expect(new Set(lastStep.visited).size).toBe(Object.keys(graph).length);
  });

  it('should visit all nodes from start 5', () => {
    const steps = generateDfsSteps(5);
    const lastStep = steps[steps.length - 1];
    expect(new Set(lastStep.visited).size).toBe(Object.keys(graph).length);
  });

  it('should start with the start node', () => {
    const steps = generateDfsSteps(1);
    expect(steps[0].stack).toContain(1);
  });

  it('should produce steps with codeLine', () => {
    const steps = generateDfsSteps(0);
    for (const step of steps) {
      expect(step).toHaveProperty('codeLine');
      expect(step).toHaveProperty('visited');
      expect(step).toHaveProperty('stack');
    }
  });
});

describe("Dijkstra's Algorithm", () => {
  const gen = graphAlgorithms["Dijkstra's Algorithm"];

  it('should find shortest distances from start 0', () => {
    const steps = gen(0);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.dist[0]).toBe(0);
    expect(lastStep.dist[1]).toBe(4);
    expect(lastStep.dist[3]).toBe(2);
  });

  it('should visit all reachable nodes', () => {
    const steps = gen(0);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.visited.sort()).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('should produce steps with dist and queue', () => {
    const steps = gen(2);
    for (const step of steps) {
      expect(step).toHaveProperty('dist');
      expect(step).toHaveProperty('queue');
      expect(step).toHaveProperty('codeLine');
    }
  });
});

describe('Topological Sort', () => {
  const gen = graphAlgorithms['Topological Sort'];

  it('should produce a valid topological order', () => {
    const steps = gen();
    const lastStep = steps[steps.length - 1];
    const order = lastStep.topOrder;
    expect(order).toHaveLength(Object.keys(dag).length);

    const pos = {};
    order.forEach((node, idx) => { pos[node] = idx; });

    for (const [from, toList] of Object.entries(dag)) {
      for (const to of toList) {
        expect(pos[Number(from)]).toBeLessThan(pos[to]);
      }
    }
  });

  it('should produce steps with inDegree', () => {
    const steps = gen();
    for (const step of steps) {
      expect(step).toHaveProperty('inDegree');
      expect(step).toHaveProperty('topOrder');
      expect(step).toHaveProperty('queue');
      expect(step).toHaveProperty('codeLine');
    }
  });
});

describe('BFS/DFS node coverage', () => {
  const nodeCount = Object.keys(graph).length;

  for (const start of [0, 1, 2, 3, 4, 5, 6]) {
    it(`BFS from ${start} visits all nodes`, () => {
      const steps = generateBfsSteps(start);
      const lastStep = steps[steps.length - 1];
      expect(new Set(lastStep.visited).size).toBe(nodeCount);
    });

    it(`DFS from ${start} visits all nodes`, () => {
      const steps = generateDfsSteps(start);
      const lastStep = steps[steps.length - 1];
      expect(new Set(lastStep.visited).size).toBe(nodeCount);
    });
  }
});
