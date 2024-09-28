import { type RustIterator, range } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

const { floor } = Math;

type Coords = [number, number];
enum Connections {
  North = 0b0001,
  East = 0b0010,
  South = 0b0100,
  West = 0b1000,
  Vertical = North | South,
  Horizontal = East | West,
  Start = Vertical | Horizontal,
  NorthEast = North | East,
  SouthEast = South | East,
  SouthWest = South | West,
  NorthWest = North | West,
  Ground = 0b0000,
}
/**
 * --- Day 10: Pipe Maze ---
 */
export const partOne = (input: AOCInput): number => {
  const grid = makeGrid(input);
  const start = getStartPosition(grid);
  const startDirection = ConnectionsToOffsets(Connections.Start)
    .map(([x, y, needed]) => [applyOffset(start, [x, y]), needed] as const)
    .filter(([[x, y], needed]) => Boolean(grid[y]?.[x] & needed))
    .map(([_, needed]) => flipDirection(needed))
    .nth(0);
  return (
    (range(0, input.length)
      .scan(walkPath(grid), [start, startDirection] as [Coords, Connections])
      .takeWhile(([pos]) => pos !== start.toString())
      .count() +
      1) /
    2
  );
};

export const partTwo = (input: AOCInput): number => {
  const grid = makeGrid(input);
  const start = getStartPosition(grid);
  const startConnections = ConnectionsToOffsets(Connections.Start)
    .map(([x, y, needed]) => [applyOffset(start, [x, y]), needed] as const)
    .filter(([[x, y], needed]) => Boolean(grid[y]?.[x] & needed))
    .map(([_, needed]) => flipDirection(needed))
    .collect();
  const path = range(0, input.length)
    .scan(walkPath(grid), [start, startConnections[0]] as [Coords, Connections])
    .takeWhile(([pos]) => pos !== start.toString())
    .fold(
      ...into(
        new Map<string, Connections>([
          [start.toString(), startConnections[0] | startConnections[1]],
        ]),
      ),
    );
  return range(0, grid.length - 1)
    .flatMap((y) => range(0, grid[0].length - 1).map((x) => [x, y].toString()))
    .map(path.get.bind(path))
    .filter(
      (dir?: number) => dir === undefined || Boolean(dir & Connections.North),
    )
    .scan((state, direction: number | undefined) => {
      if (direction === undefined) return state[0];
      const previous = state[0];
      const next = previous ^ (direction & Connections.North);
      state[0] = next;
      return 0;
    }, 0)
    .filter((dir) => Boolean(dir))
    .count();
};

const makeGrid = (input: AOCInput): Connections[][] =>
  input
    .lines()
    .filter((line) => line.length > 0)
    .map((line) => line.chars().map(connectionsFromChar).collect())
    .collect();

const charConnections = {
  '.': Connections.Ground,
  '|': Connections.Vertical,
  '-': Connections.Horizontal,
  S: Connections.Start,
  L: Connections.NorthEast,
  J: Connections.NorthWest,
  F: Connections.SouthEast,
  7: Connections.SouthWest,
} as const;

const connectionsFromChar = (char: string): Connections =>
  charConnections[char];

const getStartPosition = (grid: Connections[][]): Coords => {
  const offset = grid
    .toIter()
    .flatMap((row) => row.toIter())
    .findIndex((connections) => connections === Connections.Start);
  const x = offset % grid[0].length;
  const y = floor(offset / grid[0].length);
  return [x, y];
};

const SingleConnections = [
  Connections.North,
  Connections.East,
  Connections.South,
  Connections.West,
];
const SingleConnectionOffsets: Partial<
  Record<Connections, [number, number, Connections]>
> = {
  [Connections.North]: [0, -1, Connections.South],
  [Connections.East]: [1, 0, Connections.West],
  [Connections.South]: [0, 1, Connections.North],
  [Connections.West]: [-1, 0, Connections.East],
};

const ConnectionsToOffsets = (
  connections: Connections,
): RustIterator<[...Coords, Connections]> =>
  SingleConnections.toIter()
    .filter((connection) => Boolean(connections & connection))
    .map((connection) => SingleConnectionOffsets[connection]);

const applyOffset = ([x, y]: Coords, [ox, oy]: Coords): Coords => [
  x + ox,
  y + oy,
];

const flipDirection = (dir: Connections) =>
  Connections.SouthWest & dir ? dir >> 2 : dir << 2;

const walkPath = (grid: number[][]) => (state) => {
  const [ox, oy, dir] = SingleConnectionOffsets[state[0][1]];
  const position = applyOffset(state[0][0], [ox, oy]);
  const connections = grid[position[1]][position[0]];
  const direction = dir ^ (connections as Connections);
  state[0] = [position, direction];
  return [position.toString(), connections] as const;
};

const into = <
  T extends Set<unknown> | Map<unknown, unknown>,
  K = T extends Set<infer K>
    ? K
    : T extends Map<infer K, unknown>
      ? K
      : unknown,
  V = T extends Map<unknown, infer V> ? V : unknown,
>(
  collection: T,
) =>
  [
    collection instanceof Set
      ? (set: Set<K>, item: K) => set.add(item)
      : (map: Map<K, V>, item: [K, V]) => map.set(...item),
    collection,
  ] as [(coll: T, item: T extends Set<unknown> ? K : [K, V]) => T, T];
