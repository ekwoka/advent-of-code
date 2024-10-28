import '@ekwoka/rust-ts/prelude';
import { AOCInput } from '../../utils';

export const partOne = (input: string) => {
  return (
    new AOCInput(input)
      .lines()
      .map(
        (line) =>
          line
            .matchAll(/\d+/g)
            .iter()
            .map((match) => Number(match[0]))
            .collect() as [low: number, high: number],
      )
      .sort((a, b) => a[0] - b[0])
      .window(2)
      .find(([a, b]) => a[1] + 1 < b[0])![0][1] + 1
  );
};
export const partTwo = (input: string, max: number) => {
  const ranges = new AOCInput(input)
    .lines()
    .map(
      (line) =>
        line
          .matchAll(/\d+/g)
          .iter()
          .map((match) => Number(match[0]))
          .collect() as [low: number, high: number],
    )
    .sort((a, b) => a[0] - b[0])
    .chain([[max + 1, max + 1]])
    .collect();
  return ranges
    .iter()
    .map(([_, n]) => n + 1)
    .filter((n) =>
      ranges.every(([low, high]) => Math.sign(n - low) === Math.sign(n - high)),
    )
    .map((n) => Math.max(0, (ranges.find(([low]) => low > n)?.[0] ?? n) - n))
    .sum();
};
