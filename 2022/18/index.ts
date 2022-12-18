/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * --- Day 18: Boiling Boulders ---
 * Part 1: 00:32:11   3291
 * Part 2: 01:47:01   3054
 * Overall, pretty simple. First ideas mostly worked out. My first implementation for Part 2 had a bizarre error where it wasn't fully flooding the volume, but I couldn't figure out why. I ended up just reverting to a much simpler BFS.
 */
import { readFile } from 'node:fs/promises';

// Input consists of a list of 3D coordinates of lava droplets
const input: string[] = (await readFile('input.txt', 'utf8'))
  .split('\n')
  .filter(Boolean);

const dropSet = new Set(input);

const stringToCoord = (input: string): Coord3D =>
  input.split(',').map(Number) as Coord3D;

const getNeighbours = (input: Coord3D): Coord3D[] => {
  const offsets = [-1, 1];
  const neighbours: Coord3D[] = [];
  for (let i = 0; i < 3; i++)
    for (const offset of offsets)
      neighbours.push(
        input.map((v, j) => (i === j ? v + offset : v)) as Coord3D
      );
  return neighbours;
};
// Part 1 consists of finding the sides of the indicated drops that are not against another drop
const getExposedSideCount = (input: Coord3D): number =>
  getNeighbours(input).filter((coord) => !dropSet.has(coord.join(','))).length;

const makeFullVolume = (input: Coord3D[]): string[][][] => {
  const max = {
    x: Math.max(...input.map((v) => v[0])),
    y: Math.max(...input.map((v) => v[1])),
    z: Math.max(...input.map((v) => v[2])),
  };
  return Array.from({ length: max.z + 1 }, (_, z) =>
    Array.from({ length: max.y + 1 }, (_, y) =>
      Array.from({ length: max.x + 1 }, (_, x) =>
        dropSet.has([x, y, z].join(',')) ? '#' : '.'
      )
    )
  );
};

const floodVolume = (volume: string[][][]): string[][][] => {
  const queue: Coord3D[] = [[0, 0, 0]];
  while (queue.length) {
    const coord = queue.shift()!;
    const [x, y, z] = coord;
    if (!volume[z]?.[y]?.[x] || ['#', '@'].includes(volume[z][y][x])) continue;
    volume[z][y][x] = '@';
    queue.push(...getNeighbours(coord));
  }
  return volume;
};

// Part 2 involves finding the sides that have a path to the outside (not fully enclosed by lavadrops)
const getSidesExposedToWater = (input: string[]): number => {
  const lavaDrops = input.map(stringToCoord);
  const volume = floodVolume(makeFullVolume(lavaDrops));
  const exists = ([x, y, z]: Coord3D): boolean =>
    volume[z]?.[y]?.[x] !== undefined;
  const getExposedSideCount = (coord: Coord3D): number =>
    getNeighbours(coord).filter(
      ([x, y, z]) => !exists([x, y, z]) || volume[z][y][x] === '@'
    ).length;
  return lavaDrops.map(getExposedSideCount).reduce((a, b) => a + b);
};

console.log(
  'Part One:',
  input
    .map(stringToCoord)
    .map((coord) => getExposedSideCount(coord))
    .reduce((a, b) => a + b)
);
console.log('Part Two:', getSidesExposedToWater(input));

type Coord3D = [number, number, number];
