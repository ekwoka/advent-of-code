import { RustIterator } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput): number => {
  return (
    (
      input
        .lines()
        .map(
          (line) =>
            line.splitBy('x').filter(Boolean).map(Number).collect() as [
              l: number,
              w: number,
              h: number,
            ],
        ) as RustIterator<[number, number, number]>
    ).map(([l, w, h]) => [l * w, w * h, h * l]) as RustIterator<
      [number, number, number]
    >
  )
    .flatMap((sideAreas) => [
      ...sideAreas.map((area) => area * 2),
      Math.min(...sideAreas),
    ])
    .sum();
};

export const partTwo = (input: AOCInput): number => {
  return input
    .lines()
    .filter(Boolean)
    .map(
      (line) =>
        line.splitBy('x').filter(Boolean).map(Number).collect() as [
          l: number,
          w: number,
          h: number,
        ],
    )
    .flatMap(([l, w, h]) => [
      Math.min((l + w) * 2, (w + h) * 2, (h + l) * 2),
      l * w * h,
    ])
    .sum();
};
