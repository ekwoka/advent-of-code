import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput): number => {
  return input
    .lines()
    .filter(Boolean)
    .flatMap((line) => line.matchAll(/(?:^"|"$|\\x[0-9a-f]{2}|\\\\|\\")/g))
    .map((match) => match[0])
    .map((match) => Math.max(match.length - 1, 1))
    .sum();
};

export const partTwo = (input: AOCInput): number => {
  return input
    .lines()
    .filter(Boolean)
    .map((line) => `"${line.replaceAll(/("|\\)/g, '\\$1')}"`)
    .flatMap((line) => line.matchAll(/(?:^"|"$|\\x[0-9a-f]{2}|\\\\|\\")/g))
    .map((match) => match[0])
    .map((match) => Math.max(match.length - 1, 1))
    .sum();
};
