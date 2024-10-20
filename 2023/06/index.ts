import type { AOCInput } from '../../utils';
import '@ekwoka/rust-ts/prelude';
/**
 * --- Day 6: Wait For It ---
 */
const { sqrt } = Math;

export const partOne = (input: AOCInput): number => {
  return input
    .lines()
    .map((line) => line.splitBy(' ').filter(testRegexp(/^\d+$/)).map(Number))
    .window(2)
    .map(([a, b]) => a.zip(b))
    .nth(0)
    .map(
      ([time, distance]) =>
        time - toNextOdd(time - sqrt(time ** 2 - 4 * distance)),
    )
    .reduce((a, b) => a * b, 1);
};

export const partTwo = (input: AOCInput): number => {
  return input
    .lines()
    .map((line) => line.split(/\s+/).iter().filter(testRegexp(/^\d+$/)).sum())
    .map(Number)
    .window(2)
    .map(
      ([time, distance]) =>
        time - toNextOdd(time - sqrt(time ** 2 - 4 * distance)),
    )
    .sum();
};

const testRegexp = (regex: RegExp) => (str: AOCInput | string) =>
  regex.test(str as string);

const toNextOdd = (n: number) => (n | 0) + ((n & 1) ^ 1);
