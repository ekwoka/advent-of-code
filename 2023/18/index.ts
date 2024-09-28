import { type RustIterator, range } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

/**
 * --- Day 18: ??? ---
 */
export const partOne = (input: AOCInput): number => {
  const map = input
    .lines()
    .map((line) => {
      const [dir, length] = line.words();
      return [dirFromChar(dir.toString()), Number(length)];
    })
    .scan(
      (state, [dir, length]): RustIterator<Coords> => {
        const [x, y] = state[0];
        const offset = dirToOffset(dir);
        const touched = range(0, length).map(
          (i) => [x + offset[0] * i, y + offset[1] * i] as Coords,
        );
        state[0] = [x + offset[0] * length, y + offset[1] * length] as Coords;
        return touched;
      },
      [0, 0] as Coords,
    )
    .flat<Coords>()
    .fold((map, [x, y]) => {
      (map[y] ??= [])[x] = '#';
      return map;
    }, [] as string[][]);

  const [minX, maxX] = Object.values(map)
    .toIter()
    .flatMap((row) => Object.keys(row))
    .map(Number)
    .fold(
      ([min, max], x) => [Math.min(min, x), Math.max(max, x)],
      [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
    );
  const adjustedMap = Object.keys(map)
    .toIter()
    .map(Number)
    .sort()
    .map((y) =>
      range(minX, maxX)
        .map((x) => map[y][x])
        .collect(),
    )
    .collect();

  const firstInside = adjustedMap
    .toIter()
    .enumerate()
    .flatMap(([y, row]) =>
      row
        .toIter()
        .enumerate()
        .map(([x, cell]) => [x, y, cell]),
    )
    .filter(([_, __, cell]) => cell === '#')
    .map(([x, y]) => [x + 1, y + 1] as Coords)
    .nth(0);
  const stack: Coords[] = [firstInside];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (
      adjustedMap[y]?.[x] === '#' ||
      !(y in adjustedMap) ||
      !(x in adjustedMap[y])
    )
      continue;
    adjustedMap[y][x] = '#';
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return adjustedMap
    .toIter()
    .flat()
    .filter((cell) => cell === '#')
    .count();
};

const markerChars = ['#', '(', ')'];

export const partTwo = (input: AOCInput): number => {
  const map = input
    .lines()
    .take(2)
    .map((line) => {
      const hex = line
        .words()
        .last()
        .chars()
        .filter((c) => !markerChars.includes(c))
        .collect();
      const dir = (1 << Number(hex.pop())) as Direction;
      const length = Number.parseInt(hex.join(''), 16);
      return [dir, length];
    })
    .scan(
      (state, [dir, length]): RustIterator<Coords> => {
        const [x, y] = state[0];
        const offset = dirToOffset(dir);
        const touched = range(0, length).map(
          (i) => [x + offset[0] * i, y + offset[1] * i] as Coords,
        );
        state[0] = [x + offset[0] * length, y + offset[1] * length] as Coords;
        return touched;
      },
      [0, 0] as Coords,
    )
    .flat<Coords>()
    .collect();
  const allcoords = map
    .toIter()
    .fold((set, coords) => set.add(coords.join('-')), new Set<string>());

  return map
    .toIter()
    .sort(([x, y], [oX, oY]) => y - oY || x - oX)
    .filter(
      (coords) =>
        allcoords.has(coords.join('-')) &&
        allcoords.has(applyOffset(coords, [0, -1])),
    )
    .scan(
      (state, coords) => {
        if (state[0]) {
          const count = coords[0] - state[0][0];
          state[0] === null;
          return count;
        }
        state[0] = coords;
        return 0;
      },
      null as null | Coords,
    )
    .sum();
};

enum Direction {
  North = 1 << 0,
  South = 1 << 1,
  East = 1 << 2,
  West = 1 << 3,
}

const dirFromChar = (char: string): Direction => {
  if (char === 'U') return Direction.North;
  if (char === 'D') return Direction.South;
  if (char === 'L') return Direction.West;
  if (char === 'R') return Direction.East;
  return null;
};

type Coords = readonly [x: number, y: number];

const dirToOffset = (dir: Direction): Coords => {
  if (dir === Direction.North) return [0, -1];
  if (dir === Direction.East) return [1, 0];
  if (dir === Direction.South) return [0, 1];
  if (dir === Direction.West) return [-1, 0];
  return [0, 0];
};

const applyOffset = ([x, y]: Coords, [ox, oy]: Coords): Coords => [
  x + ox,
  y + oy,
];
