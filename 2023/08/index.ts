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
  return (
    instructions
      .scan(stepThrough(nodes), 'AAA')
      .takeWhile(endsWith('Z', false))
      .count() + 1
  );
};

export const partTwo = (input: AOCInput): number => {
  const lines = input.lines().filter((line) => line.length > 0);
  const instructions = (lines.next().value as AOCInput)
    .chars()
    .map(DirectionFromChar)
    .collect();
  const nodes = lines
    .map((line) => line.match(nodeRegex))
    .fold(
      (acc, { groups: { ID, L, R } }) => Object.assign(acc, { [ID]: [L, R] }),
      {} as Record<string, [string, string]>,
    );
  return Object.keys(nodes)
    .toIter()
    .filter(endsWith('A'))
    .map(
      (start) =>
        instructions
          .toIter()
          .cycle()
          .scan(stepThrough(nodes), start)
          .takeWhile(endsWith('Z', false))
          .count() + 1,
    )
    .reduce(lowestCommonMultiple);
};
const stepThrough =
  (nodes: Record<string, [string, string]>) =>
  (state: [string], dir: Direction): string => {
    state[0] = nodes[state[0]][dir];
    return state[0];
  };
const lowestCommonMultiple = (lcm: number, step: number): number =>
  (lcm * step) / greatestCommonDivisor(lcm, step);
const greatestCommonDivisor = (a: number, b: number): number => {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
};

const endsWith =
  (str: string, matches = true) =>
  (s: string) =>
    s.endsWith(str) === matches;

enum Direction {
  Left = 0,
  Right = 1,
}

const DirectionFromChar = (ch: string): Direction => Number(ch === 'R');
