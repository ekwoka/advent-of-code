import { type RustIterator, range } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

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
  const junctionDistances = {} as Record<string, Record<string, number>>;
  const visitedStartPoints = new Set<string>();
  const walkSection = (
    junctionStart: string,
    coords: Coords,
    dir: Direction,
  ): number => {
    if (visitedStartPoints.has(coords.toString())) return;
    visitedStartPoints.add(coords.toString());
    junctionDistances[junctionStart] ??= {};
    let nextStep = [coords, 1, dir] as [Coords, steps: number, dir: Direction];
    while (nextStep) {
      const [current, steps, dir] = nextStep;
      if (current[0] === end[0] && current[1] === end[1]) {
        junctionDistances[junctionStart][current.toString()] = steps;
        junctionDistances[current.toString()] ??= {};
        return;
      }
      const neighbors = getOffsetsExcept(reverseDirection(dir))
        .map<[Direction, Coords]>(([dir, offset]) => [
          dir,
          applyOffset(current, offset),
        ])
        .filter(([_, [x, y]]) => !!pathSpaces[y]?.[x])
        .collect();
      if (neighbors.length === 1) {
        const [dir, coords] = neighbors[0];
        nextStep = [coords, steps + 1, dir] as const;
        continue;
      }
      junctionDistances[junctionStart][current.toString()] = steps;
      (junctionDistances[current.toString()] ??= {})[junctionStart] = steps;
      if (
        Object.keys(junctionDistances[current.toString()]).length ===
        neighbors.length
      )
        return;
      neighbors
        .toIter()
        .forEach(([dir, coords]) =>
          walkSection(current.toString(), coords, dir),
        );
      return;
    }
  };
  walkSection(start.toString(), [1, 1], Direction.South);
  const branchNode = (node: bigint, steps: number, visited = 0b0n): number =>
    node === nodeBitMap[end.toString()]
      ? steps
      : (bitJunctions
          .get(node)
          .toIter()
          .filter(([nextNode]) => !(visited & nextNode))
          .map(([nextNode, distance]) =>
            branchNode(nextNode, steps + distance, visited | nextNode),
          )
          .max() ?? 0);
  const nodeBitMap = Object.keys(junctionDistances)
    .toIter()
    .enumerate()
    .map(([i, node]) => [node, 1n << BigInt(i)] as const)
    .fold(
      (acc, [node, bit]) => ((acc[node] = bit), acc),
      {} as Record<string, bigint>,
    );
  const bitJunctions = Object.entries(junctionDistances)
    .toIter()
    .map<[bigint, [bigint, number][]]>(([k, v]) => [
      nodeBitMap[k],
      Object.entries(v).map<[bigint, number]>(([k, v]) => [nodeBitMap[k], v]),
    ])
    .fold(
      (acc, [k, v]) => acc.set(k, v),
      new Map<bigint, [bigint, number][]>(),
    );
  return branchNode(nodeBitMap[start.toString()], 0);
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
