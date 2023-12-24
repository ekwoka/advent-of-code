import { AOCInput } from '../../utils';

/**
 * --- Day 21: ??? ---
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

  const diameter = ~~(steps / mapSize);

  const odds = (~~(diameter / 2) * 2 + 1) ** 2;
  const evens = (~~((diameter + 1) / 2) * 2) ** 2;

  const oddCount = counter(start, mapSize * 2 + 1);
  const evenCount = counter(start, mapSize * 2);

  const smallSteps = ~~(mapSize / 2) - 1;

  const NEsmall = counter([0, mapSize - 1], smallSteps);
  const NWsmall = counter([mapSize - 1, mapSize - 1], smallSteps);
  const SEsmall = counter([0, 0], smallSteps);
  const SWsmall = counter([mapSize - 1, 0], smallSteps);

  const largeSteps = ~~((mapSize * 3) / 2) - 1;

  const NElarge = counter([0, mapSize - 1], largeSteps);
  const NWlarge = counter([mapSize - 1, mapSize - 1], largeSteps);
  const SElarge = counter([0, 0], largeSteps);
  const SWlarge = counter([mapSize - 1, 0], largeSteps);

  const N = counter([start[0], mapSize - 1], mapSize - 1);
  const E = counter([0, start[1]], mapSize - 1);
  const S = counter([start[0], 0], mapSize - 1);
  const W = counter([mapSize - 1, start[1]], mapSize - 1);

  const main = odds * oddCount + evens * evenCount;
  const small = (diameter + 1) * (NEsmall + NWsmall + SEsmall + SWsmall);
  const large = diameter * (NElarge + NWlarge + SElarge + SWlarge);

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
  const mod = steps % 2;
  const visited = new Set<string>();
  const queue: [Coords, steps: number][] = [[start, 0]];
  while (queue.length) {
    const [current, stepCount] = queue.shift();
    const key = current.join(',');
    if (visited.has(key)) continue;
    if (rocks.has(key)) continue;
    visited.add(key);
    const [x, y] = current;
    if (x === 0 || x === size - 1 || y === 0 || y === size - 1) continue;
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
    .map((node) => manhattanDistance(node, start) % 2)
    .filter((n) => n === mod)
    .count();
};

const manhattanDistance = (a: Coords, b: Coords) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

type Coords = [x: number, y: number];

export const partTwo = (_input: AOCInput): number => {
  return 0;
};
