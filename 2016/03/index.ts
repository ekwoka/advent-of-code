import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput) => {
  return input
    .lines()
    .filter(Boolean)
    .map((line) => line.matchAll(/\d+/g))
    .map((match) => [...match].map(Number))
    .filter(([a, b, c]) => a < b + c && b < a + c && c < b + a)
    .count();
};
export const partTwo = (input: AOCInput) => {
  return input
    .lines()
    .filter(Boolean)
    .map((line) => line.matchAll(/\d+/g))
    .map((match) => [...match].map(Number))
    .arrayChunks(3)
    .flatMap(([a, b, c]) => a.map((a, i) => [a, b[i], c[i]]))
    .filter(([a, b, c]) => a < b + c && b < a + c && c < b + a)
    .count();
};
