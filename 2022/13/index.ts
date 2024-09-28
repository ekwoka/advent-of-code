/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * --- Day 13: Distress Signal ---
 * Part 1: 00:14:46    453
 * Part 2: 00:47:33   2411
 * Just some sorting of complicated data structures
 */
import { readFile } from 'node:fs/promises';

const input: string = await readFile('input.txt', 'utf8');

// Pairs of signals (arbitrarily deeply nested arrays of numbers)
const pairs = input
  .split('\n\n')
  .filter(Boolean)
  .map((pair) =>
    pair
      .split('\n')
      .filter(Boolean)
      .map((signal) => new Function(`return ${signal}`)()),
  );

// For Part 1, we just need to know which pairs are out of order
const compareToBoolean = (num: number): boolean | undefined => {
  if (num === 0) return undefined;
  if (num < 0) return true;
  return false;
};

// The main comaprison function
// Numbers compared as normal
// Arrays compared by each value in order or by length of the array
const compare = (a: number | number[], b: number | number[], part2 = false) => {
  if (!Array.isArray(a) && !Array.isArray(b))
    return part2 ? a - b : compareToBoolean(a - b);
  const [aArray, bArray] = [a, b].map(arrayWrap).map(deepClone);
  while (aArray.length && bArray.length) {
    const result = compare(aArray.shift(), bArray.shift(), part2);
    if (result !== undefined) return result;
  }
  if (aArray.length) return part2 ? 1 : false;
  if (bArray.length) return part2 ? -1 : true;
  return part2 ? 0 : undefined;
};

// Part 2 consists of injecting 2 decoder signals, sorting all the signals, and determining the index of the decoder signals
const findDecoderKeys = (pairs: number[][][][]) => {
  const decoderKeys: number[][][] = [[[2]], [[6]]];
  const sortedSignals = bubbleSort(deepClone(pairs).flat().concat(decoderKeys));
  const keys = decoderKeys
    .map((key) =>
      sortedSignals.findIndex(
        (signal) => JSON.stringify(signal) === JSON.stringify(key),
      ),
    )
    .map((key) => key + 1);
  return keys;
};

console.log(
  'Part One:',
  deepClone(pairs)
    .map(([a, b]) => compare(a, b))
    .reduce((acc, bool, i) => (bool ? acc + i + 1 : acc), 0),
);
console.log(
  'Part Two',
  findDecoderKeys(pairs).reduce((a, b) => a * b),
);

function arrayWrap<T>(a: T | T[]): T[] {
  return Array.isArray(a) ? a : [a];
}

function deepClone<T>(a: T): T {
  return JSON.parse(JSON.stringify(a));
}

// This challenge required a custom sort, as the built in sort for my JavaScript engine is optimized in a way that doesn't quite work for this comparison
function bubbleSort(arr: number[][][]) {
  let swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (
        compare(arr[i + 1] as unknown as number, arr[i] as unknown as number)
      ) {
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
  }
  return arr;
}
