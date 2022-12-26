/**
 * --- Day 25: Full of Hot Air ---
 * Part 1: >24h  12014
 * Part 2: >24h   7651
 * Simple problem to wrap up the event!
 */
import { readFile } from 'node:fs/promises';

const input: string = (await readFile('input.txt', 'utf8')).trim();

// Input consists of `snafu numbers` which are BASE 5 and have place values ranging from 2 to -2
const snafuNums = input.split('\n');

const snafuMap = {
  2: 2,
  1: 1,
  0: 0,
  '-': -1,
  '=': -2,
};

const intMap = {
  2: '2',
  1: '1',
  0: '0',
  '-1': '-',
  '-2': '=',
};

// First step is to convert the snafu numbers to integers
const snafuToInt = (snafu: string): number =>
  snafu
    .split('')
    .reverse()
    .reduce((acc, next, i) => acc + snafuMap[next] * 5 ** i, 0);

// Later we'll need to convert an integer to a snafu number
const intToSnafu = (num: number): string => {
  let highestPower = Math.floor(Math.log(num) / Math.log(5));
  const result: number[] = [];
  while (highestPower >= 0) {
    const power = 5 ** highestPower;
    const digit = Math.floor(num / power);
    result.push(digit);
    num -= digit * power;
    highestPower--;
  }
  result.reverse();
  for (let i = 0; i < result.length; i++)
    if (result[i] > 2) {
      result[i] -= 5;
      result[i + 1] += 1;
    }

  return result
    .reverse()
    .map((n) => intMap[n])
    .join('');
};

// The problem is simple: sum up the snafu numbers and return a snafu number of the result
console.log(intToSnafu(snafuNums.map(snafuToInt).reduce((a, b) => a + b)));
