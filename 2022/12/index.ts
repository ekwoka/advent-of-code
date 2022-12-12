/**
 * --- Day 12: Hill Climbing Algorithm ---
 * Part 1: 00:26:09   1681
 * Part 2: 00:56:53   3494
 *
 * Finally a pathfinding problem!
 */
import { readFile } from 'node:fs/promises';

const input: string = await readFile('input.txt', 'utf8');

// The input is alphabetical to represent heights, but we need to convert it to numbers
const heightMap = (input: string): number => {
  if (input === 'S') return 0;
  if (input === 'E') return 25;
  return 'abcdefghijklmnopqrstuvwxyz'.indexOf(input);
};

let start: Coord = [0, 0];
let end: Coord = [1, 1];

const mountainGrid = input
  .split('\n')
  .filter(Boolean)
  .map((row, y) =>
    row
      .split('')
      .filter(Boolean)
      .map((cell, x) => {
        if (cell === 'S') start = [x, y];
        if (cell === 'E') end = [x, y];
        return heightMap(cell);
      })
  );

const neighborOffsets = [-1, 0, 1]
  .flatMap((x) => [-1, 0, 1].map((y) => [x, y] as Coord))
  .filter(([x, y]) => (x !== 0 || y !== 0) && (x === 0 || y === 0));
const getNeighbors = ([x, y]: Coord): Coord[] =>
  neighborOffsets
    .map(([dx, dy]) => [x + dx, y + dy] as Coord)
    .filter(
      ([x, y]) =>
        x >= 0 &&
        y >= 0 &&
        x < mountainGrid[0].length &&
        y < mountainGrid.length
    );

const getValueAt = (coord: Coord): number => {
  const [x, y] = coord;
  return mountainGrid[y][x];
};

// Part One involves finding the steps from the Start to the End
const findStepCount = (grid: number[][], start: Coord, end: Coord): number => {
  const queue: [Coord, number][] = [[start, 0]];
  const visited = new Set<string>();
  while (queue.length) {
    const [current, stepCount] = queue.shift()!;
    // Don't revisit a coordinate
    if (visited.has(current.toString())) continue;
    visited.add(current.toString());
    if (current.toString() === end.toString()) return stepCount;

    // Just used a simple BFS instead of priority queue, just due to the number of conditions needed to validate a "best chance" path. BFS ensures we get the shorted path, even if some time may be spent on obviously inferior paths.
    queue.push(
      ...getNeighbors(current)
        // Next steps can at most be 1 height heigher than the last, but can be much lower
        .filter((coord) => getValueAt(coord) <= getValueAt(current) + 1)
        .map((coord) => [coord, stepCount + 1] as [Coord, number])
    );
  }
  return Number.MAX_SAFE_INTEGER;
};

// Part 2 consists of finding the shortest valid path following the rules from Part 1 but from any 0 height point to the end. So we reverse the logic and find the shortest path from the End to any 0 height point.
const getHikingTrailLength = (grid: number[][], start: Coord): number => {
  const queue: [Coord, number][] = [[start, 0]];
  const visited = new Set<string>();
  while (queue.length) {
    const [current, stepCount] = queue.shift()!;
    if (visited.has(current.toString())) continue;
    if (getValueAt(current) === 0) return stepCount;
    visited.add(current.toString());

    queue.push(
      ...getNeighbors(current)
        .filter((coord) => getValueAt(coord) >= getValueAt(current) - 1)
        .map((coord) => [coord, stepCount + 1] as [Coord, number])
    );
  }
  return Number.MAX_SAFE_INTEGER;
};

console.log('Part One:', findStepCount(mountainGrid, start, end));
console.log('Part Two:', getHikingTrailLength(mountainGrid, end));

type Coord = [number, number];
