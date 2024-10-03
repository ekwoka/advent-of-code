import '@ekwoka/rust-ts/prelude';
import type { AOCInput } from '../../utils';

const calculateChecksum = (str: string) =>
  Object.entries(
    Object.groupBy(
      str.iter().filter((ch) => ch !== '-'),
      (ch) => ch,
    ),
  )
    .iter()
    .map(([ch, chs]) => [ch, chs!.length] as const)
    .sort(([cha, a], [chb, b]) => (b === a ? cha.localeCompare(chb) : b - a))
    .map<string>(([ch]) => ch)
    .take(5)
    .sum();
export const partOne = (input: AOCInput) => {
  return input
    .lines()
    .filter(Boolean)
    .map((line) => line.match(/(.*)-(\d+)\[(\w+)\]/)!.slice(1))
    .filter(([name, _, check]) => calculateChecksum(name) === check)
    .map<number>((line) => Number(line[1]))
    .sum();
};
const target = 'north pole objects'.split(' ');
const min = 'a'.charCodeAt(0);
const max = 'z'.charCodeAt(0) + 1;
const moveForward = (str: string, steps: number) =>
  str
    .iter()
    .map((ch) =>
      ch === '-'
        ? ' '
        : String.fromCharCode(
            ((ch.charCodeAt(0) - min + steps) % (max - min)) + min,
          ),
    )
    .sum();
export const partTwo = (input: AOCInput) => {
  return input
    .lines()
    .filter(Boolean)
    .map((line) => line.match(/(.*)-(\d+)\[(\w+)\]/)!.slice(1))
    .filter(([name, _, check]) => calculateChecksum(name) === check)
    .map(([name, id]) => [moveForward(name, Number(id)), Number(id)] as const)
    .filter(([name]) => name.includes('north') && name.includes('pole'))
    .map(([_, id]) => id)
    .nth(0);
};
