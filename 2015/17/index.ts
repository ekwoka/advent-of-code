import { range } from '@ekwoka/rust-ts';
import { AOCInput } from '../../utils';

/**
 * --- Day 17: No Such Thing as Too Much ---
 */
export const determineCombinations = (
  input: AOCInput,
  volume: number,
): number => {
  const jugs = input.lines().map(Number).sort().collect();
  return range(0, (2 << (jugs.length - 1)) - 1)
    .map<number>((mask) =>
      mask
        .toString(2)
        .padStart(jugs.length, '0')
        .split('')
        .toIter()
        .map<number>(Number)
        .zip<number>(jugs.toIter())
        .filter(([bit]) => Boolean(bit))
        .map<number>(([, jug]) => jug)
        .sum(),
    )
    .filter((sum) => sum === volume)
    .count();
};

export const fewestContainers = (input: AOCInput, volume: number): number => {
  const jugs = input.lines().map(Number).sort().collect();
  let min = 0;
  return range(0, (2 << (jugs.length - 1)) - 1)
    .map<string>((mask) => mask.toString(2))
    .map<[number, string]>((mask) => [
      mask.replaceAll('0', '').length,
      mask.padStart(jugs.length, '0'),
    ])
    .filter(([count]) => !min || count === min)
    .map<[number, number]>(([count, mask]) => [
      count,
      mask
        .split('')
        .toIter()
        .map<number>(Number)
        .zip<number>(jugs.toIter())
        .filter(([bit]) => Boolean(bit))
        .map<number>(([, jug]) => jug)
        .sum(),
    ])
    .filter(([, sum]) => sum === volume)
    .inspect(([count]) => (min = count))
    .count();
};
