import { range } from '@ekwoka/rust-ts';
import { AOCInput } from '../../utils';

const { abs } = Math;

/**
 * --- Day 11: Cosmic Expansion ---
 */
export const solveWithExpansionFactor = (
  input: AOCInput,
  factor = 2,
): number => {
  const emptyY = input
    .lines()
    .enumerate()
    .filter(([_, line]) => !line.includes('#'))
    .map(([y]) => y)
    .sort()
    .reverse()
    .collect();
  const emptyX = input
    .lines()
    .fold(
      (acc, line) => {
        return acc.filter((i) => line[i] !== '#');
      },
      range(0, input.lines().nth(0).length - 1),
    )
    .map((x) => x)
    .sort()
    .reverse()
    .collect();
  const galaxies = input
    .lines()
    .enumerate()
    .flatMap(([y, line]) =>
      line
        .chars()
        .enumerate()
        .filter(([_, ch]) => ch === '#')
        .map(([x]) => [x, y] as [number, number]),
    )
    .map(
      ([x, y]) =>
        [
          x +
            emptyX
              .toIter()
              .filter((ex) => Boolean(ex < x))
              .count() *
              (factor - 1),
          y +
            emptyY
              .toIter()
              .filter((ey) => Boolean(ey < y))
              .count() *
              (factor - 1),
        ] as [number, number],
    )
    .enumerate()
    .collect();
  return galaxies
    .toIter()
    .flatMap(([i, galaxyA]) =>
      galaxies
        .toIter()
        .filter(([j]) => j > i)
        .map(([, galaxyB]) => galaxyB)
        .map(distanceFrom(galaxyA)),
    )
    .sum();
};

const distanceFrom = (a: [number, number]) => (b: [number, number]) =>
  abs(a[0] - b[0]) + abs(a[1] - b[1]);
