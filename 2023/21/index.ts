import type { AOCInput } from '../../utils';

/**
 * --- Day 21: ??? ---
 * Got stuck here a while because my step counter would
 * stop tracking once it was on the edge of the map,
 * instead of BEYOND the edge of the map
 */
export const partOne = (input: AOCInput, steps: number): number => {
  const grid = input
    .lines()
    .enumerate()
    .flatMap(([y, line]) =>
      line
        .chars()
        .enumerate()
        .map(([x, char]) => [[x, y], char] as [Coords, string]),
    );
  const rocks = new Set<string>();
  let start: Coords = null;
  grid
    .filter(([_, char]) => char !== '.')
    .forEach(([coords, char]) => {
      if (char === 'S') start = coords;
      else rocks.add(coords.join(','));
    });

  const mapSize = input
    .lines()
    .map((line) => line.chars().count())
    .count();

  const counter = makeCounter(rocks, mapSize);
  return counter(start, steps);
};
export const partTwo = (input: AOCInput, steps: number): number => {
  const rocks = input
    .lines()
    .enumerate()
    .flatMap(([y, line]) =>
      line
        .chars()
        .enumerate()
        .map(([x, char]) => [[x, y], char] as [Coords, string]),
    )
    .filter(([_, char]) => char === '#')
    .fold((set, [coords]) => set.add(coords.join(',')), new Set<string>());

  const mapSize = input
    .lines()
    .map((line) => line.chars().count())
    .count();
  const middle: number = ~~(mapSize / 2);
  const start: Coords = [middle, middle];
  const lastIndex = mapSize - 1;

  const counter = makeCounter(rocks, mapSize);

  const radius = Math.max(0, ~~(steps / mapSize) - 1);

  const odds = (((radius >> 1) << 1) + 1) ** 2;
  const evens = (((radius + 1) >> 1) << 1) ** 2;

  const oddCount = counter(start, mapSize * 4 + 1);
  const evenCount = counter(start, mapSize * 4);

  const smallSteps = (mapSize >> 1) - 1;

  const NEsmall = counter([0, lastIndex], smallSteps);
  const NWsmall = counter([lastIndex, lastIndex], smallSteps);
  const SEsmall = counter([0, 0], smallSteps);
  const SWsmall = counter([lastIndex, 0], smallSteps);

  const largeSteps = ((mapSize * 3) >> 1) - 1;

  const NElarge = counter([0, lastIndex], largeSteps);
  const NWlarge = counter([lastIndex, lastIndex], largeSteps);
  const SElarge = counter([0, 0], largeSteps);
  const SWlarge = counter([lastIndex, 0], largeSteps);

  const N = counter([middle, lastIndex], lastIndex);
  const E = counter([0, middle], lastIndex);
  const S = counter([middle, 0], lastIndex);
  const W = counter([lastIndex, middle], mapSize - 1);

  const main = odds * oddCount + evens * evenCount;
  const small = (radius + 1) * (NEsmall + NWsmall + SEsmall + SWsmall);
  const large = radius * (NElarge + NWlarge + SElarge + SWlarge);

  return main + small + large + N + E + S + W;
};

const makeCounter =
  (rocks: Set<string>, size: number) => (start: Coords, steps: number) =>
    countGrid(rocks, size, start, steps);
const countGrid = (
  rocks: Set<string>,
  size: number,
  start: Coords,
  steps: number,
) => {
  if (steps <= 0) return 0;
  const mod = steps & 1;
  const visited = new Set<string>();
  const queue: [Coords, steps: number][] = [[start, 0]];
  while (queue.length) {
    const [current, stepCount] = queue.shift();
    const key = current.join(',');
    if (visited.has(key)) continue;
    if (rocks.has(key)) continue;
    const [x, y] = current;
    if (x < 0 || x > size - 1 || y < 0 || y > size - 1) continue;
    visited.add(key);
    if (stepCount >= steps) continue;
    queue.push(
      [[x + 1, y], stepCount + 1],
      [[x - 1, y], stepCount + 1],
      [[x, y + 1], stepCount + 1],
      [[x, y - 1], stepCount + 1],
    );
  }
  return visited
    .toIter()
    .map((key) => key.split(',').map(Number) as Coords)
    .map((node) => manhattanDistance(node, start) & 1)
    .filter((n) => n === mod)
    .count();
};

const manhattanDistance = (a: Coords, b: Coords) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

type Coords = [x: number, y: number];
