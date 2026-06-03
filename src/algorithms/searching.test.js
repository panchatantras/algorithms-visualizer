import { describe, it, expect } from 'vitest';
import {
  searchingAlgorithms,
  generateSortedArray,
  generateLinearSearchSteps,
  generateBinarySearchSteps,
} from './searching';

const knownArrays = {
  small: [1, 3, 5, 7, 9],
  duplicates: [2, 2, 4, 4, 6, 6],
  single: [10],
};

const algorithms = {
  'Linear Search': generateLinearSearchSteps,
  'Binary Search': generateBinarySearchSteps,
  'Interpolation Search': searchingAlgorithms['Interpolation Search'],
  'Ternary Search': searchingAlgorithms['Ternary Search'],
};

describe('Searching Algorithms', () => {
  for (const [name, gen] of Object.entries(algorithms)) {
    describe(name, () => {
      it('should find a target present in the array', () => {
        const steps = gen([1, 3, 5, 7, 9], 5);
        const lastStep = steps[steps.length - 1];
        expect(lastStep.found).toBe(true);
      });

      it('should find the first element', () => {
        const steps = gen([1, 3, 5, 7, 9], 1);
        const lastStep = steps[steps.length - 1];
        expect(lastStep.found).toBe(true);
      });

      it('should find the last element', () => {
        const steps = gen([1, 3, 5, 7, 9], 9);
        const lastStep = steps[steps.length - 1];
        expect(lastStep.found).toBe(true);
      });

      it('should not find a target absent from the array', () => {
        const steps = gen([1, 3, 5, 7, 9], 4);
        const lastStep = steps[steps.length - 1];
        expect(lastStep.found).toBe(false);
      });

      it('should handle single-element array with target present', () => {
        const steps = gen([10], 10);
        const lastStep = steps[steps.length - 1];
        expect(lastStep.found).toBe(true);
      });

      it('should handle single-element array with target absent', () => {
        const steps = gen([10], 5);
        const lastStep = steps[steps.length - 1];
        expect(lastStep.found).toBe(false);
      });

      it('should handle array with duplicates', () => {
        const steps = gen([2, 2, 4, 4, 6, 6], 4);
        const lastStep = steps[steps.length - 1];
        expect(lastStep.found).toBe(true);
      });

      it('should produce steps with codeLine', () => {
        const steps = gen([1, 3, 5], 3);
        expect(steps.length).toBeGreaterThan(0);
        for (const step of steps) {
          expect(step).toHaveProperty('codeLine');
          expect(step).toHaveProperty('found');
          expect(step).toHaveProperty('target');
          expect(Array.isArray(step.array)).toBe(true);
        }
      });
    });
  }
});

describe('generateSortedArray', () => {
  it('should create a sorted array of specified size', () => {
    const arr = generateSortedArray(10);
    expect(arr).toHaveLength(10);
    for (let i = 1; i < arr.length; i++) {
      expect(arr[i]).toBeGreaterThanOrEqual(arr[i - 1]);
    }
  });

  it('should contain values between 10 and 99', () => {
    const arr = generateSortedArray(50);
    for (const v of arr) {
      expect(v).toBeGreaterThanOrEqual(10);
      expect(v).toBeLessThanOrEqual(99);
    }
  });
});

describe('Interpolation Search edge cases', () => {
  it('should find target in two-element array', () => {
    const gen = searchingAlgorithms['Interpolation Search'];
    const steps = gen([1, 5], 5);
    expect(steps[steps.length - 1].found).toBe(true);
  });

  it('should handle target outside range', () => {
    const gen = searchingAlgorithms['Interpolation Search'];
    const steps = gen([1, 3, 5, 7, 9], 0);
    expect(steps[steps.length - 1].found).toBe(false);
  });
});

describe('Ternary Search edge cases', () => {
  it('should find target in three-element array', () => {
    const gen = searchingAlgorithms['Ternary Search'];
    const steps = gen([1, 3, 5], 3);
    expect(steps[steps.length - 1].found).toBe(true);
  });

  it('should find target at mid1 position', () => {
    const gen = searchingAlgorithms['Ternary Search'];
    const steps = gen([1, 2, 3, 4, 5, 6, 7], 3);
    expect(steps[steps.length - 1].found).toBe(true);
  });
});
