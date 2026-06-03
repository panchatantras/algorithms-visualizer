import { describe, it, expect } from 'vitest';
import {
  sortingAlgorithms, generateRandomArray,
  generateBubbleSortSteps, generateSelectionSortSteps,
  generateInsertionSortSteps, generateMergeSortSteps,
  generateQuickSortSteps,
} from './sorting';

function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

const algorithms = {
  'Bubble Sort': generateBubbleSortSteps,
  'Selection Sort': generateSelectionSortSteps,
  'Insertion Sort': generateInsertionSortSteps,
  'Merge Sort': generateMergeSortSteps,
  'Quick Sort': generateQuickSortSteps,
  'Heap Sort': sortingAlgorithms['Heap Sort'],
  'Shell Sort': sortingAlgorithms['Shell Sort'],
  'Cocktail Shaker Sort': sortingAlgorithms['Cocktail Shaker Sort'],
};

describe('Sorting Algorithms', () => {
  for (const [name, gen] of Object.entries(algorithms)) {
    describe(name, () => {
      it('should sort a small array', () => {
        const arr = [5, 3, 8, 1, 2];
        const steps = gen(arr);
        const lastStep = steps[steps.length - 1];
        expect(lastStep.sorted).toHaveLength(arr.length);
        expect(isSorted(lastStep.array)).toBe(true);
      });

      it('should sort a reverse-sorted array', () => {
        const arr = [9, 7, 5, 3, 1];
        const steps = gen(arr);
        const lastStep = steps[steps.length - 1];
        expect(isSorted(lastStep.array)).toBe(true);
        expect(lastStep.sorted).toHaveLength(arr.length);
      });

      it('should sort an already sorted array', () => {
        const arr = [1, 2, 3, 4, 5];
        const steps = gen(arr);
        const lastStep = steps[steps.length - 1];
        expect(isSorted(lastStep.array)).toBe(true);
      });

      it('should handle array with duplicates', () => {
        const arr = [4, 2, 4, 1, 2];
        const steps = gen(arr);
        const lastStep = steps[steps.length - 1];
        expect(isSorted(lastStep.array)).toBe(true);
      });

      it('should handle single-element array', () => {
        const arr = [42];
        const steps = gen(arr);
        const lastStep = steps[steps.length - 1];
        expect(isSorted(lastStep.array)).toBe(true);
        expect(lastStep.sorted).toHaveLength(1);
      });

      it('should handle two-element array', () => {
        const arr = [7, 3];
        const steps = gen(arr);
        const lastStep = steps[steps.length - 1];
        expect(isSorted(lastStep.array)).toBe(true);
      });

      it('should produce steps with array, comparing, sorted, and codeLine', () => {
        const steps = gen([3, 1, 2]);
        expect(steps.length).toBeGreaterThan(0);
        for (const step of steps) {
          expect(step).toHaveProperty('array');
          expect(step).toHaveProperty('comparing');
          expect(step).toHaveProperty('sorted');
          expect(step).toHaveProperty('codeLine');
          expect(Array.isArray(step.array)).toBe(true);
          expect(Array.isArray(step.comparing)).toBe(true);
          expect(Array.isArray(step.sorted)).toBe(true);
        }
      });

      it('should not mutate the original array', () => {
        const original = [5, 3, 8, 1, 2];
        const copy = [...original];
        gen(original);
        expect(original).toEqual(copy);
      });
    });
  }
});

describe('generateRandomArray', () => {
  it('should create array of specified size', () => {
    const arr = generateRandomArray(15);
    expect(arr).toHaveLength(15);
  });

  it('should contain values between 10 and 99', () => {
    const arr = generateRandomArray(100);
    for (const v of arr) {
      expect(v).toBeGreaterThanOrEqual(10);
      expect(v).toBeLessThanOrEqual(99);
    }
  });

  it('should produce different arrays on successive calls', () => {
    const a = generateRandomArray(20);
    const b = generateRandomArray(20);
    expect(a).not.toEqual(b);
  });
});

describe('First step consistency', () => {
  for (const [name, gen] of Object.entries(algorithms)) {
    it(`${name} first step should have empty comparing/sorted`, () => {
      const steps = gen([3, 1, 4, 1, 5]);
      expect(steps[0].comparing).toEqual([]);
      expect(steps[0].sorted).toEqual([]);
    });
  }
});
