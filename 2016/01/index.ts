import type { AOCInput } from '../../utils';
import { Vec2 } from '../../utils/vec';
enum Turn {
  Right = 'R',
  Left = 'L',
}
enum Direction {
  North = 'N',
  East = 'E',
  South = 'S',
  West = 'W',
}
export const partOne = (input: AOCInput) => {
  return input
    .splitBy(',')
    .filter(Boolean)
    .map((instruction) => instruction.match(/\s?([RL])(\d+)/))
    .map(([_, direction, steps]) => [direction as Turn, Number(steps)] as const)
    .scan((state, [turn, steps]) => {
      if (state[0] === Direction.North)
        state[0] = turn === Turn.Right ? Direction.East : Direction.West;
      else if (state[0] === Direction.East)
        state[0] = turn === Turn.Right ? Direction.South : Direction.North;
      else if (state[0] === Direction.South)
        state[0] = turn === Turn.Right ? Direction.West : Direction.East;
      else if (state[0] === Direction.West)
        state[0] = turn === Turn.Right ? Direction.North : Direction.South;
      return [state[0], steps] as const;
    }, Direction.North)
    .map(([direction, steps]) => {
      if ([Direction.North, Direction.South].includes(direction))
        return (direction === Direction.North ? Vec2.Y : Vec2.NEG_Y).scale(
          steps,
        );
      return (direction === Direction.East ? Vec2.X : Vec2.NEG_X).scale(steps);
    })
    .reduce(Vec2.add)
    .toIter()
    .map(Math.abs)
    .sum();
};
export const partTwo = (input: AOCInput) => {
  return input
    .splitBy(',')
    .filter(Boolean)
    .map((instruction) => instruction.match(/\s?([RL])(\d+)/))
    .map(([_, direction, steps]) => [direction as Turn, Number(steps)] as const)
    .scan((state, [turn, steps]) => {
      if (state[0] === Direction.North)
        state[0] = turn === Turn.Right ? Direction.East : Direction.West;
      else if (state[0] === Direction.East)
        state[0] = turn === Turn.Right ? Direction.South : Direction.North;
      else if (state[0] === Direction.South)
        state[0] = turn === Turn.Right ? Direction.West : Direction.East;
      else if (state[0] === Direction.West)
        state[0] = turn === Turn.Right ? Direction.North : Direction.South;
      return [state[0], steps] as const;
    }, Direction.North)
    .map(([direction, steps]) => {
      if ([Direction.North, Direction.South].includes(direction))
        return (direction === Direction.North ? Vec2.Y : Vec2.NEG_Y).scale(
          steps,
        );
      return (direction === Direction.East ? Vec2.X : Vec2.NEG_X).scale(steps);
    })
    .scan((state, vec) => {
      const start = state[0];
      const target = state[0].add(vec);
      state[0] = target;
      return start.between(target, false, true);
    }, Vec2.ZERO)
    .flat()
    .scan(([visited], vec) => {
      if (visited.has(vec.toString())) return vec;
      visited.add(vec.toString());
      return null;
    }, new Set<string>())
    .filter(Boolean)
    .nth(0)
    .toIter()
    .map(Math.abs)
    .sum();
};
