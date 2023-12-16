import { AOCInput } from '../../utils';

/**
 * --- Day 15: ??? ---
 */
export const partOne = (input: AOCInput): number => {
  return input
    .lines()
    .nth(0)
    .splitBy(',')
    .map((part) =>
      part
        .chars()
        .map((ch) => ch.charCodeAt(0))
        .reduce((acc, ch) => ((acc + ch) * 17) % 256, 0),
    )
    .sum();
};

export const partTwo = (input: AOCInput): number => {
  return input
    .lines()
    .nth(0)
    .splitBy(',')
    .map((part) => part.split(/=|-/).filter(Boolean))
    .fold(
      (acc, [key, value]) => {
        const box = hash(key);
        (acc[box] ??= new Map<string, number>())[value ? 'set' : 'delete'](
          key,
          +value,
        );
        return acc;
      },
      Array(256).fill(null) as Map<string, number>[],
    )
    .toIter()
    .enumerate()
    .filter(([_, map]) => map?.size > 0)
    .flatMap(([box, map]) =>
      map
        .toIter()
        .enumerate()
        .map(([slot, [_, value]]) => (box + 1) * (slot + 1) * value),
    )
    .sum();
};

const hash = (input: string): number => {
  return input
    .split('')
    .toIter()
    .map((ch) => ch.charCodeAt(0))
    .reduce((acc, ch) => ((acc + ch) * 17) % 256, 0);
};
