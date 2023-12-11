import { AOCInput } from '../../utils';

const { abs } = Math;

/**
 * --- Day 11: Cosmic Expansion ---
 */
export const solveWithExpansionFactor = (
  input: AOCInput,
  factor = 2,
): number => {
  const [emptyX, emptyY] = input
    .lines()
    .enumerate()
    .flatMap(([y, line]) =>
      line
        .chars()
        .enumerate()
        .map(([x, ch]) => [x, y, ch]),
    )
    .fold(
      (acc, [x, y, ch]) => {
        acc[0][x] ??= x;
        acc[1][y] ??= y;
        if (ch === '#') {
          acc[0][x] = false;
          acc[1][y] = false;
        }
        return acc;
      },
      [[], []] as [(number | false)[], (number | false)[]],
    )
    .map(
      (idxs) =>
        idxs
          .filter((idx) => typeof idx === 'number')
          .sort()
          .reverse() as number[],
    );
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
