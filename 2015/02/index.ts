import { RustIterator } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

/**
 * Just need to help Santa find the correct floor.
 * Here `(` means up and `)` means down.
 * We just get through all the instructions and find where
 * we end up.
 */
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

/**
 * Same rules, but we want to find which step leaves us at
 * floor -1.
 * So we can just iteratively accumulate the values and
 * stop when we reach -1.
 */
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
