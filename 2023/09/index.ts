import { type RustIterator, r } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';
/**
 * --- Day 9: Mirage Maintenance ---
 */
export const partOne = (input: AOCInput): number => {
  return input
    .lines()
    .map((line) => line.words().map(Number).collect())
    .flatMap(mapHistorySequence)
    .map((sequence) => sequence.at(-1))
    .sum();
};

export const partTwo = (input: AOCInput): number => {
  return input
    .lines()
    .map((line) => line.words().map(Number).reverse().collect())
    .flatMap(mapHistorySequence)
    .map((sequence) => sequence.at(-1))
    .sum();
};

const reduceHistorySteps = (history: [number[]]): number[] => {
  const step = history[0]
    .toIter()
    .window(2)
    .map(([prev, curr]) => curr - prev)
    .collect();

  return (history[0] = step);
};

const mapHistorySequence = (sequence: number[]): RustIterator<number[]> => {
  return [sequence]
    .toIter()
    .chain(r`1..`.scan(reduceHistorySteps, sequence).takeWhile(notAllZeroes));
};

const notAllZeroes = (sequence: number[]): boolean => {
  return sequence.length && sequence.some((num) => num !== 0);
};
