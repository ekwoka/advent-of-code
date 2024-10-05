import '@ekwoka/rust-ts/prelude';
import { range } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

const decoder = new TextEncoder();
export const partOne = (input: AOCInput) => {
  const counts = input
    .lines()
    .filter(Boolean)
    .map((line) => line.valueOf())
    .map(decoder.encode.bind(decoder))
    .fold(
      (counts, line) => {
        line.forEach((char, i) => counts[i * 26 + char - 97]++);
        return counts;
      },
      new Uint8Array(26 * 8),
    );
  return range(0, input.lines().nth(0)!.length - 1)
    .map((i) => counts.subarray(i * 26, (i + 1) * 26))
    .map((count) => {
      const most = [0, 0];
      count.forEach((count, i) => {
        if (count <= most[0]) return;
        most[0] = count;
        most[1] = i;
      });
      return most[1] + 97;
    })
    .map(String.fromCharCode)
    .sum();
};
export const partTwo = (input: AOCInput) => {
  const counts = input
    .lines()
    .filter(Boolean)
    .map((line) => line.valueOf())
    .map(decoder.encode.bind(decoder))
    .fold(
      (counts, line) => {
        line.forEach((char, i) => counts[i * 26 + char - 97]++);
        return counts;
      },
      new Uint8Array(26 * 8),
    );
  return range(0, input.lines().nth(0)!.length - 1)
    .map((i) => counts.subarray(i * 26, (i + 1) * 26))
    .map((count) => {
      const most = [Number.POSITIVE_INFINITY, 0];
      count.forEach((count, i) => {
        if (count === 0 || count >= most[0]) return;
        most[0] = count;
        most[1] = i;
      });
      return most[1] + 97;
    })
    .map(String.fromCharCode)
    .sum();
};
