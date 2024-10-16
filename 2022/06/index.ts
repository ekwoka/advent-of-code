/**
 * --- Day 6: Tuning Trouble ---
 * Part 1: 00:04:31   1620
 * Part 2: 00:05:47   1642
 */

import { getInputRaw } from '../../utils';
import { david, get_message_optimized_bits } from './main.rs';

const input: string = await getInputRaw(2022, 6);

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

const getMessageOptimized = (input: string, length = 4): number => {
  const bytes = new Uint8Array(input.length);
  new TextEncoder().encodeInto(input, bytes);
  let l = 0;
  let r = l;
  const seen = new Set<number>();
  while (r < bytes.length && seen.size !== length) {
    if (seen.has(bytes[r])) {
      while (bytes[l] !== bytes[r]) {
        seen.delete(bytes[l]);
        l++;
      }
      l++;
    } else {
      seen.add(bytes[r]);
    }
    r++;
  }
  return r;
};

const getMessageOptimizedBits = (input: string, length = 4): number => {
  const bytes = new Uint8Array(input.length);
  new TextEncoder().encodeInto(input, bytes);
  let l = 0;
  let r = l;
  let seen = 0;
  let count = 0;
  while (r < bytes.length && count !== length) {
    if (seen & (1 << (bytes[r] - 97))) {
      while (bytes[l] ^ bytes[r]) {
        seen ^= 1 << (bytes[l] - 97);
        l++;
        count--;
      }
      l++;
    } else {
      seen |= 1 << (bytes[r] - 97);
      count++;
    }
    r++;
  }
  return r;
};

// Part one is 4 unique characters in a row
console.time('Part 1');
console.log('Part 1:', getMessage(bytes));
console.timeEnd('Part 1');

// Part two is 14 unique characters in a row
console.time('Part 2');
console.log('Part 2:', getMessage(bytes, 14));
console.timeEnd('Part 2');

console.log('\nOptimized version\n');
// Part two is 14 unique characters in a row
console.time('Part 2');
console.log('Part 2:', getMessageOptimized(input, 14));
console.timeEnd('Part 2');

console.log('\nOptimized Bitsversion\n');

// Part two is 14 unique characters in a row
console.time('Part 2');
console.log('Part 2:', getMessageOptimizedBits(input, 14));
console.timeEnd('Part 2');

/* These are run once before the time due to issues with WASM initialization */
console.log('\nRust David\n');

// Part two is 14 unique characters in a row
console.log('Part 2:', david(input, 14));
console.time('Part 2');
console.log('Part 2:', david(input, 14));
console.timeEnd('Part 2');

console.log('\nRust Optimized\n');

// Part two is 14 unique characters in a row
console.log('Part 2:', get_message_optimized_bits(input, 14));
console.time('Part 2');
console.log('Part 2:', get_message_optimized_bits(input, 14));
console.timeEnd('Part 2');
