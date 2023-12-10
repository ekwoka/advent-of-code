import { RustIterator, range } from '@ekwoka/rust-ts';
import { AOCInput } from '../../utils';
/**
 * --- Day 10: Pipe Maze ---
 */
export const partOne = (input: AOCInput): number => {
  const grid = input
    .lines()
    .filter((line) => line.length > 0)
    .map((line) => line.chars().map(ConnectionsFromChar).collect())
    .collect();
  const start = getStartPosition(grid);
  const stack = [[start, Connections.Start, 0]] as [
    Coords,
    Connections,
    number,
  ][];
  const visited = new Set<string>();
  while (stack.length) {
    const [here, connections, steps] = stack.pop()!;
    if (here[0] === start[0] && here[1] === start[1] && steps)
      return Math.ceil(steps / 2);
    if (connections !== Connections.Start) visited.add(here.toString());
    ConnectionsToOffsets(connections)
      .map(([x, y, neededconnection]) => [
        here[0] + x,
        here[1] + y,
        grid[here[1] + y]?.[here[0] + x],
        neededconnection,
      ])
      .filter(([_, __, connections, neededconnection]) =>
        Boolean(connections & neededconnection),
      )
      .filter(([x, y]) => !visited.has([x, y].toString()))
      .forEach(([x, y, connections, neededconnection]) =>
        stack.push([[x, y], connections ^ neededconnection, steps + 1]),
      );
  }
  grid.forEach((row, y) =>
    console.log(
      row.map((c, x) => (visited.has([x, y].toString()) ? 'X' : '.')).join(''),
    ),
  );
  return 0;
};

const logWith = (prefix: string) => (v) => console.log(prefix, v);

type Coords = [number, number];

const getStartPosition = (grid: Connections[][]): Coords => {
  const offset = grid
    .toIter()
    .flatMap((row) => row.toIter())
    .findIndex((connections) => connections === Connections.Start);
  const x = offset % grid[0].length;
  const y = Math.floor(offset / grid[0].length);
  return [x, y];
};

export const partTwo = (input: AOCInput): number => {
  const grid = input
    .lines()
    .filter((line) => line.length > 0)
    .map((line) => line.chars().map(ConnectionsFromChar).collect())
    .collect();
  console.log(grid);
  const start = getStartPosition(grid);
  const stack = [[start, Connections.Start, 0]] as [
    Coords,
    Connections,
    number,
  ][];
  const visited = new Set<string>();
  const PathConnections = new Map<string, [Coords, Connections]>();
  while (stack.length) {
    const [here, connections, steps] = stack.pop()!;
    console.log('checking position', here, connections, steps);
    if (here[0] === start[0] && here[1] === start[1] && steps) break;
    if (connections !== Connections.Start) visited.add(here.toString());
    ConnectionsToOffsets(connections)
      .inspect(logWith('offset: '))
      .map(([x, y, neededconnection]) => [
        here[0] + x,
        here[1] + y,
        grid[here[1] + y]?.[here[0] + x],
        neededconnection,
      ])
      .inspect(logWith('new position: '))
      .filter(([_, __, connections, neededconnection]) =>
        Boolean(connections & neededconnection),
      )
      .filter(([x, y]) => !visited.has([x, y].toString()))
      .inspect(logWith('valid: '))
      .forEach(([x, y, connections, neededconnection]) => {
        PathConnections.set([x, y].toString(), [here, neededconnection]);
        stack.push([[x, y], connections ^ neededconnection, steps + 1]);
      });
  }
  grid.forEach((row, y) =>
    console.log(
      row.map((c, x) => (visited.has([x, y].toString()) ? 'X' : '.')).join(''),
    ),
  );
  const [path, fillStack] = walkPath(PathConnections, start).fold(
    (acc, [next, dir]) => {
      acc[0].add(next.toString());
      SingleConnectionOffsets[dir << 1 || Connections.North] &&
        acc[1].add(
          applyOffset(
            next,
            SingleConnectionOffsets[dir >> 1 || Connections.West],
          ).toString(),
        );
      return acc;
    },
    [new Set<string>([start.toString()]), new Set<string>()] as const,
  );
  console.log(path);
  Array.from({ length: grid.length }, (_, y) =>
    Array.from(
      { length: y === 0 || y === grid.length - 1 ? grid[0].length : 2 },
      (_, x) =>
        [
          y === 0 || y === grid.length - 1 ? x : x * (grid[0].length - 1),
          y,
        ] as Coords,
    ),
  )
    .flat()
    .filter(([x, y]) => !path.has([x, y].toString()))
    .forEach((next) => fillStack.add(next.toString()));
  path.forEach((next) => fillStack.delete(next.toString()));
  const fillVisited = new Set<string>([...path, ...fillStack]);
  const fillStack2 = [...fillStack].map((s) => s.split(',').map(Number));
  while (fillStack2.length) {
    const next = fillStack2.pop()!;
    console.log('filling', next);
    fillVisited.add(next.toString());
    fillOffsets
      .toIter()
      .map(([x, y]) => [next[0] + x, next[1] + y] as Coords)
      .filter(
        ([x, y]) => x >= 0 && y >= 0 && x < grid[0].length && y < grid.length,
      )
      .filter(([x, y]) => !fillVisited.has([x, y].toString()))
      .forEach((next) => {
        fillVisited.add(next.toString());
        fillStack2.push(next);
      });
  }
  grid.forEach((row, y) =>
    console.log(
      row
        .map((c, x) =>
          fillVisited.has([x, y].toString())
            ? path.has([x, y].toString())
              ? 'X'
              : '0'
            : '.',
        )
        .join(''),
    ),
  );
  console.log(fillVisited.size);
  return (
    grid
      .toIter()
      .flatMap((row) => row.toIter())
      .count() - fillVisited.size
  );
};

const fillOffsets: Coords[] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const walkPath = (paths: Map<string, [Coords, Connections]>, start: Coords) => {
  return range(0, paths.size).scan((last) => {
    const next = paths.get(last[0].toString());
    last[0] = next[0];
    return next;
  }, start);
};

const ConnectionsFromChar = (char: string): Connections => {
  switch (char) {
    case '.':
      return Connections.Ground;
    case '|':
      return Connections.Vertical;
    case '-':
      return Connections.Horizontal;
    case 'S':
      return Connections.Start;
    case 'L':
      return Connections.NorthEast;
    case 'J':
      return Connections.NorthWest;
    case 'F':
      return Connections.SouthEast;
    case '7':
      return Connections.SouthWest;
    default:
      return Connections.Ground;
  }
};

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

const SingleConnections = [
  Connections.North,
  Connections.East,
  Connections.South,
  Connections.West,
];
const SingleConnectionOffsets = {
  [Connections.North]: [0, -1, Connections.South],
  [Connections.East]: [1, 0, Connections.West],
  [Connections.South]: [0, 1, Connections.North],
  [Connections.West]: [-1, 0, Connections.East],
};

const applyOffset = ([x, y]: Coords, [ox, oy]: Coords): Coords => [
  x + ox,
  y + oy,
];

const ConnectionsToOffsets = (
  connections: Connections,
): RustIterator<[...Coords, Connections]> =>
  SingleConnections.toIter()
    .filter((connection) => Boolean(connections & connection))
    .map((connection) => SingleConnectionOffsets[connection]);
