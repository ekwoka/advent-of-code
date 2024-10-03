import type { AOCInput } from '../../utils';
import { Vec2 } from '../../utils/vec';

const DirectionVector = {
  '^': new Vec2(0, 1),
  '>': new Vec2(1, 0),
  v: new Vec2(0, -1),
  '<': new Vec2(-1, 0),
};

export const partOne = (input: AOCInput): number => {
  return (
    1 +
    input
      .chars()
      .map<Vec2>(
        (char) => DirectionVector[char as keyof typeof DirectionVector],
      )
      .scan(
        ([state], step) => {
          state[0] = state[0].add(step);
          const [pos, visited] = state;
          if (visited.has(pos.toString())) return null;
          visited.add(pos.toString());
          return true;
        },
        [Vec2.zero(), new Set<string>([Vec2.zero().toString()])] as [
          Vec2,
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
      .map<Vec2>(
        (char) => DirectionVector[char as keyof typeof DirectionVector],
      )
      .scan(
        ([state], step) => {
          state[state[3]] = state[state[3]].add(step);
          const pos = state[state[3]];
          const visited = state[2];
          state[3] ^= 1;
          if (visited.has(pos.toString())) return null;
          visited.add(pos.toString());
          return pos;
        },
        [
          Vec2.zero(),
          Vec2.zero(),
          new Set<string>([Vec2.zero().toString()]),
          0,
        ] as [santa: Vec2, robosanta: Vec2, Set<string>, step: 0 | 1],
      )
      .filter(Boolean)
      .count()
  );
};
