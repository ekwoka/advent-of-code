import { RustIterator } from '@ekwoka/rust-ts';
import { AOCInput } from '../../utils';
/**
 * --- Day 8: Haunted Wasteland ---
 */

const nodeRegex = /(?<ID>\S{3}) = \((?<L>\S{3}), (?<R>\S{3})\)/;

export const partOne = (input: AOCInput): number => {
  const lines = input.lines().filter((line) => line.length > 0);
  const instructions = (lines.next().value as AOCInput)
    .chars()
    .map(DirectionFromChar)
    .cycle();
  const nodes = lines
    .map((line) => line.match(nodeRegex))
    .fold(
      (acc, { groups: { ID, L, R } }) => Object.assign(acc, { [ID]: [L, R] }),
      {} as Record<string, [string, string]>,
    );
  return instructions
    .enumerate()
    .scan((state, [idx, dir]) => {
      state[0] = nodes[state[0]][dir];
      return [idx + 1, state[0]] as [number, string];
    }, 'AAA')
    .find((location) => location[1] === 'ZZZ')[0];
};

export const partTwo = (input: AOCInput): number => {
  const lines = input.lines().filter((line) => line.length > 0);
  const instructions = (lines.next().value as AOCInput)
    .chars()
    .map(DirectionFromChar)
    .cycle();
  const nodes = lines
    .map((line) => line.match(nodeRegex))
    .fold(
      (acc, { groups: { ID, L, R } }) => Object.assign(acc, { [ID]: [L, R] }),
      {} as Record<string, [string, string]>,
    );
  const starts = Object.keys(nodes)
    .toIter()
    .filter(endsWith('A'))
    .map((room) => room)
    .collect();
  return new RustIterator(
    LoopingZipTransformer(
      starts,
      instructions,
      (room: string | number, dir, loops) => {
        if (typeof room === 'number') return 0;
        if (room.endsWith('Z')) return loops;
        return nodes[room][dir];
      },
    ),
  )
    .filter((steps): steps is number => steps && typeof steps === 'number')
    .map(Number)
    .take(starts.length)
    .reduce((lcm, step) => (lcm * step) / greatestCommonDivisor(lcm, step));
};

const greatestCommonDivisor = (a: number, b: number): number => {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
};

const endsWith = (str: string) => (s: string) => s.endsWith(str);

enum Direction {
  Left = 0,
  Right = 1,
}

const DirectionFromChar = (ch: string): Direction => Number(ch === 'R');

const LoopingZipTransformer = function* <T, D>(
  looped: Iterable<T>,
  zipped: Iterable<D>,
  fn: (orig: T, other: D, loops: number) => T,
): Generator<T, void, undefined> {
  let loops = 0;
  const buff = [...looped];
  for (const z of zipped) {
    for (let i = 0; i < buff.length; i++)
      yield (buff[i] = fn(buff[i], z, loops));
    loops++;
  }
};
