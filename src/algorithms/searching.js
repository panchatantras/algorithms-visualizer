function* linearSearchGen(arr, target) {
  const a = [...arr];
  const n = a.length;
  yield { array: [...a], current: -1, checked: [], found: false, target, codeLine: 0 };
  for (let i = 0; i < n; i++) {
    const checked = Array.from({ length: i }, (_, j) => j);
    yield { array: [...a], current: i, checked, found: false, target, codeLine: 1 };
    yield { array: [...a], current: i, checked, found: false, target, codeLine: 2 };
    if (a[i] === target) {
      checked.push(i);
      yield { array: [...a], current: i, checked, found: true, target, codeLine: 3 };
      return;
    }
  }
  const checked = Array.from({ length: n }, (_, j) => j);
  yield { array: [...a], current: -1, checked, found: false, target, codeLine: 6 };
}

function* binarySearchGen(arr, target) {
  const a = [...arr];
  let left = 0;
  let right = a.length - 1;

  yield { array: [...a], left, right, mid: -1, found: false, target, checked: [], codeLine: 0 };
  yield { array: [...a], left, right, mid: -1, found: false, target, checked: [], codeLine: 1 };

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    yield { array: [...a], left, right, mid, found: false, target, checked: [], codeLine: 2 };
    yield { array: [...a], left, right, mid, found: false, target, checked: [], codeLine: 3 };

    if (a[mid] === target) {
      yield { array: [...a], left, right, mid, found: true, target, checked: [], codeLine: 4 };
      return;
    } else if (a[mid] < target) {
      left = mid + 1;
      yield { array: [...a], left, right, mid, found: false, target, checked: [], codeLine: 6 };
    } else {
      right = mid - 1;
      yield { array: [...a], left, right, mid, found: false, target, checked: [], codeLine: 8 };
    }
  }

  yield { array: [...a], left: -1, right: -1, mid: -1, found: false, target, checked: [], codeLine: 11 };
}

function* interpolationSearchGen(arr, target) {
  const a = [...arr];
  let left = 0;
  let right = a.length - 1;

  yield { array: [...a], left, right, mid: -1, found: false, target, checked: [], codeLine: 0 };

  while (left <= right && target >= a[left] && target <= a[right]) {
    if (a[left] === a[right]) {
      if (a[left] === target) {
        yield { array: [...a], left, right, mid: left, found: true, target, checked: [], codeLine: 10 };
        return;
      }
      break;
    }

    const pos = left + Math.floor(((target - a[left]) * (right - left)) / (a[right] - a[left]));
    const mid = Math.max(left, Math.min(right, pos));

    yield { array: [...a], left, right, mid, found: false, target, checked: [], codeLine: 5 };

    if (a[mid] === target) {
      yield { array: [...a], left, right, mid, found: true, target, checked: [], codeLine: 7 };
      return;
    }
    if (a[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
    yield { array: [...a], left, right, mid: -1, found: false, target, checked: [], codeLine: 1 };
  }

  yield { array: [...a], left: -1, right: -1, mid: -1, found: false, target, checked: [], codeLine: 14 };
}

function* ternarySearchGen(arr, target) {
  const a = [...arr];
  let left = 0;
  let right = a.length - 1;

  yield { array: [...a], left, right, mid1: -1, mid2: -1, found: false, target, checked: [], codeLine: 0 };

  while (left <= right) {
    const mid1 = left + Math.floor((right - left) / 3);
    const mid2 = right - Math.floor((right - left) / 3);

    yield { array: [...a], left, right, mid1, mid2, found: false, target, checked: [], codeLine: 3 };

    if (a[mid1] === target) {
      yield { array: [...a], left, right, mid1, mid2, found: true, target, checked: [], codeLine: 5 };
      return;
    }
    if (a[mid2] === target) {
      yield { array: [...a], left, right, mid1, mid2, found: true, target, checked: [], codeLine: 8 };
      return;
    }

    if (target < a[mid1]) {
      right = mid1 - 1;
    } else if (target > a[mid2]) {
      left = mid2 + 1;
    } else {
      left = mid1 + 1;
      right = mid2 - 1;
    }
    yield { array: [...a], left, right, mid1: -1, mid2: -1, found: false, target, checked: [], codeLine: 1 };
  }

  yield { array: [...a], left: -1, right: -1, mid1: -1, mid2: -1, found: false, target, checked: [], codeLine: 18 };
}

function collectSteps(generator, ...args) {
  const steps = [];
  for (const step of generator(...args)) {
    steps.push(step);
  }
  return steps;
}

export function generateLinearSearchSteps(arr, target) {
  return collectSteps(linearSearchGen, arr, target);
}

export function generateBinarySearchSteps(arr, target) {
  return collectSteps(binarySearchGen, arr, target);
}

export function generateRandomArray(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 90) + 10);
  }
  return arr;
}

export function generateSortedArray(size) {
  const arr = generateRandomArray(size);
  arr.sort((a, b) => a - b);
  return arr;
}

export function pickRandomTarget(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const searchingAlgorithms = {
  'Linear Search': generateLinearSearchSteps,
  'Binary Search': generateBinarySearchSteps,
  'Interpolation Search': (arr, target) => collectSteps(interpolationSearchGen, arr, target),
  'Ternary Search': (arr, target) => collectSteps(ternarySearchGen, arr, target),
};

export const searchingBigO = {
  'Linear Search': { time: 'O(n)', space: 'O(1)' },
  'Binary Search': { time: 'O(log n)', space: 'O(1)' },
  'Interpolation Search': { time: 'O(log log n) avg · O(n) worst', space: 'O(1)' },
  'Ternary Search': { time: 'O(log n)', space: 'O(1)' },
};

export const searchingPseudocode = {
  'Linear Search': [
    'procedure linearSearch(arr, target)',
    '  for i = 0 to n-1',
    '    if arr[i] == target',
    '      return i',
    '    end if',
    '  end for',
    '  return -1',
    'end procedure',
  ],
  'Binary Search': [
    'procedure binarySearch(arr, target)',
    '  left = 0, right = n-1',
    '  while left <= right',
    '    mid = floor((left + right) / 2)',
    '    if arr[mid] == target',
    '      return mid',
    '    else if arr[mid] < target',
    '      left = mid + 1',
    '    else',
    '      right = mid - 1',
    '    end if',
    '  end while',
    '  return -1',
    'end procedure',
  ],
  'Interpolation Search': [
    'procedure interpolationSearch(arr, target)',
    '  left = 0, right = n-1',
    '  while left <= right and target in range',
    '    pos = left + ((target - arr[left]) * (right - left)) / (arr[right] - arr[left])',
    '    mid = floor(pos)',
    '    if arr[mid] == target',
    '      return mid',
    '    else if arr[mid] < target',
    '      left = mid + 1',
    '    else',
    '      right = mid - 1',
    '    end if',
    '  end while',
    '  return -1',
    'end procedure',
  ],
  'Ternary Search': [
    'procedure ternarySearch(arr, target)',
    '  left = 0, right = n-1',
    '  while left <= right',
    '    mid1 = left + (right - left) / 3',
    '    mid2 = right - (right - left) / 3',
    '    if arr[mid1] == target',
    '      return mid1',
    '    if arr[mid2] == target',
    '      return mid2',
    '    if target < arr[mid1]',
    '      right = mid1 - 1',
    '    else if target > arr[mid2]',
    '      left = mid2 + 1',
    '    else',
    '      left = mid1 + 1',
    '      right = mid2 - 1',
    '    end if',
    '  end while',
    '  return -1',
    'end procedure',
  ],
};
