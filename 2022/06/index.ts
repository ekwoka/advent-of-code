/**
 * --- Day 6: Tuning Trouble ---
 * Part 1: 00:04:31   1620
 * Part 2: 00:05:47   1642
 */

import { readFile } from 'node:fs/promises';

const input: string = await readFile('input.txt', 'utf-8');

// input is a string of characters representing data

const bytes = input.split('');

// Data indicating a message consists of {length} unique characters in a row
// Result is the position in the data where the last {length} characters are all unique

const getMessage = (bytes: string[], length = 4): number => {
  let marker = length;
  const signal = bytes.slice(0, marker);
  while (marker <= bytes.length) {
    if (new Set(signal).size === length) return marker;
    signal.shift();
    signal.push(bytes[marker]);
    marker++;
  }
  return -1;
};

// Part one is 4 unique characters in a row
console.log('Part 1:', getMessage(bytes));
// Part two is 14 unique characters in a row
console.log('Part 2:', getMessage(bytes, 14));
