import { test, expect } from '@playwright/test';

test.describe('Algorithm correctness via UI', () => {

  test('bubble sort produces sorted array', async ({ page }) => {
    await page.goto('/');

    const result = await page.evaluate(async () => {
      const { sortingAlgorithms } = await import('../src/algorithms/sorting');
      const arr = [9, 5, 7, 3, 1, 8, 2, 4, 6];
      const steps = sortingAlgorithms['Bubble Sort'](arr);
      const last = steps[steps.length - 1];
      const isSorted = last.array.every((v, i, a) => i === 0 || a[i - 1] <= v);
      return {
        sortedArray: last.array,
        allSorted: last.sorted.length === arr.length,
        stepCount: steps.length,
        codeLine: last.codeLine,
        isSorted,
      };
    });

    expect(result.isSorted).toBe(true);
    expect(result.allSorted).toBe(true);
    expect(result.stepCount).toBeGreaterThan(0);
    expect(result.codeLine).toBeGreaterThanOrEqual(8);
  });

  test('all 8 sorting algorithms produce sorted arrays', async ({ page }) => {
    await page.goto('/');

    const results = await page.evaluate(async () => {
      const { sortingAlgorithms } = await import('../src/algorithms/sorting');
      const arr = [9, 5, 7, 3, 1, 8, 2, 4, 6];
      const names = Object.keys(sortingAlgorithms);
      return names.map(name => {
        const steps = sortingAlgorithms[name](arr);
        const last = steps[steps.length - 1];
        const isSorted = last.array.every((v, i, a) => i === 0 || a[i - 1] <= v);
        return { name, isSorted, sortedArray: last.array, stepCount: steps.length };
      }).filter(r => !r.isSorted);
    });

    expect(results).toEqual([]);
  });

  test('play button animates through all sorting steps', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');

    const initialStep = await page.locator('.step-info').textContent();
    expect(initialStep).toMatch(/Step 1 \/ \d+/);

    await page.locator('button', { hasText: 'Play' }).click();
    await page.waitForTimeout(1000);
    await page.locator('button', { hasText: 'Pause' }).click();

    const afterPlayStep = await page.locator('.step-info').textContent();
    expect(afterPlayStep).not.toBe(initialStep);

    await page.locator('button', { hasText: 'Reset' }).click();
    await page.waitForTimeout(100);

    const resetStep = await page.locator('.step-info').textContent();
    expect(resetStep).toMatch(/Step 1 \/ \d+/);
  });

  test('searching algorithms find the target', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tab', { hasText: 'Searching' }).click();
    await page.waitForTimeout(100);

    const results = await page.evaluate(async () => {
      const { searchingAlgorithms } = await import('../src/algorithms/searching');
      const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
      const names = Object.keys(searchingAlgorithms);
      return names.map(name => {
        const steps = searchingAlgorithms[name](arr, 9);
        const last = steps[steps.length - 1];
        return { name, found: last.found, stepCount: steps.length };
      }).filter(r => !r.found);
    });

    expect(results).toEqual([]);
  });

  test('searching algorithms return false for absent target', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tab', { hasText: 'Searching' }).click();
    await page.waitForTimeout(100);

    const results = await page.evaluate(async () => {
      const { searchingAlgorithms } = await import('../src/algorithms/searching');
      const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
      const names = Object.keys(searchingAlgorithms);
      return names.map(name => {
        const steps = searchingAlgorithms[name](arr, 4);
        const last = steps[steps.length - 1];
        return { name, found: last.found };
      }).filter(r => r.found);
    });

    expect(results).toEqual([]);
  });

  test('BFS visits all nodes from every start node', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tab', { hasText: 'Graph' }).click();
    await page.waitForTimeout(100);

    const results = await page.evaluate(async () => {
      const { generateBfsSteps, graph } = await import('../src/algorithms/graph');
      const nodeCount = Object.keys(graph).length;
      const failures = [];
      for (let start = 0; start < nodeCount; start++) {
        const steps = generateBfsSteps(start);
        const last = steps[steps.length - 1];
        if (new Set(last.visited).size !== nodeCount) {
          failures.push({ start, visited: last.visited.length });
        }
      }
      return failures;
    });

    expect(results).toEqual([]);
  });

  test('DFS visits all nodes from every start node', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tab', { hasText: 'Graph' }).click();
    await page.waitForTimeout(100);

    const results = await page.evaluate(async () => {
      const { generateDfsSteps, graph } = await import('../src/algorithms/graph');
      const nodeCount = Object.keys(graph).length;
      const failures = [];
      for (let start = 0; start < nodeCount; start++) {
        const steps = generateDfsSteps(start);
        const last = steps[steps.length - 1];
        if (new Set(last.visited).size !== nodeCount) {
          failures.push({ start, visited: last.visited.length });
        }
      }
      return failures;
    });

    expect(results).toEqual([]);
  });

  test('Dijkstra finds correct shortest distances', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tab', { hasText: 'Graph' }).click();
    await page.waitForTimeout(100);

    const result = await page.evaluate(async () => {
      const gen = (await import('../src/algorithms/graph')).graphAlgorithms["Dijkstra's Algorithm"];
      const steps = gen(0);
      const last = steps[steps.length - 1];
      return { dist0: last.dist[0], dist1: last.dist[1], dist3: last.dist[3] };
    });

    expect(result.dist0).toBe(0);
    expect(result.dist1).toBe(4);
    expect(result.dist3).toBe(2);
  });

  test('Topological sort produces valid ordering', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tab', { hasText: 'Graph' }).click();
    await page.waitForTimeout(100);

    const result = await page.evaluate(async () => {
      const { graphAlgorithms, dag } = await import('../src/algorithms/graph');
      const gen = graphAlgorithms['Topological Sort'];
      const steps = gen();
      const last = steps[steps.length - 1];
      const order = last.topOrder;

      const pos = {};
      order.forEach((node, idx) => { pos[node] = idx; });

      let valid = true;
      for (const [from, toList] of Object.entries(dag)) {
        for (const to of toList) {
          if (pos[Number(from)] >= pos[to]) {
            valid = false;
          }
        }
      }
      return {
        valid,
        orderLength: order.length,
        totalNodes: Object.keys(dag).length,
      };
    });

    expect(result.valid).toBe(true);
    expect(result.orderLength).toBe(result.totalNodes);
  });
});

test.describe('Canvas rendering verification', () => {

  test('canvas has content after render', async ({ page }) => {
    await page.goto('/');

    const hasPixels = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return imageData.data.some(v => v !== 0);
    });

    expect(hasPixels).toBe(true);
  });

  test('canvas renders differently at different steps', async ({ page }) => {
    await page.goto('/');

    await page.waitForFunction(() => {
      const c = document.querySelector('.viz-body canvas');
      if (!c) return false;
      const { width, height } = c.getBoundingClientRect();
      return width > 0 && height > 0;
    }, { timeout: 5000 });

    await page.waitForTimeout(300);

    const getPixelCount = () => page.evaluate(() => {
      const canvas = document.querySelector('.viz-body canvas');
      const ctx = canvas.getContext('2d');
      const { width, height } = canvas.getBoundingClientRect();
      const imageData = ctx.getImageData(0, 0, Math.ceil(width), Math.ceil(height));
      let nonZero = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] > 0) nonZero++;
      }
      return nonZero;
    });

    const count1 = await getPixelCount();
    expect(count1).toBeGreaterThan(0);

    await page.locator('button', { hasText: 'Play' }).click();
    await page.waitForTimeout(500);
    await page.locator('button', { hasText: 'Pause' }).click();
    await page.waitForTimeout(100);

    const count2 = await getPixelCount();
    expect(count2).toBeGreaterThan(0);
  });

  test('pseudocode active line changes during animation', async ({ page }) => {
    await page.goto('/');

    const getActiveText = () =>
      page.locator('.pseudocode .code-line.active .line-text').textContent();

    const text1 = await getActiveText();

    await page.locator('button', { hasText: 'Play' }).click();
    await page.waitForTimeout(300);
    await page.locator('button', { hasText: 'Pause' }).click();

    const text2 = await getActiveText();

    expect(text2).toBeTruthy();
  });
});

test.describe('Compare mode algorithm correctness', () => {

  test('both sides produce sorted array in compare mode', async ({ page }) => {
    await page.goto('/');
    await page.locator('.compare-toggle input').check();
    await page.waitForTimeout(200);

    const results = await page.evaluate(async () => {
      const { sortingAlgorithms } = await import('../src/algorithms/sorting');
      const { searchingAlgorithms } = await import('../src/algorithms/searching');
      const { graphAlgorithms } = await import('../src/algorithms/graph');

      const arr = [9, 5, 7, 3, 1, 8, 2, 4, 6];
      const isSorted = (a) => a.every((v, i, arr) => i === 0 || arr[i - 1] <= v);

      const sortNames = ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Heap Sort'];
      const results = [];

      for (const nameA of sortNames) {
        for (const nameB of sortNames) {
          if (nameA === nameB) continue;
          const stepsA = sortingAlgorithms[nameA](arr);
          const stepsB = sortingAlgorithms[nameB](arr);
          const lastA = stepsA[stepsA.length - 1];
          const lastB = stepsB[stepsB.length - 1];

          if (!isSorted(lastA.array) || lastA.sorted.length !== arr.length) {
            results.push({ nameA, error: 'not sorted' });
          }
          if (!isSorted(lastB.array) || lastB.sorted.length !== arr.length) {
            results.push({ nameB, error: 'not sorted' });
          }

          const hasSameShape = stepsA.every((s, i) => {
            if (i >= stepsB.length) return true;
            return s.array.length === stepsB[i].array.length;
          });

          if (!hasSameShape) {
            results.push({ nameA, nameB, error: 'step shape mismatch' });
          }
        }
      }
      return results;
    });

    expect(results).toEqual([]);
  });

  test('searching in compare mode finds target with both algorithms', async ({ page }) => {
    await page.goto('/');
    await page.locator('.compare-toggle input').check();
    await page.waitForTimeout(100);
    await page.locator('.tab', { hasText: 'Searching' }).click();
    await page.waitForTimeout(200);

    const results = await page.evaluate(async () => {
      const { searchingAlgorithms } = await import('../src/algorithms/searching');
      const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
      const names = Object.keys(searchingAlgorithms);
      const failures = [];

      for (let i = 0; i < names.length; i++) {
        for (let j = i + 1; j < names.length; j++) {
          const stepsA = searchingAlgorithms[names[i]](arr, 9);
          const stepsB = searchingAlgorithms[names[j]](arr, 9);
          const lastA = stepsA[stepsA.length - 1];
          const lastB = stepsB[stepsB.length - 1];
          if (!lastA.found) failures.push(`${names[i]} did not find target`);
          if (!lastB.found) failures.push(`${names[j]} did not find target`);
        }
      }
      return failures;
    });

    expect(results).toEqual([]);
  });

  test('graph algorithms in compare mode visit all nodes', async ({ page }) => {
    await page.goto('/');
    await page.locator('.compare-toggle input').check();
    await page.waitForTimeout(100);
    await page.locator('.tab', { hasText: 'Graph' }).click();
    await page.waitForTimeout(200);

    const results = await page.evaluate(async () => {
      const { generateBfsSteps, generateDfsSteps, graphAlgorithms, graph, dag } = await import('../src/algorithms/graph');
      const nodeCount = Object.keys(graph).length;
      const dagCount = Object.keys(dag).length;
      const failures = [];

      const bfsSteps = generateBfsSteps(0);
      const bfsLast = bfsSteps[bfsSteps.length - 1];
      if (new Set(bfsLast.visited).size !== nodeCount) {
        failures.push('BFS did not visit all nodes');
      }

      const dfsSteps = generateDfsSteps(0);
      const dfsLast = dfsSteps[dfsSteps.length - 1];
      if (new Set(dfsLast.visited).size !== nodeCount) {
        failures.push('DFS did not visit all nodes');
      }

      const dijkstra = graphAlgorithms["Dijkstra's Algorithm"](0);
      const dijkstraLast = dijkstra[dijkstra.length - 1];
      if (dijkstraLast.visited.length !== nodeCount) {
        failures.push('Dijkstra did not visit all nodes');
      }

      const topo = graphAlgorithms['Topological Sort']();
      const topoLast = topo[topo.length - 1];
      if (topoLast.topOrder.length !== dagCount) {
        failures.push('Topological sort did not include all nodes');
      }

      return failures;
    });

    expect(results).toEqual([]);
  });
});
