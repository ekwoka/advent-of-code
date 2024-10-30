import '@ekwoka/rust-ts/prelude';
import { AOCInput } from '../../utils';
import { Vec2 } from '../../utils/vec';

const neighbors = [Vec2.X, Vec2.Y, Vec2.NEG_X, Vec2.NEG_Y];
export const partOne = (input: string, returnToStart = false) => {
  const destinations: Vec2[] = [];
  const path = new Set<string>();
  new AOCInput(input)
    .lines()
    .enumerate()
    .flatMap(([y, row]) =>
      row
        .chars()
        .enumerate()
        .filter(([_, type]) => type !== '#')
        .map(([x, type]) => [new Vec2(x, y), type] as const),
    )
    .forEach(([vec, type]) => {
      path.add(vec.toString());
      if (type !== '.') destinations[Number(type)] = vec;
    });
  const distances = destinations
    .iter()
    .map((vec) => [vec, new Map()] as const)
    .into(Map);
  destinations.forEach((start, idx) => {
    destinations.slice(idx + 1).forEach((end) => {
      const visited = new Set<string>(start.toString());
      const queue: [steps: number, current: Vec2][] = [[0, start]];
      while (queue.length) {
        const [steps, current] = queue.shift()!;
        if (current.eq(end)) {
          distances.get(start)!.set(end, steps);
          distances.get(end)!.set(start, steps);
        } else
          neighbors
            .iter()
            .map((o) => current.add(o))
            .filter((vec) => path.has(vec.toString()))
            .filter((vec) => !visited.has(vec.toString()))
            .inspect((vec) => visited.add(vec.toString()))
            .forEach((vec) => queue.push([steps + 1, vec]));
      }
    });
  });

  let min = Number.POSITIVE_INFINITY;
  const queue: [steps: number, current: Vec2, remaining: Vec2[]][] = [
    [0, destinations[0], destinations.slice(1)],
  ];
  while (queue.length) {
    const [steps, current, remaining] = queue.pop()!;
    if (!remaining.length)
      min = Math.min(
        steps +
          (returnToStart ? distances.get(current)!.get(destinations[0]) : 0),
        min,
      );
    remaining.forEach((next) => {
      queue.push([
        steps + distances.get(current)?.get(next),
        next,
        remaining.filter((vec) => vec !== next),
      ]);
    });
  }
  return min;
};
