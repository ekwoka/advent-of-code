import { AOCInput } from '../../utils';
/**
 * --- Day 6: Wait For It ---
 */

export const partOne = (input: AOCInput): number => {
  return input
    .lines()
    .map((line) => line.splitBy(/\s+/).filter(testRegexp(/^\d+$/)).map(Number))
    .window(2)
    .map(([a, b]) => a.zip(b))
    .nth(0)
    .map(
      ([time, distance]) =>
        [
          (time - Math.sqrt(time ** 2 - 4 * distance)) / 2,
          (time + Math.sqrt(time ** 2 - 4 * distance)) / 2,
        ].map((t, i) => (Number.isInteger(t) ? t - i : Math.floor(t))) as [
          number,
          number,
        ],
    )
    .map(([min, max]) => max - min)
    .reduce((a, b) => a * b, 1);
};

export const partTwo = (input: AOCInput): number => {
  return input
    .lines()
    .map((line) => line.splitBy(/\s+/).filter(testRegexp(/^\d+$/)).sum())
    .map(Number)
    .window(2)
    .map(
      ([time, distance]) =>
        [
          (time - Math.sqrt(time ** 2 - 4 * distance)) / 2,
          (time + Math.sqrt(time ** 2 - 4 * distance)) / 2,
        ].map((t, i) => (Number.isInteger(t) ? t - i : Math.floor(t))) as [
          number,
          number,
        ],
    )
    .flat()
    .reduce((min, max) => max - min);
};

const testRegexp = (regex: RegExp) => (str: AOCInput | string) =>
  regex.test(str as string);
