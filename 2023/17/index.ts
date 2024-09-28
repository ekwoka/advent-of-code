import type { AOCInput } from '../../utils';

/**
 * --- Day 17: ??? ---
 */
export const partOne = (input: AOCInput): number => {
  const grid: number[][] = input
    .lines()
    .map((line) => line.chars().map(Number).collect())
    .collect();
  const start: Coords = [0, 0];
  const end: Coords = [grid[0].length - 1, grid.length - 1];
  const queue: [
    coordinates: Coords,
    direction: Direction,
    loss: number,
    sinceTurn: number,
  ][] = [[start, Direction.East, 0, 0]];
  const visited = new Set<string>();
  const addToQueue = (
    coords: Coords,
    direction: Direction,
    previousloss: number,
    sinceTurn = 1,
  ) => {
    const [x, y] = coords;
    if (x < 0 || y < 0 || x >= grid[0].length || y >= grid.length) return;
    const key = `${coords}-${direction}-${sinceTurn}`;
    if (visited.has(key)) return;
    visited.add(key);
    const space = grid[y]?.[x];
    const loss = previousloss + space;
    const insertAt = queue.findIndex(([_, __, h]) => h < loss);
    if (insertAt === -1) queue.push([coords, direction, loss, sinceTurn]);
    else queue.splice(insertAt, 0, [coords, direction, loss, sinceTurn]);
  };
  const pathGrid = grid.map((row) => row.map(() => 0));
  while (queue.length) {
    const [[x, y], dir, loss, sinceTurn] = queue.pop();
    if (pathGrid[y][x] < loss) pathGrid[y][x] = loss;
    if (x === end[0] && y === end[1]) return loss;
    if (sinceTurn < 3)
      addToQueue(
        applyOffset([x, y], dirToOffset(dir)),
        dir,
        loss,
        sinceTurn + 1,
      );
    if (dir & Direction.NS) {
      addToQueue(
        applyOffset([x, y], dirToOffset(Direction.East)),
        Direction.East,
        loss,
      );
      addToQueue(
        applyOffset([x, y], dirToOffset(Direction.West)),
        Direction.West,
        loss,
      );
    }
    if (dir & Direction.EW) {
      addToQueue(
        applyOffset([x, y], dirToOffset(Direction.North)),
        Direction.North,
        loss,
      );
      addToQueue(
        applyOffset([x, y], dirToOffset(Direction.South)),
        Direction.South,
        loss,
      );
    }
  }
  return -1;
};

export const partTwo = (input: AOCInput): number => {
  const grid: number[][] = input
    .lines()
    .map((line) => line.chars().map(Number).collect())
    .collect();
  const start: Coords = [0, 0];
  const end: Coords = [grid[0].length - 1, grid.length - 1];
  const queue: [
    coordinates: Coords,
    direction: Direction,
    loss: number,
    sinceTurn: number,
  ][] = [[start, Direction.East, 0, 0]];
  const visited = new Set<string>();
  const addToQueue = (
    coords: Coords,
    direction: Direction,
    previousloss: number,
    sinceTurn = 1,
  ) => {
    const [x, y] = coords;
    if (x < 0 || y < 0 || x >= grid[0].length || y >= grid.length) return;
    const key = `${coords}-${direction}-${sinceTurn}`;
    if (visited.has(key)) return;
    visited.add(key);
    const space = grid[y]?.[x];
    const loss = previousloss + space;
    const insertAt = queue.findIndex(([_, __, h]) => h < loss);
    if (insertAt === -1) queue.push([coords, direction, loss, sinceTurn]);
    else queue.splice(insertAt, 0, [coords, direction, loss, sinceTurn]);
  };
  const pathGrid = grid.map((row) => row.map(() => 0));
  while (queue.length) {
    const [[x, y], dir, loss, sinceTurn] = queue.pop();
    if (pathGrid[y][x] < loss) pathGrid[y][x] = loss;
    if (x === end[0] && y === end[1]) return loss;
    if (sinceTurn < 10)
      addToQueue(
        applyOffset([x, y], dirToOffset(dir)),
        dir,
        loss,
        sinceTurn + 1,
      );
    if (sinceTurn >= 4)
      if (dir & Direction.NS) {
        addToQueue(
          applyOffset([x, y], dirToOffset(Direction.East)),
          Direction.East,
          loss,
        );
        addToQueue(
          applyOffset([x, y], dirToOffset(Direction.West)),
          Direction.West,
          loss,
        );
      } else if (dir & Direction.EW) {
        addToQueue(
          applyOffset([x, y], dirToOffset(Direction.North)),
          Direction.North,
          loss,
        );
        addToQueue(
          applyOffset([x, y], dirToOffset(Direction.South)),
          Direction.South,
          loss,
        );
      }
  }
  return -1;
};

enum Direction {
  North = 0b1,
  East = 0b10,
  South = 0b100,
  West = 0b1000,
  NS = North | South,
  EW = East | West,
}

const dirToOffset = (dir: Direction): Coords => {
  if (dir === Direction.North) return [0, -1];
  if (dir === Direction.East) return [1, 0];
  if (dir === Direction.South) return [0, 1];
  if (dir === Direction.West) return [-1, 0];
  return [0, 0];
};

type Coords = [x: number, y: number];

const applyOffset = ([x, y]: Coords, [ox, oy]: Coords): Coords => [
  x + ox,
  y + oy,
];
