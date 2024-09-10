import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput): number => {
  return (
    1 +
    input
      .chars()
      .map((char) => {
        switch (char) {
          case '^':
            return [0, 1];
          case '>':
            return [1, 0];
          case 'v':
            return [0, -1];
          case '<':
            return [-1, 0];
          default:
            return [0, 0];
        }
      })
      .scan(
        ([[pos, visited]], val) => {
          pos[0] += val[0];
          pos[1] += val[1];
          if (visited.has(`${pos[0]},${pos[1]}`)) return null;
          visited.add(`${pos[0]},${pos[1]}`);
          return true;
        },
        [[0, 0], new Set<string>(['0,0'])] as [
          [x: number, y: number],
          Set<string>,
        ],
      )
      .filter(Boolean)
      .count()
  );
};

export const partTwo = (input: AOCInput): number => {
  return (
    1 +
    input
      .chars()
      .map((char) => {
        switch (char) {
          case '^':
            return [0, 1];
          case '>':
            return [1, 0];
          case 'v':
            return [0, -1];
          case '<':
            return [-1, 0];
          default:
            return [0, 0];
        }
      })
      .scan(
        ([state], val) => {
          const pos = state[state[3]];
          state[3] ^= 1;
          const visited = state[2];
          pos[0] += val[0];
          pos[1] += val[1];
          if (visited.has(`${pos[0]},${pos[1]}`)) return null;
          visited.add(`${pos[0]},${pos[1]}`);
          return pos;
        },
        [[0, 0], [0, 0], new Set<string>(['0,0']), 0] as [
          santa: [x: number, y: number],
          robosanta: [x: number, y: number],
          Set<string>,
          step: 0 | 1,
        ],
      )
      .filter(Boolean)
      .count()
  );
};
