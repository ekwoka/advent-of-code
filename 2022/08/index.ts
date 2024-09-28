/**
 * --- Day 8: Treetop Tree House ---
 * Part 1: 00:11:11   1065
 * Part 2: 00:39:28   3547
 * This is a kind of mapping problem, just about finding, along the compass directions, the distances between trees of the same height.
 */

import { readFile } from 'node:fs/promises';

const input: string = await readFile('input.txt', 'utf-8');

const grid = input
  .split('\n')
  .filter(Boolean)
  .map((line) => line.split('').filter(Boolean).map(Number));

// Here we just take a coordinate (a tree), and output 4 arrays of all the other trees in each of the 4 cardinal directions.
const getSightLines = (x: number, y: number, grid: number[][]) => {
  const horizontal = [grid[y].slice(x + 1), grid[y].slice(0, x).reverse()];
  const vertical = [
    grid.slice(y + 1).map((row) => row[x]),
    grid
      .slice(0, y)
      .map((row) => row[x])
      .reverse(),
  ];
  return [horizontal, vertical];
};

// Part 1 consists of identifying which of the trees have a sightline to the edge of the grid (no other trees of equal or greater height in the way)
const part1 = (grid: number[][]) => {
  const areVisible = grid.flatMap((row, y) =>
    row.filter((tree, x) => {
      if ([0, row.length - 1].includes(x)) return true;
      if ([0, grid.length - 1].includes(y)) return true;
      return getSightLines(x, y, grid)
        .flat()
        .some((line) => line.every((cell) => cell < tree));
    }),
  );
  return areVisible.length;
};

// Part 2 consists of finding the distances in each direction that can be seen from a position, and multiplying them together, then returning the best score
const part2 = (grid: number[][]) => {
  const scenicScores = grid.flatMap((row, y) =>
    row.map((tree, x) => {
      const sightLines: number[][] = getSightLines(x, y, grid).flat();
      const ranges = sightLines.map((line) => {
        const range = line.findIndex((cell) => cell >= tree);
        return range === -1 ? line.length : range + 1;
      });
      return ranges.reduce((a, b) => a * b);
    }),
  );
  return Math.max(...scenicScores);
};

console.log('Part 1:', part1(grid));
console.log('Part 2:', part2(grid));
