import '@ekwoka/rust-ts/prelude';
import { r } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

const regex = /(\d+) positions.*?position (\d+)/;
export const partOne = (input: AOCInput) => {
  const discs = input
    .lines()
    .filter(Boolean)
    .map((line) => line.match(regex)!.slice(1).map(Number))
    .collect();
  return r`0..`.find((time) =>
    discs.every(
      ([positions, start], i) => (start + time + i + 1) % positions === 0,
    ),
  );
};
export const partTwo = (input: AOCInput) => {
  const discs = input
    .lines()
    .filter(Boolean)
    .map((line) => line.match(regex)!.slice(1).map(Number))
    .collect();
  discs.push([11, 0]);
  return r`0..`.find((time) =>
    discs.every(
      ([positions, start], i) => (start + time + i + 1) % positions === 0,
    ),
  );
};
