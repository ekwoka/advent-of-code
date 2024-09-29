import type { AOCInput } from '../../utils';
import { Vec2 } from '../../utils/vec';

const Direction = {
  U: new Vec2(0, -1),
  D: new Vec2(0, 1),
  L: new Vec2(-1, 0),
  R: new Vec2(1, 0),
};
export const partOne = (input: AOCInput) => {
  return input
    .lines()
    .filter(Boolean)
    .map(
      (line) => (position: Vec2) =>
        line
          .chars()
          .map((char) => Direction[char])
          .reduce(
            (pos, dir) => pos.add(dir).clamp(Vec2.zero(), new Vec2(2, 2)),
            position,
          ),
    )
    .scan((state, steps) => {
      state[0] = steps(state[0]);
      return state[0];
    }, new Vec2(1, 1))
    .map((pos) => pos.y * 3 + pos.x + 1)
    .collect()
    .join('');
};
const keyPad = [
  [null, null, '1', null, null],
  [null, '2', '3', '4', null],
  ['5', '6', '7', '8', '9'],
  [null, 'A', 'B', 'C', null],
  [null, null, 'D', null, null],
];
export const partTwo = (input: AOCInput) => {
  const valid = new Set(
    keyPad
      .flatMap((row, y) => row.map((v, x) => v && [x, y].toString()))
      .filter(Boolean),
  );
  return input
    .lines()
    .filter(Boolean)
    .map(
      (line) => (position: Vec2) =>
        line
          .chars()
          .map((char) => Direction[char])
          .reduce((pos, dir) => {
            const next = pos.add(dir);
            if (valid.has(next.toString())) return next;
            return pos;
          }, position),
    )
    .scan((state, steps) => {
      state[0] = steps(state[0]);
      return state[0];
    }, new Vec2(0, 2))
    .map((pos) => keyPad[pos.y][pos.x])
    .collect()
    .join('');
};
