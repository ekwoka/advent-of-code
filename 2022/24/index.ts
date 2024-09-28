/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * --- Day 24: Blizzard Basin ---
 * Part 1: >24h  10632
 * Part 2: >24h  10416
 * Simple pathfinding (BFS) with a bit of a twist: the obstacles are moving, so returning to prior positions at a later time can be advantageous
 */
import { readFile } from 'node:fs/promises';

const input: string = (await readFile('input.txt', 'utf8')).trim();

// Input consists of a grid showing the start and end, walls of the valley, and blizzards initial conditions and directions of travel
const grid = input.split('\n').map((line) => line.split(''));

// Blizzards only move within the valley, so we can ignore the outer walls for calculating their positions
const mapWidth = grid[0].length - 2;
const mapHeight = grid.length - 2;

const blizzards: ((turn: number) => Coord)[] = [];

// Here we just build simple functions for each blizzard that can return their position at any time
grid.forEach((line, y) =>
  line.forEach((cell, x) => {
    if (cell === '>')
      blizzards.push((turn) => [((turn + (x - 1)) % mapWidth) + 1, y]);
    if (cell === '<')
      blizzards.push((turn) => [
        mapWidth - ((turn + (mapWidth - x)) % mapWidth),
        y,
      ]);
    if (cell === 'v')
      blizzards.push((turn) => [x, ((turn + (y - 1)) % mapHeight) + 1]);
    if (cell === '^')
      blizzards.push((turn) => [
        x,
        mapHeight - ((turn + (mapHeight - y)) % mapHeight),
      ]);
  }),
);

const start = [grid[0].indexOf('.'), 0] as Coord;
const end = [grid[grid.length - 1].indexOf('.'), grid.length - 1] as Coord;

const neighborOffsets = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const getNeighbors = (coord: Coord) => {
  const [x, y] = coord;
  return neighborOffsets.map(([dx, dy]) => [x + dx, y + dy]) as Coord[];
};

const navigateValley = (start: Coord, end: Coord, startTurn = 0) => {
  const queue: [Coord, number][] = [[start, startTurn]];
  // Only needs to prune duplicate conditions (same position at same turn)
  const processed: Set<string> = new Set();
  while (queue.length) {
    const [coord, turn] = queue.shift();
    const key = coord.join(',') + turn;
    if (processed.has(key)) continue;
    processed.add(key);
    if (coord[0] === end[0] && coord[1] === end[1]) return turn;
    const [x, y] = coord;
    if (
      !(x > 0 && x < mapWidth + 1 && y > 0 && y < mapHeight + 1) &&
      start.some((v, i) => v !== coord[i])
    )
      continue;
    if (
      blizzards.some((blizzard) =>
        blizzard(turn).every((val, i) => val === coord[i]),
      )
    )
      continue;
    getNeighbors(coord).forEach((neighbor) => queue.push([neighbor, turn + 1]));
    queue.push([coord, turn + 1]);
  }
  return -1;
};

// Part one is just navigate start to end without hitting a blizzard
const partOne = navigateValley(start, end);
console.log('Part One:', partOne);

// Part two is navigating start to end to start to end (3 navigations in total)
const partTwo = navigateValley(start, end, navigateValley(end, start, partOne));
console.log('Part Two:', partTwo);

type Coord = [number, number];
