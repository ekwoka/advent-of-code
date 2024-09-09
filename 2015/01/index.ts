import type { AOCInput } from '../../utils';

/**
 * Just need to help Santa find the correct floor.
 * Here `(` means up and `)` means down.
 * We just get through all the instructions and find where
 * we end up.
 */
export const partOne = (input: AOCInput): number => {
  return input
    .chars()
    .map((char) => (char === '(' ? 1 : -1))
    .sum();
};

/**
 * Same rules, but we want to find which step leaves us at
 * floor -1.
 * So we can just iteratively accumulate the values and
 * stop when we reach -1.
 */
export const partTwo = (input: AOCInput): number => {
  return (
    input
      .chars()
      .map((char) => (char === '(' ? 1 : -1))
      .scan((state: [number], change: number) => {
        return (state[0] += change);
      }, 0)
      .takeWhile((floor) => floor >= 0)
      .count() + 1
  );
};
