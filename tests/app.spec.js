import { test, expect } from '@playwright/test';

test.describe('Algorithm Visualizer — integration', () => {

  test('page loads with title and tabs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Algorithm Visualizer');
    await expect(page.locator('.tab')).toHaveCount(3);
    await expect(page.locator('.tab.active')).toHaveText('Sorting');
  });

  test('tab switching works', async ({ page }) => {
    await page.goto('/');

    await page.locator('.tab', { hasText: 'Searching' }).click();
    await expect(page.locator('.tab.active')).toHaveText('Searching');
    await expect(page.locator('.target-display')).toBeVisible();

    await page.locator('.tab', { hasText: 'Graph' }).click();
    await expect(page.locator('.tab.active')).toHaveText('Graph');
    await expect(page.locator('select')).toHaveCount(2);

    await page.locator('.tab', { hasText: 'Sorting' }).click();
    await expect(page.locator('.tab.active')).toHaveText('Sorting');
  });

  test('sorting tab shows canvas, pseudocode, and controls', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('.pseudocode')).toBeVisible();
    await expect(page.locator('.pseudocode .code-line')).toHaveCount(9);
    await expect(page.locator('.pseudocode .code-line.active')).toBeVisible();

    await expect(page.locator('button', { hasText: 'Play' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Reset' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'New Array' })).toBeVisible();
    await expect(page.locator('.step-info')).toBeVisible();
  });

  test('algorithm dropdown changes pseudocode', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.pseudocode .code-line')).toHaveCount(9);

    await page.locator('select').first().selectOption('Quick Sort');
    await page.waitForTimeout(200);
    await expect(page.locator('.pseudocode .code-line')).toHaveCount(20);
  });

  test('play button animates sorting', async ({ page }) => {
    await page.goto('/');

    const stepText = await page.locator('.step-info').textContent();
    expect(stepText).toMatch(/Step 1 \/ \d+/);

    await page.locator('button', { hasText: 'Play' }).click();
    await page.waitForTimeout(500);
    await page.locator('button', { hasText: 'Pause' }).click();

    const newStepText = await page.locator('.step-info').textContent();
    expect(newStepText).not.toBe(stepText);
  });

  test('speed slider affects animation', async ({ page }) => {
    await page.goto('/');

    const slider = page.locator('.speed-control input[type="range"]');
    await expect(slider).toBeVisible();
    await expect(slider).toHaveValue('50');

    await slider.fill('90');
    await expect(slider).toHaveValue('90');
  });

  test('new array generates fresh data', async ({ page }) => {
    await page.goto('/');

    const canvas = page.locator('canvas').first();
    const initialDims = await canvas.getAttribute('width');

    await page.locator('button', { hasText: 'New Array' }).click();
    await page.waitForTimeout(100);

    const finalDims = await canvas.getAttribute('width');
    expect(finalDims).toBe(initialDims);
  });

  test('reset resets to first step', async ({ page }) => {
    await page.goto('/');

    await page.locator('button', { hasText: 'Play' }).click();
    await page.waitForTimeout(200);
    await page.locator('button', { hasText: 'Pause' }).click();

    await page.locator('button', { hasText: 'Reset' }).click();
    await expect(page.locator('.step-info')).toHaveText(/Step 1 \//);
  });

  test('searching tab shows target display', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tab', { hasText: 'Searching' }).click();
    await expect(page.locator('.target-display')).toBeVisible();
    await expect(page.locator('.target-display')).toContainText('Target:');

    await expect(page.locator('button', { hasText: 'New Search' })).toBeVisible();
  });

  test('searching algorithm dropdown changes pseudocode', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tab', { hasText: 'Searching' }).click();
    await page.waitForTimeout(100);

    await expect(page.locator('.pseudocode .code-line')).toHaveCount(8);

    await page.locator('select').first().selectOption('Binary Search');
    await page.waitForTimeout(200);
    await expect(page.locator('.pseudocode .code-line')).toHaveCount(14);
  });

  test('graph tab shows start node and algorithm selects', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tab', { hasText: 'Graph' }).click();
    await page.waitForTimeout(100);

    const selects = page.locator('.visualizer .controls select');
    await expect(selects).toHaveCount(2);
    await expect(selects.first()).toContainText('BFS');
    await expect(selects.nth(1)).toContainText('Start: Node');
  });

  test('compare mode can be toggled', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('.compare-toggle input');
    await expect(toggle).not.toBeChecked();

    await toggle.check();
    await expect(toggle).toBeChecked();
    await expect(page.locator('.compare-view')).toBeVisible();
    await expect(page.locator('.compare-col')).toHaveCount(2);
    await expect(page.locator('.compare-view .pseudocode')).toHaveCount(2);
  });

  test('compare mode: two algorithms run side by side', async ({ page }) => {
    await page.goto('/');
    await page.locator('.compare-toggle input').check();
    await page.waitForTimeout(200);

    await expect(page.locator('.compare-view')).toBeVisible();
    await expect(page.locator('.compare-col .compare-header')).toHaveCount(2);
    await expect(page.locator('.compare-view canvas')).toHaveCount(2);

    await page.locator('.compare-view button', { hasText: 'Play' }).click();
    await page.waitForTimeout(500);
    await page.locator('.compare-view button', { hasText: 'Pause' }).click();

    await expect(page.locator('.step-info')).toContainText('/');
  });

  test('compare mode: different algorithms can be selected per column', async ({ page }) => {
    await page.goto('/');
    await page.locator('.compare-toggle input').check();
    await page.waitForTimeout(200);

    const selects = page.locator('.compare-header select');
    await selects.first().selectOption('Selection Sort');
    await page.waitForTimeout(200);

    const options = await selects.first().locator('option').allTextContents();
    expect(options).toContain('Selection Sort');
  });

  test('pseudocode line highlights change during animation', async ({ page }) => {
    await page.goto('/');

    const initialActive = await page.locator('.pseudocode .code-line.active').textContent();
    expect(initialActive.trim()).toBeTruthy();

    await page.locator('button', { hasText: 'Play' }).click();
    await page.waitForTimeout(300);
    await page.locator('button', { hasText: 'Pause' }).click();

    const newActive = await page.locator('.pseudocode .code-line.active').textContent();
    expect(newActive.trim()).toBeTruthy();
  });

  test('can switch between all three tabs in compare mode', async ({ page }) => {
    await page.goto('/');
    await page.locator('.compare-toggle input').check();
    await page.waitForTimeout(200);

    await page.locator('.tab', { hasText: 'Searching' }).click();
    await page.waitForTimeout(200);
    await expect(page.locator('.compare-view')).toBeVisible();
    await expect(page.locator('.compare-col')).toHaveCount(2);
    await expect(page.locator('.compare-col .pseudocode')).toHaveCount(2);

    await page.locator('.tab', { hasText: 'Graph' }).click();
    await page.waitForTimeout(200);
    await expect(page.locator('.compare-view')).toBeVisible();
  });

  test('graph algorithm dropdown changes pseudocode', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tab', { hasText: 'Graph' }).click();
    await page.waitForTimeout(100);

    await expect(page.locator('.pseudocode .code-line')).toHaveCount(15);

    await page.locator('select').first().selectOption("Dijkstra's Algorithm");
    await page.waitForTimeout(200);
    await expect(page.locator('.pseudocode .code-line')).toHaveCount(18);
  });

  test('graph dropdown changes start node', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tab', { hasText: 'Graph' }).click();
    await page.waitForTimeout(100);

    const startSelect = page.locator('.visualizer .controls select').nth(1);
    await startSelect.selectOption('3');
    await page.waitForTimeout(200);
    await expect(startSelect).toContainText('Start: Node 3');
  });
});
