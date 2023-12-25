import { range, RustIterator } from '@ekwoka/rust-ts';
import { AOCInput } from '../../utils';

/**
 * --- Day 23: A Long Walk ---
 */
export const partOne = (input: AOCInput): number => {
  const pathSpaces = input
    .lines()
    .map((line) =>
      line
        .chars()
        .map((char) => (char === Space.Wall ? null : (char as Space)))
        .collect(),
    )
    .collect() as Space[][];
  const start = [pathSpaces[0].indexOf(Space.Path), 0] as Coords;
  const end = [
    pathSpaces[pathSpaces.length - 1].indexOf(Space.Path),
    pathSpaces.length - 1,
  ] as Coords;
  const cached = new Map<string, number>();
  const cacheWalk = (coords: Coords, dir: Direction): number => {
    const key = `${coords.join(',')}`;
    if (cached.has(key)) return cached.get(key);
    let nextStep = [coords, 0, dir] as [Coords, number, Direction];
    let stepCount = null;
    while (stepCount === null) {
      const [current, steps, dir] = nextStep;
      if (current[0] === end[0] && current[1] === end[1]) {
        stepCount = steps;
        continue;
      }
      const neighbors = getOffsetsExcept(reverseDirection(dir))
        .map<[Direction, Coords]>(([dir, offset]) => [
          dir,
          applyOffset(current, offset),
        ])
        .filter(([_, [x, y]]) => !!pathSpaces[y]?.[x])
        .collect();
      if (neighbors.length === 1) {
        nextStep = [neighbors[0][1], steps + 1, neighbors[0][0]] as const;
        continue;
      }
      stepCount =
        Math.max(
          ...neighbors
            .toIter()
            .filter(([dir, [x, y]]) => {
              const space = pathSpaces[y][x];
              return space === Space.Path || space === SlopeFromDirection(dir);
            })
            .map(([dir, coords]) => cacheWalk(coords, dir)),
        ) +
        steps +
        1;
    }
    cached.set(key, stepCount);
    return stepCount;
  };
  return cacheWalk(start, Direction.South);
};

export const partTwo = (input: AOCInput): number => {
  const pathSpaces = input
    .lines()
    .map((line) =>
      line
        .chars()
        .map((char) => (char === Space.Wall ? null : (char as Space)))
        .collect(),
    )
    .collect() as Space[][];
  const start = [pathSpaces[0].indexOf(Space.Path), 0] as Coords;
  const end = [
    pathSpaces[pathSpaces.length - 1].indexOf(Space.Path),
    pathSpaces.length - 1,
  ] as Coords;
  const walk = (coords: Coords, visited = new Set<string>()): number => {
    console.log('walking from', coords);
    let nextStep = [coords, 0] as [Coords, number];
    while (nextStep) {
      const [current, steps] = nextStep;
      visited.add(current.toString());
      if (current[0] === end[0] && current[1] === end[1]) return steps;
      const neighbors = getOffsetsExcept(0 as Direction)
        .inspect(console.log)
        .map<Coords>(([_, offset]) => applyOffset(current, offset))
        .inspect(console.log)
        .filter(([x, y]) => !!pathSpaces[y]?.[x])
        .inspect(console.log)
        .filter(([_, coords]) => !visited.has(coords.toString()))
        .inspect(console.log)
        .collect();
      if (neighbors.length === 1) {
        nextStep = [neighbors[0], steps + 1] as const;
        continue;
      }
      return (
        Math.max(
          ...neighbors
            .toIter()
            .map((coords) => walk(coords, new Set<string>(visited))),
        ) +
        steps +
        1
      );
    }
    return -1;
  };
  return walk(start);
};

enum Space {
  Path = '.',
  Wall = '#',
  SlopeNorth = '^',
  SlopeEast = '>',
  SlopeSouth = 'v',
  SlopeWest = '<',
}

enum Direction {
  North = 1 << 0,
  East = 1 << 1,
  South = 1 << 2,
  West = 1 << 3,
}

const SlopeFromDirection = (dir: Direction): Space => {
  switch (dir) {
    case Direction.North:
      return Space.SlopeNorth;
    case Direction.East:
      return Space.SlopeEast;
    case Direction.South:
      return Space.SlopeSouth;
    case Direction.West:
      return Space.SlopeWest;
  }
};

const getOffsetsExcept = (except: Direction) =>
  range(0, 3)
    .map((i) => 1 << i)
    .filter((dir) => dir !== except)
    .map<[Direction, Coords]>((dir) => [dir, getOffsetAt(dir)]) as RustIterator<
    [Direction, Coords]
  >;

const getOffsetAt = (dir: Direction): Coords =>
  [
    dir & Direction.East ? 1 : dir & Direction.West ? -1 : 0,
    dir & Direction.South ? 1 : dir & Direction.North ? -1 : 0,
  ] as Coords;

const applyOffset = (coords: Coords, offset: Coords): Coords =>
  [coords[0] + offset[0], coords[1] + offset[1]] as Coords;

type Coords = [x: number, y: number];

const reverseDirection = (dir: Direction): Direction =>
  ((dir >> 2) | (dir << 2)) & 0b1111;
