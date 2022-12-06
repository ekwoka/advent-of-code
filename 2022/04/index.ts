/**
 * --- Day 4: Camp Cleanup ---
 * Part 1: 00:22:12   9658
 * Part 2: 00:31:36   9961
 */

import { readFile } from 'node:fs/promises';

const input: string = await readFile('input.txt', 'utf-8');

const pairs = input.split('\n').filter(Boolean);

// Input consists of pairs of number ranges "2-4,6-8"
// The number ranges reference rooms an Elf is assigned to clean, and the pairs indicate two partnered elves.

const assignments = pairs.map((pair) =>
  pair.split(`,`).map((room) => room.split(`-`).map(Number))
);

const pointInRange = (point: number, range: [number, number]) =>
  point >= range[0] && point <= range[1];

const rangeInRange = (range: [number, number], range2: [number, number]) =>
  (range[0] <= range2[0] && range[1] >= range2[1]) ||
  (range[0] >= range2[0] && range[1] <= range2[1]);

// Part 1 consists in finding any room assignments where one elf in a team will completely clean all of the rooms the other else is assigned to (that one range completely includes the other range)
console.log(
  'Part 1:',
  assignments.filter((groups) =>
    rangeInRange(...(groups as [[number, number], [number, number]]))
  ).length
);

// Part 2 consists in finding room assignments where both elves in a team will clean at least one room in common
console.log(
  'Part 2:',
  assignments.filter((groups) => {
    const output = groups.some((group, i) =>
      group.some((room) =>
        pointInRange(room, groups[(i + 1) % 2] as [number, number])
      )
    );
    return output;
  }).length
);
