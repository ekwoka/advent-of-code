import '@ekwoka/rust-ts/prelude';
import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput) => {
  const iter = input.chars();
  return iter
    .map((ch) => {
      if (ch === '\n' || ch === ' ') return 0;
      if (ch !== '(') return 1;
      const [length, count] = iter
        .takeWhile((ch) => ch !== ')')
        .sum()
        .split('x')
        .map(Number);
      iter.take(length).collect();
      return length * count;
    })
    .sum();
};
export const partTwo = (input: AOCInput | Iterator<string>): number => {
  const iter = input.iter();
  return iter
    .map((ch) => {
      if (ch === '\n' || ch === ' ') return 0;
      if (ch !== '(') return 1;
      const [length, count] = iter
        .takeWhile((ch) => ch !== ')')
        .sum()
        .split('x')
        .map(Number);
      const size = partTwo(iter.take(length));
      return size * count;
    })
    .sum();
};
