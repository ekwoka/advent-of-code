import { RustIterator, r } from '@ekwoka/rust-ts';
import { AOCInput } from '../../utils';
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
  const [_, ...step] = history[0].toIter().scan((prev, curr) => {
    const diff = curr - prev[0];
    prev[0] = curr;
    return diff;
  }, 0);

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
