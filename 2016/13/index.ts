import '@ekwoka/rust-ts/prelude';
import type { AOCInput } from '../../utils';
import { Vec2 } from '../../utils/vec';

const neighbors = [Vec2.X, Vec2.Y, Vec2.NEG_X, Vec2.NEG_Y];
const isNotWall = (designer: number) => {
  const knownWalls = new Set<string>();
  return (pos: Vec2) => {
    if (knownWalls.has(pos.toString())) return false;
    const { x, y } = pos;
    const num = x * x + 3 * x + 2 * x * y + y + y * y + designer;
    const isWall =
      num
        .toString(2)
        .iter()
        .filter((ch) => ch === '1')
        .count() %
        2 ===
      1;
    if (isWall) knownWalls.add(pos.toString());
    return !isWall;
  };
};
export const partOne = (input: AOCInput, x: number, y: number) => {
  const target = new Vec2(x, y);
  const queue: [number, Vec2][] = [[0, Vec2.ONE]];
  const visited = new Map<string, number>();
  const addToQueue = (steps: number, pos: Vec2) => {
    if (visited.has(pos.toString()) && visited.get(pos.toString())! <= steps)
      return;
    const distance = pos.distance(target);
    const insertAt = queue.findIndex(
      ([s, other]) => other.distance(target) > distance && s > steps,
    );
    if (insertAt === -1) queue.push([steps, pos]);
    else queue.splice(insertAt, 0, [steps, pos]);
  };
  while (queue.length) {
    const [steps, pos] = queue.shift()!;
    if (pos.eq(target)) return steps;
    if (visited.get(pos.toString()) ?? Number.POSITIVE_INFINITY > steps)
      visited.set(pos.toString(), steps);
    neighbors
      .iter()
      .map((n) => pos.add(n))
      .filter(isNotWall(Number(input.valueOf())))
      .forEach((pos) => addToQueue(steps + 1, pos));
  }
  return 0;
};
export const partTwo = (input: AOCInput) => {
  const queue: [number, Vec2][] = [[0, Vec2.ONE]];
  const visited = new Map<string, number>();
  const addToQueue = (steps: number, pos: Vec2) => {
    if (pos.x < 0 || pos.y < 0) return;
    if (visited.has(pos.toString()) && visited.get(pos.toString())! <= steps)
      return;
    queue.push([steps, pos]);
  };
  while (queue.length) {
    const [steps, pos] = queue.shift()!;
    visited.set(pos.toString(), steps);
    if (steps < 50)
      neighbors
        .iter()
        .map((n) => pos.add(n))
        .filter(isNotWall(Number(input.valueOf())))
        .forEach((pos) => addToQueue(steps + 1, pos));
  }

  return visited.size;
};
