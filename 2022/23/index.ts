/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * --- Day 23: Unstable Diffusion ---
 * Part 1: >24h  13581
 * Part 2: >24h  13341
 * This was completed days later after Christmas.
 * This problem is a pretty simple game of life style simulation
 */
import { readFile } from 'node:fs/promises';

const input: string = (await readFile('input.txt', 'utf8')).trim();

// Input consists of a grid of # and . characters indicating positions of elves and empty spaces respectively
const initialPositions: Coord[] = input.split('\n').flatMap((line, y) =>
  line
    .split('')
    .map((char, x) => (char === '#' ? [x, y] : false))
    .filter(Boolean),
) as Coord[];

const offsets: Record<string, Coord[]> = {
  N: [
    [-1, -1],
    [0, -1],
    [1, -1],
  ],
  E: [
    [1, -1],
    [1, 0],
    [1, 1],
  ],
  S: [
    [-1, 1],
    [0, 1],
    [1, 1],
  ],
  W: [
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ],
};

// These are simple utilities for converting coordinates to strings and back
const coordToString = (coord: Coord) => coord.join(',');
const stringtoCoord = (str: string) => str.split(',').map(Number) as Coord;
const getDuplicates = (arr: string[]) =>
  arr.filter((item, index) => arr.indexOf(item) !== index);

// this is the main simulation function for processing the elves position changes
const simulateSteps = (
  steps: number,
  noMoveCallback?: (round: number) => void,
) => {
  const positions: Set<string> = new Set(
    initialPositions.map((p) => coordToString(p)),
  );
  const dirs = ['N', 'S', 'W', 'E'] as (keyof typeof offsets)[];
  const checkDirection = (
    direction: keyof typeof offsets,
    x: number,
    y: number,
  ) =>
    offsets[direction].every(
      ([dx, dy]) => !positions.has(coordToString([x + dx, y + dy])),
    );

  for (let i = 1; i <= steps; i++) {
    const elfPositions = [...positions].map(stringtoCoord).map((coord) => {
      // elf does not move if there are no other elves near next to it
      if (dirs.every((dir) => checkDirection(dir, ...coord)))
        return [coordToString(coord), coordToString(coord)];

      // elf checks each direction to see if there is a valid move it can make
      for (const dir of dirs)
        if (checkDirection(dir, ...coord))
          return [
            coordToString(coord),
            coordToString([
              coord[0] + offsets[dir][1][0],
              coord[1] + offsets[dir][1][1],
            ]),
          ];
      // elf does nothing if there are no valid moves
      return [coordToString(coord), coordToString(coord)];
    });

    // We cannot have multiple elves enter the same space
    const duplicates = getDuplicates(elfPositions.map(([_, p]) => p));
    positions.clear();

    // for part 2 we need to halt the simulation if no elves need to move
    if (elfPositions.every(([p, n]) => p === n) && noMoveCallback) {
      noMoveCallback(i);
      break;
    }

    // update the positions of the elves
    elfPositions.forEach(([p, n]) =>
      positions.add(duplicates.includes(n) ? p : n),
    );

    // change the first direction considered by the elves in the loop
    dirs.push(dirs.shift());
  }
  return positions;
};

// get the bounding box of the elves positions
const getContainingRect = (coords: string[]) => {
  const [minX, minY, maxX, maxY] = coords.reduce(
    ([minX, minY, maxX, maxY], coord) => {
      const [x, y] = stringtoCoord(coord);
      return [
        Math.min(minX, x),
        Math.min(minY, y),
        Math.max(maxX, x),
        Math.max(maxY, y),
      ];
    },
    [
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ],
  );
  return { minX, minY, maxX, maxY };
};

// Part one consists of simulating positions for 10 steps and then counting the number of empty spaces contained in the bounding box
const PartOne = () => {
  const positions = simulateSteps(10);
  const { minX, minY, maxX, maxY } = getContainingRect([...positions]);
  const totalSpaces = (maxX - minX + 1) * (maxY - minY + 1);
  const filledSpaces = [...positions].length;
  return totalSpaces - filledSpaces;
};

// Part two is simply determining at which step the simulation halts
const PartTwo = () => new Promise((res) => simulateSteps(1_000_000, res));

console.log('Part One:', PartOne());
console.log('Part Two:', await PartTwo());

type Coord = [number, number];
