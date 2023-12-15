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

export const partTwo = (_input: AOCInput): number => {
  return 0;
};
