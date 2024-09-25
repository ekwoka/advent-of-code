import { range } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput) => {
  const [row, col] = input
    .lines()
    .filter(Boolean)
    .flatMap((line) => line.matchAll(/\d+/g))
    .map(Number);
  const codePosition =
    range(1, col).sum() +
    range(1, row - 1)
      .map((row) => row + col - 1)
      .sum();
  return range(2, codePosition).fold(
    (previousCode) => (previousCode * 252_533n) % 33_554_393n,
    2015_11_25n,
  );
};
