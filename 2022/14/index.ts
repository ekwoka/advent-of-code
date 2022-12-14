/**
 * --- Day 14: Regolith Reservoir ---
 * Part 1: 00:22:28    910
 * Part 2: 00:27:38    913
 * This puzzle involves parsing a list of rock paths into a grid representing a 2d vertical slice of a cave and simulating the fall of sand
 */
import { readFile } from 'node:fs/promises';

const input: string = await readFile('input.txt', 'utf8');

const rockPaths = input
  .split('\n')
  .filter(Boolean)
  .map((path) =>
    path.split(' -> ').map((point) => point.split(',').map(Number) as Coord)
  );

const maxX = Math.max(
  ...rockPaths.map((path) => Math.max(...path.map((point) => point[0])))
);
const maxY = Math.max(
  ...rockPaths.map((path) => Math.max(...path.map((point) => point[1])))
);
const caveGrid = Array.from({ length: maxY + 1 }, () =>
  Array.from({ length: maxX * 2 }, () => '.')
);
// Sand enters at x = 500, y = 0
caveGrid[0][500] = '+';

// This is a function for filling the rock positions between coordinates.
const fillLine = (start: Coord, end: Coord) => {
  const [x1, y1] = start;
  const [x2, y2] = end;
  const xChanges = x1 !== x2;
  const [min, max] = xChanges
    ? [x1, x2].sort((a, b) => a - b)
    : [y1, y2].sort((a, b) => a - b);
  for (let i = min; i <= max; i++)
    caveGrid[xChanges ? y1 : i][xChanges ? i : x1] = '#';
};

// This processes each continuous connection of rocks
rockPaths.forEach((path) =>
  path.reduce((last, next) => (fillLine(last, next), next))
);

const sandEntry: Coord = [500, 0];

// Sand steps by first falling directly down if able, then diagonally down-left, then diagonally down-right. It rests when unable to fall further. Null indicates that the sand has moved outside of the presented grid.
const stepSand = (grid: string[][], coord: Coord): [Coord, boolean] | null => {
  const [x, y] = coord;
  if (y === grid.length - 1) return null;
  if (grid[y + 1][x] === '.') return [[x, y + 1], false];
  if (x < 0) return null;
  if (grid[y + 1][x - 1] === '.') return [[x - 1, y], false];
  if (x > grid[0].length - 1) return null;
  if (grid[y + 1][x + 1] === '.') return [[x + 1, y], false];
  return [coord, true];
};

// Adds one block of sand to the cave
const addSand = (grid: string[][]): boolean => {
  let sand = sandEntry;
  if (grid[sand[1]][sand[0]] === 'o') return false;
  let done = false;
  while (done === false) {
    const result = stepSand(grid, sand);
    if (result === null) return false;
    [sand, done] = result;
  }

  grid[sand[1]][sand[0]] = 'o';
  return true;
};

// Part 1 consists of finding how many blocks of sand are added before the sand overflows the grid
const fillCave = (grid: string[][]) => {
  const cave = JSON.parse(JSON.stringify(grid));
  let sand = true;
  let count = -1;
  while (sand) {
    sand = addSand(cave);
    count++;
  }
  return count;
};

// Part 2 involves adding a floor to the cave and seeing how any blocks of sand enter before the sand entry point is blocked.
const fillCaveCompletely = (grid: string[][]) => {
  const cave = JSON.parse(JSON.stringify(grid)).concat(
    Array.from({ length: 2 }, (_, i) =>
      Array.from({ length: grid[0].length }, () => (i ? '#' : '.'))
    )
  );
  return fillCave(cave);
};

console.log('Part One:', fillCave(caveGrid));
console.log('Part Two:', fillCaveCompletely(caveGrid));

type Coord = [number, number];
