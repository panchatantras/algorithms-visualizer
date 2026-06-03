function collectSteps(generator, arr) {
  const steps = [];
  for (const step of generator(arr)) {
    steps.push(step);
  }
  return steps;
}

function* bubbleSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  yield { array: [...a], comparing: [], sorted: [], codeLine: 0 };
  for (let i = 0; i < n - 1; i++) {
    yield { array: [...a], comparing: [], sorted: sortedIndices(i, n), codeLine: 1 };
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: [...a], comparing: [j, j + 1], sorted: sortedIndices(i, n), codeLine: 2 };
      yield { array: [...a], comparing: [j, j + 1], sorted: sortedIndices(i, n), codeLine: 3 };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { array: [...a], comparing: [j, j + 1], sorted: sortedIndices(i, n), codeLine: 4 };
      }
    }
  }
  yield { array: [...a], comparing: [], sorted: allIndices(n), codeLine: 8 };
}

function* selectionSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  yield { array: [...a], comparing: [], sorted: [], codeLine: 0 };
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    yield { array: [...a], comparing: [i], sorted: sortedIndicesStart(i), codeLine: 1 };
    yield { array: [...a], comparing: [minIdx], sorted: sortedIndicesStart(i), codeLine: 2 };
    for (let j = i + 1; j < n; j++) {
      yield { array: [...a], comparing: [j, minIdx], sorted: sortedIndicesStart(i), codeLine: 3 };
      if (a[j] < a[minIdx]) {
        minIdx = j;
        yield { array: [...a], comparing: [j, minIdx], sorted: sortedIndicesStart(i), codeLine: 4 };
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { array: [...a], comparing: [i, minIdx], sorted: sortedIndicesStart(i), codeLine: 7 };
    }
    yield { array: [...a], comparing: [], sorted: sortedIndicesStart(i + 1), codeLine: 1 };
  }
  yield { array: [...a], comparing: [], sorted: allIndices(n), codeLine: 11 };
}

function* insertionSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  yield { array: [...a], comparing: [], sorted: [], codeLine: 0 };
  for (let i = 1; i < n; i++) {
    let key = a[i];
    let j = i - 1;
    yield { array: [...a], comparing: [i], sorted: [], codeLine: 1 };
    yield { array: [...a], comparing: [i, j], sorted: [], codeLine: 2 };
    yield { array: [...a], comparing: [i, j], sorted: [], codeLine: 3 };
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
      yield { array: [...a], comparing: [j + 1, j >= 0 ? j : -1], sorted: [], codeLine: 4 };
    }
    a[j + 1] = key;
    yield { array: [...a], comparing: [j + 1], sorted: [], codeLine: 6 };
  }
  yield { array: [...a], comparing: [], sorted: allIndices(n), codeLine: 8 };
}

function* mergeSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  yield { array: [...a], comparing: [], sorted: [], codeLine: 0 };
  for (let size = 1; size < n; size *= 2) {
    yield { array: [...a], comparing: [], sorted: [], codeLine: 1 };
    for (let left = 0; left < n - size; left += 2 * size) {
      const mid = left + size - 1;
      const right = Math.min(left + 2 * size - 1, n - 1);
      const leftArr = a.slice(left, mid + 1);
      const rightArr = a.slice(mid + 1, right + 1);
      let i = 0, j = 0, k = left;
      yield { array: [...a], comparing: [left, right], sorted: [], codeLine: 6 };
      while (i < leftArr.length && j < rightArr.length) {
        yield { array: [...a], comparing: [k], sorted: [], codeLine: 7 };
        if (leftArr[i] <= rightArr[j]) {
          a[k] = leftArr[i];
          i++;
          yield { array: [...a], comparing: [k], sorted: [], codeLine: 8 };
        } else {
          a[k] = rightArr[j];
          j++;
          yield { array: [...a], comparing: [k], sorted: [], codeLine: 10 };
        }
        k++;
      }
      while (i < leftArr.length) {
        a[k] = leftArr[i];
        i++; k++;
        yield { array: [...a], comparing: [k - 1], sorted: [], codeLine: 8 };
      }
      while (j < rightArr.length) {
        a[k] = rightArr[j];
        j++; k++;
        yield { array: [...a], comparing: [k - 1], sorted: [], codeLine: 10 };
      }
    }
  }
  yield { array: [...a], comparing: [], sorted: allIndices(n), codeLine: 4 };
}

function* quickSortGen(arr) {
  const a = [...arr];
  yield { array: [...a], comparing: [], sorted: [], codeLine: 0 };
  yield* quickSortHelper(a, 0, a.length - 1);
  yield { array: [...a], comparing: [], sorted: allIndices(a.length), codeLine: 5 };
}

function* quickSortHelper(a, low, high) {
  if (low < high) {
    yield { array: [...a], comparing: [low, high], sorted: [], codeLine: 1 };
    const pi = yield* partition(a, low, high);
    yield { array: [...a], comparing: [], sorted: [], codeLine: 3 };
    yield* quickSortHelper(a, low, pi - 1);
    yield { array: [...a], comparing: [], sorted: [], codeLine: 4 };
    yield* quickSortHelper(a, pi + 1, high);
  }
}

function* partition(a, low, high) {
  const pivot = a[high];
  let i = low - 1;
  yield { array: [...a], comparing: [], sorted: [], codeLine: 9 };
  yield { array: [...a], comparing: [high], sorted: [], codeLine: 10 };
  yield { array: [...a], comparing: [], sorted: [], codeLine: 11 };
  for (let j = low; j < high; j++) {
    yield { array: [...a], comparing: [j, high], sorted: [], codeLine: 12 };
    yield { array: [...a], comparing: [j, high], sorted: [], codeLine: 13 };
    if (a[j] < pivot) {
      i++;
      [a[i], a[j]] = [a[j], a[i]];
      if (i !== j) {
        yield { array: [...a], comparing: [i, j], sorted: [], codeLine: 14 };
      }
    }
  }
  [a[i + 1], a[high]] = [a[high], a[i + 1]];
  yield { array: [...a], comparing: [i + 1, high], sorted: [], codeLine: 16 };
  return i + 1;
}

function sortedIndices(count, total) {
  const idx = [];
  for (let k = total - count; k < total; k++) idx.push(k);
  return idx;
}

function sortedIndicesStart(count) {
  const idx = [];
  for (let k = 0; k < count; k++) idx.push(k);
  return idx;
}

function allIndices(n) {
  return Array.from({ length: n }, (_, i) => i);
}

export function generateBubbleSortSteps(arr) {
  return collectSteps(bubbleSortGen, arr);
}

export function generateSelectionSortSteps(arr) {
  return collectSteps(selectionSortGen, arr);
}

export function generateInsertionSortSteps(arr) {
  return collectSteps(insertionSortGen, arr);
}

export function generateMergeSortSteps(arr) {
  return collectSteps(mergeSortGen, arr);
}

export function generateQuickSortSteps(arr) {
  return collectSteps(quickSortGen, arr);
}

export function generateRandomArray(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 90) + 10);
  }
  return arr;
}

export function* heapSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  yield { array: [...a], comparing: [], sorted: [], codeLine: 0 };
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(a, n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    yield { array: [...a], comparing: [0, i], sorted: sortedIndicesFrom(i, n), codeLine: 8 };
    yield* heapify(a, i, 0);
  }
  yield { array: [...a], comparing: [], sorted: allIndices(n), codeLine: 10 };
}

function* heapify(a, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  if (left < n) {
    yield { array: [...a], comparing: [left, largest], sorted: [], codeLine: 3 };
    if (a[left] > a[largest]) largest = left;
  }
  if (right < n) {
    yield { array: [...a], comparing: [right, largest], sorted: [], codeLine: 4 };
    if (a[right] > a[largest]) largest = right;
  }
  if (largest !== i) {
    [a[i], a[largest]] = [a[largest], a[i]];
    yield { array: [...a], comparing: [i, largest], sorted: [], codeLine: 5 };
    yield* heapify(a, n, largest);
  }
}

function* shellSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    yield { array: [...a], comparing: [], sorted: [], codeLine: 1 };
    for (let i = gap; i < n; i++) {
      const temp = a[i];
      let j = i;
      yield { array: [...a], comparing: [i, j - gap], sorted: [], codeLine: 3 };
      while (j >= gap && a[j - gap] > temp) {
        a[j] = a[j - gap];
        j -= gap;
        yield { array: [...a], comparing: [j, j + gap], sorted: [], codeLine: 4 };
      }
      a[j] = temp;
      yield { array: [...a], comparing: [j], sorted: [], codeLine: 5 };
    }
  }
  yield { array: [...a], comparing: [], sorted: allIndices(n), codeLine: 7 };
}

function* cocktailShakerSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  let start = 0, end = n - 1;
  let swapped = true;
  while (swapped) {
    swapped = false;
    yield { array: [...a], comparing: [], sorted: sortedIndicesFrom(end + 1, n).concat(sortedIndicesStart(start)), codeLine: 1 };
    for (let i = start; i < end; i++) {
      yield { array: [...a], comparing: [i, i + 1], sorted: sortedIndicesFrom(end + 1, n).concat(sortedIndicesStart(start)), codeLine: 3 };
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        swapped = true;
        yield { array: [...a], comparing: [i, i + 1], sorted: sortedIndicesFrom(end + 1, n).concat(sortedIndicesStart(start)), codeLine: 4 };
      }
    }
    end--;
    if (!swapped) break;
    swapped = false;
    yield { array: [...a], comparing: [], sorted: sortedIndicesFrom(end + 1, n).concat(sortedIndicesStart(start)), codeLine: 6 };
    for (let i = end - 1; i >= start; i--) {
      yield { array: [...a], comparing: [i, i + 1], sorted: sortedIndicesFrom(end + 1, n).concat(sortedIndicesStart(start)), codeLine: 7 };
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        swapped = true;
        yield { array: [...a], comparing: [i, i + 1], sorted: sortedIndicesFrom(end + 1, n).concat(sortedIndicesStart(start)), codeLine: 4 };
      }
    }
    start++;
  }
  yield { array: [...a], comparing: [], sorted: allIndices(n), codeLine: 12 };
}

function sortedIndicesFrom(start, n) {
  const idx = [];
  for (let k = start; k < n; k++) idx.push(k);
  return idx;
}

export const sortingAlgorithms = {
  'Bubble Sort': generateBubbleSortSteps,
  'Selection Sort': generateSelectionSortSteps,
  'Insertion Sort': generateInsertionSortSteps,
  'Merge Sort': generateMergeSortSteps,
  'Quick Sort': generateQuickSortSteps,
  'Heap Sort': (arr) => collectSteps(heapSortGen, arr),
  'Shell Sort': (arr) => collectSteps(shellSortGen, arr),
  'Cocktail Shaker Sort': (arr) => collectSteps(cocktailShakerSortGen, arr),
};

export const sortingBigO = {
  'Bubble Sort': { time: 'O(n²)', space: 'O(1)' },
  'Selection Sort': { time: 'O(n²)', space: 'O(1)' },
  'Insertion Sort': { time: 'O(n²)', space: 'O(1)' },
  'Merge Sort': { time: 'O(n log n)', space: 'O(n)' },
  'Quick Sort': { time: 'O(n log n) avg · O(n²) worst', space: 'O(log n)' },
  'Heap Sort': { time: 'O(n log n)', space: 'O(1)' },
  'Shell Sort': { time: 'O(n log n)～O(n²)', space: 'O(1)' },
  'Cocktail Shaker Sort': { time: 'O(n²)', space: 'O(1)' },
};

export const sortingPseudocode = {
  'Bubble Sort': [
    'procedure bubbleSort(arr)',
    '  for i = 0 to n-1',
    '    for j = 0 to n-i-2',
    '      if arr[j] > arr[j+1]',
    '        swap(arr[j], arr[j+1])',
    '      end if',
    '    end for',
    '  end for',
    'end procedure',
  ],
  'Selection Sort': [
    'procedure selectionSort(arr)',
    '  for i = 0 to n-1',
    '    minIdx = i',
    '    for j = i+1 to n-1',
    '      if arr[j] < arr[minIdx]',
    '        minIdx = j',
    '      end if',
    '    end for',
    '    swap(arr[i], arr[minIdx])',
    '  end for',
    'end procedure',
  ],
  'Insertion Sort': [
    'procedure insertionSort(arr)',
    '  for i = 1 to n-1',
    '    key = arr[i]',
    '    j = i - 1',
    '    while j >= 0 and arr[j] > key',
    '      arr[j+1] = arr[j]',
    '      j = j - 1',
    '    end while',
    '    arr[j+1] = key',
    '  end for',
    'end procedure',
  ],
  'Merge Sort': [
    'procedure mergeSort(arr)',
    '  if size < 2 return',
    '  mid = n / 2',
    '  left = arr[0..mid-1]',
    '  right = arr[mid..n-1]',
    '  mergeSort(left)',
    '  mergeSort(right)',
    '  merge(left, right, arr)',
    'end procedure',
    '',
    'procedure merge(left, right, arr)',
    '  while left and right not empty',
    '    if left[0] <= right[0]',
    '      arr[k++] = left.shift()',
    '    else',
    '      arr[k++] = right.shift()',
    '    end if',
    '  end while',
    'end procedure',
  ],
  'Quick Sort': [
    'procedure quickSort(arr, low, high)',
    '  if low < high',
    '    pivot = partition(arr, low, high)',
    '    quickSort(arr, low, pivot-1)',
    '    quickSort(arr, pivot+1, high)',
    '  end if',
    'end procedure',
    '',
    'procedure partition(arr, low, high)',
    '  pivot = arr[high]',
    '  i = low - 1',
    '  for j = low to high-1',
    '    if arr[j] < pivot',
    '      i = i + 1',
    '      swap(arr[i], arr[j])',
    '    end if',
    '  end for',
    '  swap(arr[i+1], arr[high])',
    '  return i + 1',
    'end procedure',
  ],
  'Heap Sort': [
    'procedure heapSort(arr)',
    '  buildMaxHeap(arr)',
    '  for i = n-1 down to 1',
    '    swap(arr[0], arr[i])',
    '    heapify(arr, i, 0)',
    '  end for',
    'end procedure',
    '',
    'procedure heapify(arr, n, i)',
    '  largest = i',
    '  if left < n and arr[left] > arr[largest]',
    '    largest = left',
    '  if right < n and arr[right] > arr[largest]',
    '    largest = right',
    '  if largest != i',
    '    swap(arr[i], arr[largest])',
    '    heapify(arr, n, largest)',
    'end procedure',
  ],
  'Shell Sort': [
    'procedure shellSort(arr)',
    '  for gap = n/2 down to 1',
    '    for i = gap to n-1',
    '      temp = arr[i]',
    '      while j >= gap and arr[j-gap] > temp',
    '        arr[j] = arr[j-gap]',
    '        j = j - gap',
    '      arr[j] = temp',
    '    end for',
    '  end for',
    'end procedure',
  ],
  'Cocktail Shaker Sort': [
    'procedure cocktailShakerSort(arr)',
    '  while swapped',
    '    swapped = false',
    '    for i = start to end-1',
    '      if arr[i] > arr[i+1]',
    '        swap(arr[i], arr[i+1])',
    '        swapped = true',
    '    end for',
    '    end = end - 1',
    '    for i = end-1 down to start',
    '      if arr[i] > arr[i+1]',
    '        swap(arr[i], arr[i+1])',
    '        swapped = true',
    '    start = start + 1',
    '  end while',
    'end procedure',
  ],
};
